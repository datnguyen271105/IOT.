// Service kết nối và giao tiếp thiết bị IoT (Smart Fence)
import { Device } from '../types';
import { initialDevices } from '../mockData';

export const CAMERA_STREAM_URL = '/camera-demo.jpg';

// API: thay bằng gọi back-end/MQTT
export const getDevices = async (): Promise<Device[]> => {
  return Promise.resolve([...initialDevices]);
};

export const setSirenState = async (id: string, on: boolean): Promise<boolean> => {
  // API: thay bằng gọi back-end/MQTT
  return Promise.resolve(on);
};

export const getCameraStreamUrl = async (_id?: string): Promise<string> => {
  // API: thay bằng gọi back-end/MQTT
  return Promise.resolve(CAMERA_STREAM_URL);
};
