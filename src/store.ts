// Store quản lý toàn bộ dữ liệu, bộ đếm thời gian thực và hành vi của ứng dụng
import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import {
  Language,
  PageId,
  SecurityStatus,
  FenceStatus,
  FenceZoneId,
  FenceZone,
  Device,
  EventItem,
  SensitivityConfig,
  ChartPoint,
  ToastInfo,
} from './types';
import {
  initialZones,
  initialEvents,
  defaultSensitivityConfig,
  generateInitialChartData,
} from './mockData';
import { getDevices, setSirenState } from './services/deviceService';
import { setLanguage as setI18nLanguage, getLanguage } from './i18n';

const SENSITIVITY_STORAGE_KEY = 'smart_fence_sensitivity';

interface StoreContextValue {
  // Điều hướng & Cài đặt
  page: PageId;
  setPage: (page: PageId) => void;
  language: Language;
  changeLanguage: (lang: Language) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // Giám sát
  isMonitoring: boolean;
  toggleMonitoring: () => void;
  currentTime: string;
  dangerBannerDismissed: boolean;
  dismissDangerBanner: () => void;

  // Môi trường
  humidity: number;
  chartData: ChartPoint[];

  // Hàng rào & Thiết bị
  zones: FenceZone[];
  selectedZoneId: FenceZoneId;
  setSelectedZoneId: (id: FenceZoneId) => void;
  devices: Device[];
  selectedDeviceId: string | null;
  setSelectedDeviceId: (id: string | null) => void;
  toggleDeviceStatus: (deviceId: string) => void;
  setSiren: (id: string, on: boolean) => Promise<void>;
  toggleLaserPart: (part: 'transmitter' | 'receiver') => void;
  isSirenActive: boolean;

  // Cảnh báo & Sự kiện
  events: EventItem[];
  createTestEvent: (zoneId: FenceZoneId, type: 'suspicious' | 'intrusion') => void;
  resolveEvent: (eventId: string) => void;
  markFalseAlarm: (eventId: string) => void;

