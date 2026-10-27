// Các kiểu dữ liệu chính cho hệ thống Smart Fence

export type Language = 'vi' | 'en';

export type PageId = 'overview' | 'fence' | 'sensitivity' | 'alerts' | 'devices';

// Trạng thái an ninh toàn hệ thống và từng đoạn
export type SecurityStatus = 'safe' | 'suspicious' | 'intrusion' | 'paused';
export type FenceStatus = 'safe' | 'suspicious' | 'intrusion' | 'offline';

// Mức độ nghiêm trọng của sự kiện
export type Severity = 'info' | 'warning' | 'danger';

// Trạng thái xử lý sự kiện
export type EventStatus = 'unresolved' | 'resolved' | 'false_alarm';

// Loại sự kiện
export type EventType =
  | 'laser_break'
  | 'vibration'
  | 'high_humidity'
  | 'sensor_disconnected'
  | 'manual_test';

// Đoạn hàng rào (chỉ 1 đoạn A)
export type FenceZoneId = 'A';

export interface FenceZone {
  id: FenceZoneId;
  deviceId: string;
  nameKey: string;
}

// Kiểu thiết bị
export type DeviceType = 'laser' | 'humidity' | 'siren' | 'camera' | 'gateway';

export interface LaserDetails {
  transmitterOnline: boolean;
  receiverOnline: boolean;
  beamStatus: 'clear' | 'broken';
  signalPercent: number;
}

export interface Device {
  id: string;
  nameKey: string;
  type: DeviceType;
  location: FenceZoneId | 'gateway';
  isOnline: boolean;
  lastValue: string;
  lastUpdated: string;
  laserDetails?: LaserDetails;
  sirenOn?: boolean;
  cameraStreamUrl?: string;
}

// Nhật ký sự kiện cảnh báo
export interface EventItem {
  id: string;
  time: string;
  location: FenceZoneId | 'gateway' | 'system';
  type: EventType;
  severity: Severity;
  status: EventStatus;
}

// Chế độ độ nhạy
export type SensitivityMode = 'normal' | 'strong_wind' | 'leaf_fall' | 'custom';

export interface SensitivityConfig {
  mode: SensitivityMode;
  laserSensitivity: number; // 10 - 100%
  confirmCount: number;     // 1 - 10 lần
  confirmWindow: number;    // 1, 2, 3, 5, 10 giây
  humidityThreshold: number;// 30 - 95%
}

// Điểm dữ liệu biểu đồ
export interface ChartPoint {
  time: string;
  humidity: number;
}

// Thông báo Toast
export interface ToastInfo {
  id: string;
  messageKey: string;
  type: 'success' | 'error' | 'info';
}
