// Bảng dịch đa ngôn ngữ Việt - Anh và hàm t(key)
import { Language } from './types';

const STORAGE_KEY = 'smart_fence_language';

// Khởi tạo ngôn ngữ từ localStorage (mặc định tiếng Việt)
const getStoredLanguage = (): Language => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'en' ? 'en' : 'vi';
};

let currentLanguage: Language = getStoredLanguage();

// Hàm cập nhật ngôn ngữ hiện tại
export const setLanguage = (lang: Language) => {
  currentLanguage = lang;
  localStorage.setItem(STORAGE_KEY, lang);
};

export const getLanguage = (): Language => currentLanguage;

const vi = {
  // Tiêu đề & huy hiệu chung
  app_title: 'SMART FENCE',
  app_subtitle: 'Hệ thống Hàng rào An ninh IoT',
  simulated_data_badge: 'Dữ liệu mô phỏng',
  updated_at: 'Cập nhật lúc',
  all: 'Tất cả',
  close: 'Đóng',
  save: 'Lưu cấu hình',
  reset_default: 'Khôi phục mặc định',
  confirm: 'Xác nhận',
  cancel: 'Hủy',

  // Thanh điều hướng Sidebar
  nav_overview: 'Tổng quan',
  nav_fence: 'Giám sát hàng rào',
  nav_sensitivity: 'Cấu hình độ nhạy',
  nav_alerts: 'Cảnh báo & Lịch sử',
  nav_devices: 'Quản lý thiết bị',
  collapse_sidebar: 'Thu gọn thanh bên',
  expand_sidebar: 'Mở rộng thanh bên',

  // Trạng thái an ninh & kết nối
  status_safe: 'An toàn',
  status_suspicious: 'Nghi ngờ',
  status_intrusion: 'Xâm nhập',
  status_paused: 'Tạm dừng giám sát',
  status_online: 'Trực tuyến',
  status_offline: 'Ngoại tuyến',

  // Nút bật/tắt giám sát
  btn_monitoring_on: 'Bật giám sát',
  btn_monitoring_off: 'Tắt giám sát',
  monitoring_state_active: 'Đang giám sát',
  monitoring_state_paused: 'Tạm dừng giám sát',

  // Trang Tổng quan
  card_security_status: 'Trạng thái an ninh',
  card_active_sensors: 'Cảm biến hoạt động',
  card_alerts_today: 'Cảnh báo hôm nay',
  card_humidity: 'Độ ẩm môi trường',
  card_temperature: 'Nhiệt độ hiện tại',
  card_wind_speed: 'Tốc độ gió',
  chart_title: 'Biểu đồ nhiệt độ & độ ẩm thời gian thực',
  chart_timespan: '30 giây gần nhất',
  chart_temp_label: 'Nhiệt độ (°C)',
  chart_humidity_label: 'Độ ẩm (%)',
  recent_events_title: '5 sự kiện gần nhất',

  // Trang Hàng rào
  fence_overview_title: 'Sơ đồ trạng thái 4 đoạn hàng rào',
  zone_label: 'Đoạn',
  zone_a: 'Đoạn A (Cổng chính)',
  zone_b: 'Đoạn B (Phía Tây)',
  zone_c: 'Đoạn C (Phía Nam)',
  zone_d: 'Đoạn D (Phía Đông)',
  zone_detail_title: 'Chi tiết đoạn hàng rào',
  zone_name_label: 'Tên đoạn',
  zone_device_label: 'Thiết bị phụ trách',
  zone_status_label: 'Trạng thái hiện tại',
  zone_metrics_label: 'Thông số cảm biến thời gian thực',
  btn_create_test_event: 'Tạo sự kiện thử nghiệm',
  test_modal_title: 'Tạo sự kiện thử nghiệm tại hàng rào',
  test_select_zone: 'Chọn đoạn hàng rào',
  test_select_type: 'Chọn mức độ sự kiện',
  test_option_suspicious: 'Nghi ngờ (Cảnh báo rung)',
  test_option_intrusion: 'Xâm nhập (Cắt tia laser)',

  // Trang Độ nhạy
  sensitivity_title: 'Cấu hình độ nhạy hàng rào',
  sensitivity_desc: 'Điều chỉnh ngưỡng phát hiện tia laser và cảm biến môi trường',
  mode_normal: 'Bình thường',
  mode_strong_wind: 'Gió mạnh',
  mode_leaf_fall: 'Mùa lá rụng',
  mode_custom: 'Tùy chỉnh',
  laser_sensitivity_label: 'Độ nhạy cảm biến laser (%)',
  confirm_count_label: 'Số lần phát hiện để xác nhận',
  confirm_window_label: 'Thời gian xác nhận (giây)',
  unit_seconds: 'giây',
  humidity_threshold_label: 'Ngưỡng cảnh báo độ ẩm (%)',
  sensitivity_note: 'Ghi chú: Các giá trị chỉ để minh họa, chưa kiểm chứng trên thiết bị thật.',
  confirm_reset_prompt: 'Bạn có chắc chắn muốn khôi phục về cấu hình mặc định ban đầu không?',

  // Trang Cảnh báo & Lịch sử
  alerts_title: 'Danh sách cảnh báo và lịch sử sự kiện',
  alerts_desc: 'Xem và xử lý các cảnh báo an ninh cùng lịch sử sự kiện',
  filter_event_type: 'Lọc loại sự kiện',
  filter_severity: 'Lọc mức độ',
  filter_status: 'Lọc trạng thái xử lý',
  col_id: 'Mã SK',
  col_time: 'Thời gian',
  col_location: 'Vị trí',
  col_type: 'Loại sự kiện',
  col_severity: 'Mức độ',
  col_status: 'Trạng thái',
  col_actions: 'Hành động',
  no_events: 'Không tìm thấy sự kiện nào phù hợp.',
  btn_resolve: 'Đã xử lý',
  btn_false_alarm: 'Báo giả',
  danger_banner_text: 'CẢNH BÁO NGUY HIỂM: Phát hiện xâm nhập an ninh chưa xử lý tại hệ thống!',
  dismiss_banner: 'Bỏ qua',

  // Trang Thiết bị
  devices_title: 'Quản lý thiết bị IoT hàng rào',
  devices_desc: 'Danh sách và trạng thái kết nối các thiết bị IoT',
  col_device_id: 'Mã thiết bị',
  col_device_name: 'Tên thiết bị',
  col_device_type: 'Loại',
  col_device_location: 'Vị trí',
  col_device_status: 'Kết nối',
  col_device_val: 'Giá trị gần nhất',
  col_device_updated: 'Cập nhật lúc',
  device_detail_title: 'Chi tiết thiết bị',
  device_toggle_online: 'Chuyển sang Trực tuyến',
  device_toggle_offline: 'Chuyển sang Ngoại tuyến',

  // Loại sự kiện
  event_laser_break: 'Cắt tia laser',
  event_vibration: 'Cảnh báo rung chấn',
  event_strong_wind: 'Gió mạnh vượt ngưỡng',
  event_high_humidity: 'Độ ẩm môi trường cao',
  event_sensor_disconnected: 'Cảm biến mất kết nối',
  event_manual_test: 'Kiểm tra mô phỏng',

  // Mức độ nghiêm trọng
  severity_info: 'Thông tin',
  severity_warning: 'Cảnh báo',
  severity_danger: 'Nguy hiểm',

  // Trạng thái sự kiện
  status_unresolved: 'Chưa xử lý',
  status_resolved: 'Đã xử lý',
  status_false_alarm: 'Báo giả',

  // Loại thiết bị
  device_type_laser: 'Cảm biến Laser',
  device_type_humidity: 'Cảm biến Độ ẩm',
  device_type_temperature: 'Cảm biến Nhiệt độ',
  device_type_gateway: 'Bộ điều khiển Gateway',
  device_type_siren: 'Còi báo động',
  device_type_camera: 'Camera',
  device_location_fence_top: 'Phía trên hàng rào (Đoạn A)',
  laser_transmitter: 'Bộ phát',
  laser_receiver: 'Bộ thu',
  laser_beam: 'Tia laser',
  beam_clear: 'Thông',
  beam_broken: 'Bị ngắt',
  laser_signal_strength: 'Tín hiệu thu',
  card_siren: 'Còi báo động',
  siren_state_on: 'Bật',
  siren_state_off: 'Tắt',
  btn_siren_on: 'Bật còi',
  btn_siren_off: 'Tắt còi',
  toast_siren_on: 'Đã bật còi báo động',
  toast_siren_off: 'Đã tắt còi báo động',
  camera_modal_title: 'Hình ảnh Camera - CAM-A01',
  camera_no_signal: 'Không có tín hiệu',
  camera_stream_live: 'Trực tiếp',
  view_camera: 'Xem Camera',
  fence_devices_title: 'Thiết bị bảo vệ hàng rào (Đoạn A)',
  device_status_detail: 'Thông số chi tiết',
  select_device_prompt: 'Chọn thiết bị để xem thông số chi tiết',

  // Vị trí
  loc_zone_a: 'Đoạn A',
  loc_zone_b: 'Đoạn B',
  loc_zone_c: 'Đoạn C',
  loc_zone_d: 'Đoạn D',
  loc_gateway: 'Trung tâm',
  loc_system: 'Hệ thống',

  // Cài đặt
  settings_title: 'Cài đặt hệ thống',
  setting_language_title: 'Ngôn ngữ',
  lang_vi: 'Tiếng Việt',
  lang_en: 'English',

  // Thông báo Toast
  toast_saved_config: 'Đã lưu cấu hình độ nhạy thành công',
  toast_reset_config: 'Đã khôi phục cấu hình mặc định',
  toast_invalid_humidity: 'Ngưỡng độ ẩm không hợp lệ (nhập từ 30% đến 95%)',
  toast_test_event_created: 'Đã tạo sự kiện thử nghiệm mới thành công',
  toast_event_resolved: 'Đã cập nhật sự kiện: Đã xử lý',
  toast_event_false_alarm: 'Đã cập nhật sự kiện: Báo giả',
  toast_device_online: 'Thiết bị đã chuyển sang Trực tuyến',
  toast_device_offline: 'Thiết bị đã ngắt kết nối (Ngoại tuyến)',
  toast_monitoring_resumed: 'Đã tiếp tục giám sát an ninh',
  toast_monitoring_paused: 'Đã tạm dừng giám sát an ninh',
};