  // Cấu hình độ nhạy
  sensitivityConfig: SensitivityConfig;
  setSensitivityConfig: React.Dispatch<React.SetStateAction<SensitivityConfig>>;
  saveSensitivityConfig: (config: SensitivityConfig) => void;
  resetSensitivityConfig: () => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (messageKey: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Giá trị tính toán (Computed)
  securityStatus: SecurityStatus;
  zoneStatuses: Record<FenceZoneId, FenceStatus>;
  unresolvedCount: number;
  unresolvedDangerCount: number;
  activeDevicesCount: number;
  totalDevicesCount: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// Hàm phụ trợ kẹp giá trị số trong khoảng [min, max]
const clamp = (val: number, min: number, max: number): number => Math.max(min, Math.min(max, val));

// Lấy giờ hiện tại dạng HH:mm:ss
const getCurrentTimeStr = (): string => new Date().toTimeString().split(' ')[0];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Trạng thái giao diện
  const [page, setPage] = useState<PageId>('overview');
  const [language, setLangState] = useState<Language>(getLanguage);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>(getCurrentTimeStr);
  const [dangerBannerDismissed, setDangerBannerDismissed] = useState<boolean>(false);

  // Số liệu môi trường giả lập ban đầu
  const [humidity, setHumidity] = useState<number>(68);
  const [chartData, setChartData] = useState<ChartPoint[]>(generateInitialChartData);

  // Danh sách đoạn hàng rào & thiết bị (đọc qua service)
  const [zones] = useState<FenceZone[]>(initialZones);
  const [selectedZoneId, setSelectedZoneId] = useState<FenceZoneId>('A');
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  useEffect(() => {
    getDevices().then((res) => setDevices(res));
  }, []);

  // Danh sách sự kiện
  const [events, setEvents] = useState<EventItem[]>(initialEvents);

  // Cấu hình độ nhạy (lấy từ localStorage nếu có)
  const [sensitivityConfig, setSensitivityConfig] = useState<SensitivityConfig>(() => {
    try {
      const saved = localStorage.getItem(SENSITIVITY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Bỏ qua lỗi parse
    }
    return defaultSensitivityConfig;
  });

  // Quản lý Toast
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Cờ theo dõi vượt ngưỡng độ ẩm
  const humidityExceededRef = useRef<boolean>(false);

  // Hàm hiển thị Toast thông báo
  const showToast = (messageKey: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, messageKey, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  // Đổi ngôn ngữ
  const changeLanguage = (lang: Language) => {
    setI18nLanguage(lang);
    setLangState(lang);
  };

  // Bật / tắt chế độ giám sát
  const toggleMonitoring = () => {
    setIsMonitoring((prev) => {
      const next = !prev;
      showToast(next ? 'toast_monitoring_resumed' : 'toast_monitoring_paused', 'info');
      return next;
    });
  };

  // Tắt banner cảnh báo nguy hiểm
  const dismissDangerBanner = () => {
    setDangerBannerDismissed(true);
  };

  // Bật/tắt trạng thái kết nối Online/Offline của thiết bị
  const toggleDeviceStatus = (deviceId: string) => {
    const timeStr = getCurrentTimeStr();
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.id !== deviceId) return dev;
        const nextStatus = !dev.isOnline;
        if (!nextStatus) {
          // Khi chuyển sang Offline -> sinh sự kiện cảnh báo mất kết nối
          const newEvent: EventItem = {
            id: `EV-${Date.now().toString().slice(-4)}`,
            time: timeStr,
            location: dev.location,
            type: 'sensor_disconnected',
            severity: 'warning',
            status: 'unresolved',
          };
          setEvents((e) => [newEvent, ...e]);
          showToast('toast_device_offline', 'error');
        } else {
          showToast('toast_device_online', 'success');
        }

        let laserDetails = dev.laserDetails;
        if (dev.type === 'laser') {
          laserDetails = {
            transmitterOnline: nextStatus,
            receiverOnline: nextStatus,
            beamStatus: nextStatus ? 'clear' : 'broken',
            signalPercent: nextStatus ? 100 : 0,
          };
        }

        return {
          ...dev,
          isOnline: nextStatus,
          lastValue: nextStatus ? (dev.type === 'laser' ? '100%' : dev.lastValue) : (dev.type === 'camera' ? 'status_offline' : '0%'),
          laserDetails,
          lastUpdated: timeStr,
        };
      })
    );
  };

  // Bật/tắt riêng từng bộ phận của Laser (Bộ phát / Bộ thu)
  const toggleLaserPart = (part: 'transmitter' | 'receiver') => {
    const timeStr = getCurrentTimeStr();
    setDevices((prev) =>
      prev.map((dev) => {
        if (dev.type !== 'laser') return dev;
        const current = dev.laserDetails || {
          transmitterOnline: true,
          receiverOnline: true,
          beamStatus: 'clear',
          signalPercent: 100,
        };
        const transmitterOnline = part === 'transmitter' ? !current.transmitterOnline : current.transmitterOnline;
        const receiverOnline = part === 'receiver' ? !current.receiverOnline : current.receiverOnline;
        const isOnline = transmitterOnline && receiverOnline;
        const beamStatus = isOnline ? 'clear' : 'broken';
        const signalPercent = isOnline ? 100 : 0;

        return {
          ...dev,
          isOnline,
          lastValue: `${signalPercent}%`,
          laserDetails: {
            transmitterOnline,
            receiverOnline,
            beamStatus,
            signalPercent,
          },
          lastUpdated: timeStr,
        };
      })
    );
  };

  // Điều khiển bật/tắt còi báo động qua service
  const setSiren = async (id: string, on: boolean) => {
    const dev = devices.find((d) => d.id === id);
    if (!dev || !dev.isOnline) {
      return;
    }
    const result = await setSirenState(id, on);
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              sirenOn: result,
              lastValue: result ? 'siren_state_on' : 'siren_state_off',
              lastUpdated: getCurrentTimeStr(),
            }
          : d
      )
    );
    showToast(result ? 'toast_siren_on' : 'toast_siren_off', 'info');
  };

  // Tạo sự kiện thử nghiệm tại hàng rào
  const createTestEvent = (zoneId: FenceZoneId, type: 'suspicious' | 'intrusion') => {
    const timeStr = getCurrentTimeStr();
    const newEvent: EventItem = {
      id: `EV-${Date.now().toString().slice(-4)}`,
      time: timeStr,
      location: zoneId,
      type: type === 'intrusion' ? 'laser_break' : 'vibration',
      severity: type === 'intrusion' ? 'danger' : 'warning',
      status: 'unresolved',
    };
    setEvents((prev) => [newEvent, ...prev]);
    // Nếu có sự kiện nguy hiểm mới, mở lại banner đỏ
    if (type === 'intrusion') {
      setDangerBannerDismissed(false);
    }
    showToast('toast_test_event_created', 'success');
  };

  // Đánh dấu sự kiện đã xử lý
  const resolveEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, status: 'resolved' } : ev))
    );
    showToast('toast_event_resolved', 'success');
  };

  // Đánh dấu sự kiện là báo giả
  const markFalseAlarm = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, status: 'false_alarm' } : ev))
    );
    showToast('toast_event_false_alarm', 'info');
  };

  // Lưu cấu hình độ nhạy vào localStorage
  const saveSensitivityConfig = (cfg: SensitivityConfig) => {
    localStorage.setItem(SENSITIVITY_STORAGE_KEY, JSON.stringify(cfg));
    setSensitivityConfig(cfg);
    showToast('toast_saved_config', 'success');
  };

  // Khôi phục cấu hình độ nhạy mặc định
  const resetSensitivityConfig = () => {
    localStorage.setItem(SENSITIVITY_STORAGE_KEY, JSON.stringify(defaultSensitivityConfig));
    setSensitivityConfig(defaultSensitivityConfig);
    showToast('toast_reset_config', 'info');
  };

  // =========================================================================
  // TIMER THỜI GIAN THỰC DUY NHẤT (Chu kỳ 2 giây)
  // GHI CHÚ QUAN TRỌNG: Đây là đoạn mô phỏng thời gian thực.
  // Khi kết nối hệ thống thật, thay thế khối setInterval này bằng MQTT client
  // (e.g., mqtt.js lắng nghe topic 'fence/+/telemetry') hoặc WebSocket / REST API.
  // =========================================================================
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Nếu giám sát đang tắt: dừng cập nhật số liệu và không sinh sự kiện
      if (!isMonitoring) {
        return;
      }

      const timeStr = getCurrentTimeStr();
      setCurrentTime(timeStr);

      // Dao động ngẫu nhiên các thông số môi trường (độ ẩm)
      setHumidity((prevH) => {
        const deltaH = (Math.random() * 2 - 1); // ±1%
        const nextH = Math.round(clamp(prevH + deltaH, 30, 95));

        // Kiểm tra ngưỡng cảnh báo độ ẩm
        if (nextH > sensitivityConfig.humidityThreshold) {
          if (!humidityExceededRef.current) {
            humidityExceededRef.current = true;
            const newEv: EventItem = {
              id: `EV-${Date.now().toString().slice(-4)}`,
              time: timeStr,
              location: 'A',
              type: 'high_humidity',
              severity: 'warning',
              status: 'unresolved',
            };
            setEvents((e) => [newEv, ...e]);
          }
        } else {
          humidityExceededRef.current = false;
        }

        return nextH;
      });

      // Cập nhật giá trị đo cho các thiết bị ĐANG ONLINE
      setDevices((prevDevs) =>
        prevDevs.map((dev) => {
          if (!dev.isOnline) return dev; // Giữ nguyên thiết bị offline

          let val = dev.lastValue;
          let laserDetails = dev.laserDetails;

          if (dev.type === 'laser') {
            const hasLaserCut = events.some(
              (ev) => ev.type === 'laser_break' && ev.status === 'unresolved'
            );
            if (hasLaserCut) {
              val = '0%';
              laserDetails = {
                transmitterOnline: dev.laserDetails?.transmitterOnline ?? true,
                receiverOnline: dev.laserDetails?.receiverOnline ?? true,
                beamStatus: 'broken',
                signalPercent: 0,
              };
            } else {
              const pct = Math.floor(98 + Math.random() * 3);
              val = `${pct}%`;
              laserDetails = {
                transmitterOnline: dev.laserDetails?.transmitterOnline ?? true,
                receiverOnline: dev.laserDetails?.receiverOnline ?? true,
                beamStatus: 'clear',
                signalPercent: pct,
              };
            }
          } else if (dev.type === 'humidity') {
            val = `${humidity}%`;
          } else if (dev.type === 'siren') {
            val = dev.sirenOn ? 'siren_state_on' : 'siren_state_off';
          } else if (dev.type === 'camera') {
            val = dev.isOnline ? 'status_online' : 'status_offline';
          } else if (dev.type === 'gateway') {
            const onlineCount = prevDevs.filter((d) => d.isOnline).length;
            val = `Mesh (${onlineCount})`;
          }

          return {
            ...dev,
            lastValue: val,
            laserDetails,
            lastUpdated: timeStr,
          };
        })
      );

      // Thêm 1 điểm mới vào biểu đồ (giữ tối đa 30 điểm gần nhất)
      setChartData((prevPoints) => {
        const nextPoint: ChartPoint = {
          time: timeStr,
          humidity,
        };
        const updated = [...prevPoints, nextPoint];
        return updated.length > 30 ? updated.slice(updated.length - 30) : updated;
      });
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isMonitoring, humidity, sensitivityConfig.humidityThreshold, events]);

  // =========================================================================
  // TÍNH TOÁN TRẠNG THÁI HỆ THỐNG VÀ CÁC ĐOẠN HÀNG RÀO
  // =========================================================================
  const securityStatus = useMemo<SecurityStatus>(() => {
    if (!isMonitoring) return 'paused';
    const hasUnresolvedDanger = events.some(
      (ev) => ev.severity === 'danger' && ev.status === 'unresolved'
    );
    if (hasUnresolvedDanger) return 'intrusion';
    const hasUnresolvedWarning = events.some(
      (ev) => ev.severity === 'warning' && ev.status === 'unresolved'
    );
    if (hasUnresolvedWarning) return 'suspicious';
    return 'safe';
  }, [isMonitoring, events]);

  const zoneStatuses = useMemo<Record<FenceZoneId, FenceStatus>>(() => {
    const statuses: Record<FenceZoneId, FenceStatus> = {
      A: 'safe',
    };

    const zone = zones[0];
    if (zone) {
      const dev = devices.find((d) => d.id === zone.deviceId);
      if (dev && !dev.isOnline) {
        statuses[zone.id] = 'offline';
        return statuses;
      }

      const zoneEvents = events.filter(
        (ev) => ev.location === zone.id && ev.status === 'unresolved'
      );
      const hasDanger = zoneEvents.some((ev) => ev.severity === 'danger');
      if (hasDanger) {
        statuses[zone.id] = 'intrusion';
        return statuses;
      }
      const hasWarning = zoneEvents.some((ev) => ev.severity === 'warning');
      if (hasWarning) {
        statuses[zone.id] = 'suspicious';
        return statuses;
      }
      statuses[zone.id] = 'safe';
    }

    return statuses;
  }, [zones, devices, events]);

  const isSirenActive = useMemo(
    () => devices.find((d) => d.type === 'siren')?.sirenOn ?? false,
    [devices]
  );

  const unresolvedCount = useMemo(
    () => events.filter((ev) => ev.status === 'unresolved').length,
    [events]
  );

  const unresolvedDangerCount = useMemo(
    () => events.filter((ev) => ev.status === 'unresolved' && ev.severity === 'danger').length,
    [events]
  );

  const activeDevicesCount = useMemo(
    () => devices.filter((d) => d.isOnline).length,
    [devices]
  );

  const totalDevicesCount = devices.length;

  const value: StoreContextValue = {
    page,
    setPage,
    language,
    changeLanguage,
    isSettingsOpen,
    setIsSettingsOpen,
    isMonitoring,
    toggleMonitoring,
    currentTime,
    dangerBannerDismissed,
    dismissDangerBanner,
    humidity,
    chartData,
    zones,
    selectedZoneId,
    setSelectedZoneId,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    toggleDeviceStatus,
    setSiren,
    toggleLaserPart,
    isSirenActive,
    events,
    createTestEvent,
    resolveEvent,
    markFalseAlarm,
    sensitivityConfig,
    setSensitivityConfig,
    saveSensitivityConfig,
    resetSensitivityConfig,
    toasts,
    showToast,
    removeToast,
    securityStatus,
    zoneStatuses,
    unresolvedCount,
    unresolvedDangerCount,
    activeDevicesCount,
    totalDevicesCount,
  };

  return React.createElement(StoreContext.Provider, { value }, children);
};

// Hook useStore để các trang truy cập trạng thái toàn cục
export const useStore = (): StoreContextValue => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
