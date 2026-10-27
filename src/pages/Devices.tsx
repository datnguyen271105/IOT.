// Trang Quản lý thiết bị: Bảng 5 thiết bị, bộ lọc và khung chi tiết chuyển đổi Online/Offline
import React, { useState } from 'react';
import { Cpu, Power, X } from 'lucide-react';
import { useStore } from '../store';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { t, TranslationKey } from '../i18n';

export const Devices: React.FC = () => {
  const { devices, selectedDeviceId, setSelectedDeviceId, toggleDeviceStatus } = useStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const formatValue = (val: string) => {
    if (val === 'siren_state_on' || val === 'siren_state_off' || val === 'status_online' || val === 'status_offline') {
      return t(val as TranslationKey);
    }
    return val;
  };

  const filteredDevices = devices.filter((dev) => {
    if (filterType !== 'all' && dev.type !== filterType) return false;
    if (filterStatus === 'online' && !dev.isOnline) return false;
    if (filterStatus === 'offline' && dev.isOnline) return false;
    return true;
  });

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId) || null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">{t('devices_title')}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{t('devices_desc')}</p>
      </div>

      {/* Bộ lọc */}
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">{t('col_device_type')}</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-navy-850 border border-navy-750 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="all">{t('all')}</option>
              <option value="laser">{t('device_type_laser')}</option>
              <option value="humidity">{t('device_type_humidity')}</option>
              <option value="siren">{t('device_type_siren')}</option>
              <option value="camera">{t('device_type_camera')}</option>
              <option value="gateway">{t('device_type_gateway')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">{t('col_device_status')}</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-navy-850 border border-navy-750 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="all">{t('all')}</option>
              <option value="online">{t('status_online')}</option>
              <option value="offline">{t('status_offline')}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Bảng thiết bị */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-850 text-slate-400 uppercase text-[11px] border-b border-navy-800">
              <tr>
                <th className="py-3 px-3">{t('col_device_id')}</th>
                <th className="py-3 px-3">{t('col_device_name')}</th>
                <th className="py-3 px-3">{t('col_device_type')}</th>
                <th className="py-3 px-3">{t('col_device_location')}</th>
                <th className="py-3 px-3">{t('col_device_status')}</th>
                <th className="py-3 px-3">{t('col_device_val')}</th>
                <th className="py-3 px-3">{t('col_device_updated')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {filteredDevices.map((dev) => (
                <tr
                  key={dev.id}
                  onClick={() => setSelectedDeviceId(dev.id)}
                  className="hover:bg-navy-850/60 cursor-pointer transition"
                >
                  <td className="py-3 px-3 font-mono font-semibold text-blue-400">{dev.id}</td>
                  <td className="py-3 px-3 font-medium text-slate-200">{t(dev.nameKey as TranslationKey)}</td>
                  <td className="py-3 px-3">{t(`device_type_${dev.type}` as TranslationKey)}</td>
                  <td className="py-3 px-3 font-medium">
                    {t(`loc_${dev.location === 'gateway' ? 'gateway' : `zone_${dev.location.toLowerCase()}`}` as TranslationKey)}
                  </td>
                  <td className="py-3 px-3"><StatusBadge status={dev.isOnline ? 'online' : 'offline'} /></td>
                  <td className="py-3 px-3 font-mono text-slate-200">{formatValue(dev.lastValue)}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{dev.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal chi tiết thiết bị */}
      {selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDeviceId(null)}>
          <div className="w-full max-w-md bg-navy-900 border border-navy-700 rounded-lg shadow-xl overflow-hidden text-slate-100" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-navy-800 bg-navy-850">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-sm">{t('device_detail_title')}</h3>
              </div>
              <button onClick={() => setSelectedDeviceId(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-navy-800"><span className="text-slate-400">{t('col_device_id')}:</span><span className="font-mono font-bold text-slate-200">{selectedDevice.id}</span></div>
              <div className="flex justify-between py-1.5 border-b border-navy-800"><span className="text-slate-400">{t('col_device_name')}:</span><span className="font-medium text-slate-200">{t(selectedDevice.nameKey as TranslationKey)}</span></div>
              <div className="flex justify-between py-1.5 border-b border-navy-800"><span className="text-slate-400">{t('col_device_type')}:</span><span>{t(`device_type_${selectedDevice.type}` as TranslationKey)}</span></div>
              <div className="flex justify-between py-1.5 border-b border-navy-800"><span className="text-slate-400">{t('col_device_location')}:</span><span>{t(`loc_${selectedDevice.location === 'gateway' ? 'gateway' : `zone_${selectedDevice.location.toLowerCase()}`}` as TranslationKey)}</span></div>
              <div className="flex justify-between py-1.5 border-b border-navy-800"><span className="text-slate-400">{t('col_device_status')}:</span><StatusBadge status={selectedDevice.isOnline ? 'online' : 'offline'} /></div>
              <div className="flex justify-between py-1.5 border-b border-navy-800"><span className="text-slate-400">{t('col_device_val')}:</span><span className="font-mono text-cyan-300 font-semibold">{formatValue(selectedDevice.lastValue)}</span></div>
              
              {selectedDevice.type === 'laser' && selectedDevice.laserDetails && (
                <div className="p-3 bg-navy-850 rounded border border-navy-800 space-y-1.5 my-2">
                  <div className="font-semibold text-slate-300 mb-1">{t('device_status_detail')}:</div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('laser_transmitter')}:</span>
                    <span className={selectedDevice.laserDetails.transmitterOnline ? 'text-emerald-400' : 'text-slate-400'}>
                      {selectedDevice.laserDetails.transmitterOnline ? t('status_online') : t('status_offline')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('laser_receiver')}:</span>
                    <span className={selectedDevice.laserDetails.receiverOnline ? 'text-emerald-400' : 'text-slate-400'}>
                      {selectedDevice.laserDetails.receiverOnline ? t('status_online') : t('status_offline')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('laser_beam')}:</span>
                    <span className={selectedDevice.laserDetails.beamStatus === 'clear' ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                      {selectedDevice.laserDetails.beamStatus === 'clear' ? t('beam_clear') : t('beam_broken')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('laser_signal_strength')}:</span>
                    <span className="text-cyan-400 font-mono">{selectedDevice.laserDetails.signalPercent}%</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between py-1.5"><span className="text-slate-400">{t('col_device_updated')}:</span><span className="font-mono text-slate-300">{selectedDevice.lastUpdated}</span></div>

              <div className="pt-4 flex justify-between items-center border-t border-navy-800">
                <button
                  type="button"
                  onClick={() => toggleDeviceStatus(selectedDevice.id)}
                  className={`inline-flex items-center px-4 py-2 rounded text-xs font-medium transition ${
                    selectedDevice.isOnline ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Power className="w-4 h-4 mr-1.5" />
                  {selectedDevice.isOnline ? t('device_toggle_offline') : t('device_toggle_online')}
                </button>
                <button type="button" onClick={() => setSelectedDeviceId(null)} className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-slate-300 rounded text-xs">{t('close')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