const en: Record<keyof typeof vi, string> = {
  // Header & Common
  app_title: 'SMART FENCE',
  app_subtitle: 'IoT Perimeter Security System',
  simulated_data_badge: 'Simulated Data',
  updated_at: 'Updated at',
  all: 'All',
  close: 'Close',
  save: 'Save Config',
  reset_default: 'Restore Defaults',
  confirm: 'Confirm',
  cancel: 'Cancel',

  // Sidebar navigation
  nav_overview: 'Overview',
  nav_fence: 'Fence Monitor',
  nav_sensitivity: 'Sensitivity Config',
  nav_alerts: 'Alerts & History',
  nav_devices: 'Device Manager',
  collapse_sidebar: 'Collapse sidebar',
  expand_sidebar: 'Expand sidebar',

  // Security & connection status
  status_safe: 'Safe',
  status_suspicious: 'Suspicious',
  status_intrusion: 'Intrusion',
  status_paused: 'Monitoring Paused',
  status_online: 'Online',
  status_offline: 'Offline',

  // Monitoring toggle
  btn_monitoring_on: 'Resume Monitoring',
  btn_monitoring_off: 'Pause Monitoring',
  monitoring_state_active: 'Monitoring Active',
  monitoring_state_paused: 'Monitoring Paused',

  // Overview page
  card_security_status: 'Security Status',
  card_active_sensors: 'Active Sensors',
  card_alerts_today: 'Alerts Today',
  card_humidity: 'Ambient Humidity',
  card_temperature: 'Current Temperature',
  card_wind_speed: 'Wind Speed',
  chart_title: 'Real-time Temperature & Humidity Trends',
  chart_timespan: 'Last 30s',
  chart_temp_label: 'Temperature (°C)',
  chart_humidity_label: 'Humidity (%)',
  recent_events_title: '5 Recent Events',

  // Fence page
  fence_overview_title: '4-Zone Fence Status Layout',
  zone_label: 'Zone',
  zone_a: 'Zone A (Main Gate)',
  zone_b: 'Zone B (West Wing)',
  zone_c: 'Zone C (South Wing)',
  zone_d: 'Zone D (East Wing)',
  zone_detail_title: 'Fence Zone Details',
  zone_name_label: 'Zone Name',
  zone_device_label: 'Assigned Device',
  zone_status_label: 'Current Status',
  zone_metrics_label: 'Real-time Sensor Readings',
  btn_create_test_event: 'Create Test Event',
  test_modal_title: 'Trigger Simulated Fence Event',
  test_select_zone: 'Select Fence Zone',
  test_select_type: 'Select Severity Level',
  test_option_suspicious: 'Suspicious (Vibration Alert)',
  test_option_intrusion: 'Intrusion (Laser Beam Broken)',

  // Sensitivity page
  sensitivity_title: 'Fence Sensitivity Configuration',
  sensitivity_desc: 'Calibrate laser detection thresholds and environmental filters',
  mode_normal: 'Normal',
  mode_strong_wind: 'Strong Wind',
  mode_leaf_fall: 'Leaf Fall Season',
  mode_custom: 'Custom',
  laser_sensitivity_label: 'Laser Sensitivity (%)',
  confirm_count_label: 'Confirmation Trigger Count',
  confirm_window_label: 'Confirmation Window (seconds)',
  unit_seconds: 's',
  humidity_threshold_label: 'Humidity Alert Threshold (%)',
  sensitivity_note: 'Note: Numerical values are for simulation only, unverified on physical hardware.',
  confirm_reset_prompt: 'Are you sure you want to restore original default settings?',

  // Alerts & History page
  alerts_title: 'Alert List and Event History',
  alerts_desc: 'View and manage security alerts and event logs',
  filter_event_type: 'Filter Event Type',
  filter_severity: 'Filter Severity',
  filter_status: 'Filter Resolution Status',
  col_id: 'Event ID',
  col_time: 'Timestamp',
  col_location: 'Location',
  col_type: 'Event Type',
  col_severity: 'Severity',
  col_status: 'Status',
  col_actions: 'Actions',
  no_events: 'No matching events found.',
  btn_resolve: 'Resolved',
  btn_false_alarm: 'False Alarm',
  danger_banner_text: 'DANGER ALERT: Unresolved security intrusion detected in system!',
  dismiss_banner: 'Dismiss',

  // Devices page
  devices_title: 'IoT Fence Device Management',
  devices_desc: 'List and connection status of IoT devices',
  col_device_id: 'Device ID',
  col_device_name: 'Device Name',
  col_device_type: 'Type',
  col_device_location: 'Location',
  col_device_status: 'Connection',
  col_device_val: 'Latest Value',
  col_device_updated: 'Last Updated',
  device_detail_title: 'Device Details',
  device_toggle_online: 'Set to Online',
  device_toggle_offline: 'Set to Offline',

  // Event types
  event_laser_break: 'Laser Beam Cut',
  event_vibration: 'Vibration Alert',
  event_strong_wind: 'Excessive Wind Speed',
  event_high_humidity: 'High Ambient Humidity',
  event_sensor_disconnected: 'Sensor Disconnected',
  event_manual_test: 'Manual Simulation Test',

  // Severities
  severity_info: 'Info',
  severity_warning: 'Warning',
  severity_danger: 'Danger',

  // Event statuses
  status_unresolved: 'Unresolved',
  status_resolved: 'Resolved',
  status_false_alarm: 'False Alarm',

  // Device types
  device_type_laser: 'Laser Sensor',
  device_type_humidity: 'Humidity Sensor',
  device_type_temperature: 'Temperature Sensor',
  device_type_gateway: 'Gateway Controller',
  device_type_siren: 'Warning Siren',
  device_type_camera: 'Camera',
  device_location_fence_top: 'Above Fence (Zone A)',
  laser_transmitter: 'Transmitter',
  laser_receiver: 'Receiver',
  laser_beam: 'Laser Beam',
  beam_clear: 'Clear',
  beam_broken: 'Broken',
  laser_signal_strength: 'Signal Strength',
  card_siren: 'Warning Siren',
  siren_state_on: 'On',
  siren_state_off: 'Off',
  btn_siren_on: 'Turn On',
  btn_siren_off: 'Turn Off',
  toast_siren_on: 'Warning siren activated',
  toast_siren_off: 'Warning siren deactivated',
  camera_modal_title: 'Camera Feed - CAM-A01',
  camera_no_signal: 'No Signal',
  camera_stream_live: 'Live',
  view_camera: 'View Camera',
  fence_devices_title: 'Perimeter Security Devices (Zone A)',
  device_status_detail: 'Detailed Parameters',
  select_device_prompt: 'Select a device to view detailed parameters',

  // Locations
  loc_zone_a: 'Zone A',
  loc_zone_b: 'Zone B',
  loc_zone_c: 'Zone C',
  loc_zone_d: 'Zone D',
  loc_gateway: 'Gateway',
  loc_system: 'System',

  // Settings
  settings_title: 'System Settings',
  setting_language_title: 'Language',
  lang_vi: 'Tiếng Việt',
  lang_en: 'English',

  // Toast messages
  toast_saved_config: 'Sensitivity configuration saved successfully',
  toast_reset_config: 'Sensitivity restored to default settings',
  toast_invalid_humidity: 'Invalid humidity threshold (enter between 30% and 95%)',
  toast_test_event_created: 'New test event created successfully',
  toast_event_resolved: 'Event marked as Resolved',
  toast_event_false_alarm: 'Event marked as False Alarm',
  toast_device_online: 'Device switched to Online',
  toast_device_offline: 'Device disconnected (Offline)',
  toast_monitoring_resumed: 'Perimeter monitoring resumed',
  toast_monitoring_paused: 'Perimeter monitoring paused',
};

export type TranslationKey = keyof typeof vi;

const dictionaries = { vi, en };

// Hàm t(key) lấy chuỗi hiển thị theo ngôn ngữ hiện tại
export const t = (key: TranslationKey): string => {
  return dictionaries[currentLanguage][key] || key;
};
