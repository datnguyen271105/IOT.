// Trang Giám sát hàng rào: 4 thiết bị Đoạn A, điều khiển Còi, xem Camera & mô phỏng sự kiện
import React, { useState, useEffect } from 'react';
import { Radio, Droplets, Volume2, Video, VideoOff, X, PlayCircle, Power } from 'lucide-react';
import { useStore } from '../store';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Device, FenceZoneId } from '../types';
import { t, TranslationKey } from '../i18n';
import { getCameraStreamUrl } from '../services/deviceService';

export const Fence: React.FC = () => {
  const { devices, createTestEvent, setSiren } = useStore();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>('LASER-A01');
  const [showSimModal, setShowSimModal] = useState<boolean>(false);
  const [simType, setSimType] = useState<'suspicious' | 'intrusion'>('intrusion');
  const [showCamModal, setShowCamModal] = useState<boolean>(false);
  const [camUrl, setCamUrl] = useState<string>('');
  const [camError, setCamError] = useState<boolean>(false);
  const [camTime, setCamTime] = useState<number>(Date.now());

  const fenceDevices = devices.filter((d) => d.id !== 'ESP32-GATEWAY-01');
  const selectedDevice: Device | undefined = devices.find((d) => d.id === selectedDeviceId);
  const camDevice = devices.find((d) => d.id === 'CAM-A01');

  useEffect(() => {
    if (!showCamModal) return;
    getCameraStreamUrl('CAM-A01').then((url) => setCamUrl(url));
    setCamError(false);
    const timer = setInterval(() => setCamTime(Date.now()), 2000);
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowCamModal(false); };
    window.addEventListener('keydown', handleKey);
    return () => { clearInterval(timer); window.removeEventListener('keydown', handleKey); };
  }, [showCamModal]);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    createTestEvent('A' as FenceZoneId, simType);
    setShowSimModal(false);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'laser': return <Radio className="w-5 h-5 text-indigo-400" />;
      case 'humidity': return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'siren': return <Volume2 className="w-5 h-5 text-amber-400" />;
      case 'camera': return <Video className="w-5 h-5 text-emerald-400" />;
      default: return <Radio className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t('fence_devices_title')}</h1>
          <p className="text-xs text-slate-400 mt-1">{t('device_location_fence_top')}</p>
        </div>
        <button
          onClick={() => setShowSimModal(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition"
        >
          <PlayCircle className="w-4 h-4" />
          {t('btn_create_test_event')}
        </button>
      </div>

      {/* Hàng 4 thẻ thiết bị Đoạn A */}
      <div className="grid grid-cols-4 gap-4">
        {fenceDevices.map((dev) => {
          const isSelected = selectedDeviceId === dev.id;
          return (
            <div
              key={dev.id}
              onClick={() => setSelectedDeviceId(dev.id)}
              className={`p-4 rounded-lg border cursor-pointer transition ${
                isSelected ? 'bg-navy-850 border-blue-500 ring-1 ring-blue-500 shadow-md' : 'bg-navy-900 border-navy-800 hover:border-navy-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-navy-800/80 border border-navy-750">{getDeviceIcon(dev.type)}</div>
                <StatusBadge status={dev.isOnline ? 'online' : 'offline'} />
              </div>
              <h3 className="text-sm font-semibold text-white">{t(dev.nameKey as TranslationKey)}</h3>
              <p className="text-[11px] text-slate-400 mb-3">{t('device_location_fence_top')}</p>

              {dev.type === 'laser' && dev.laserDetails && (
                <div className="text-xs space-y-1.5 bg-navy-800/50 p-2.5 rounded border border-navy-750">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('laser_beam')}:</span>
                    <span className={dev.laserDetails.beamStatus === 'broken' ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {t(`beam_${dev.laserDetails.beamStatus}` as TranslationKey)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{t('laser_signal_strength')}:</span>
                    <span className="font-mono text-cyan-300">{dev.laserDetails.signalPercent}%</span>
                  </div>
                </div>
              )}

              {dev.type === 'humidity' && (
                <div className="text-xs bg-navy-800/50 p-2.5 rounded border border-navy-750 flex justify-between">
                  <span className="text-slate-400">{t('card_humidity')}:</span>
                  <span className="font-mono font-semibold text-blue-400">{dev.lastValue}</span>
                </div>
              )}

              {dev.type === 'siren' && (
                <div className="text-xs bg-navy-800/50 p-2 rounded border border-navy-750 flex items-center justify-between">
                  <span className="text-slate-400">{t('card_siren')}:</span>
                  <button
                    disabled={!dev.isOnline}
                    onClick={(e) => { e.stopPropagation(); setSiren(dev.id, !dev.sirenOn); }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                      !dev.isOnline ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500' :
                      dev.sirenOn ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30' : 'bg-navy-750 text-slate-300 border border-navy-700 hover:bg-navy-700'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    {dev.sirenOn ? t('siren_state_on') : t('siren_state_off')}
                  </button>
                </div>
              )}

              {dev.type === 'camera' && (
                <div className="text-xs bg-navy-800/50 p-2 rounded border border-navy-750 flex items-center justify-between">
                  <span className="text-slate-400">{t('camera_stream_live')}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowCamModal(true); }}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium transition"
                  >
                    {t('view_camera')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Khung chi tiết thiết bị được chọn */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-200 mb-4">
          {selectedDevice ? `${t('device_status_detail')}: ${t(selectedDevice.nameKey as TranslationKey)}` : t('device_status_detail')}
        </h2>
        {selectedDevice ? (
          <div className="grid grid-cols-3 gap-6 text-xs">
            <div className="space-y-2">
              <p className="text-slate-400">{t('col_device_id')}: <span className="font-mono text-white ml-2">{selectedDevice.id}</span></p>
              <p className="text-slate-400">{t('col_device_type')}: <span className="text-white ml-2">{t(`device_type_${selectedDevice.type}` as TranslationKey)}</span></p>
              <p className="text-slate-400">{t('col_device_location')}: <span className="text-white ml-2">{t('device_location_fence_top')}</span></p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><span className="text-slate-400">{t('col_device_status')}:</span><StatusBadge status={selectedDevice.isOnline ? 'online' : 'offline'} /></div>
              <p className="text-slate-400">{t('col_device_updated')}: <span className="font-mono text-slate-200 ml-2">{selectedDevice.lastUpdated}</span></p>
            </div>
            {selectedDevice.type === 'laser' && selectedDevice.laserDetails && (
              <div className="p-3 bg-navy-850 rounded border border-navy-800 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">{t('laser_transmitter')}:</span><StatusBadge status={selectedDevice.laserDetails.transmitterOnline ? 'online' : 'offline'} /></div>
                <div className="flex justify-between"><span className="text-slate-400">{t('laser_receiver')}:</span><StatusBadge status={selectedDevice.laserDetails.receiverOnline ? 'online' : 'offline'} /></div>
                <div className="flex justify-between"><span className="text-slate-400">{t('laser_beam')}:</span><span className={selectedDevice.laserDetails.beamStatus === 'broken' ? 'text-red-400 font-bold' : 'text-emerald-400'}>{t(`beam_${selectedDevice.laserDetails.beamStatus}` as TranslationKey)}</span></div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">{t('select_device_prompt')}</p>
        )}
      </Card>

      {/* Modal camera */}
      {showCamModal && (
        <div onClick={() => setShowCamModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-navy-900 border border-navy-700 rounded-lg w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-3.5 border-b border-navy-800 bg-navy-850">
              <div className="flex items-center gap-2"><Video className="w-4 h-4 text-emerald-400" /><h3 className="font-semibold text-sm text-white">{t('camera_modal_title')}</h3></div>
              <button onClick={() => setShowCamModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 flex flex-col items-center justify-center min-h-[320px] bg-black">
              {camError || !camDevice?.isOnline ? (
                <div className="text-center py-12 text-slate-500 space-y-2"><VideoOff className="w-10 h-10 mx-auto text-slate-600" /><p className="text-xs font-medium">{t('camera_no_signal')}</p></div>
              ) : (
                <img src={`${camUrl}&_t=${camTime}`} alt="Camera Live Stream" onError={() => setCamError(true)} className="max-h-[380px] w-full object-contain rounded border border-navy-800" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal mô phỏng sự kiện kiểm tra (Đoạn A) */}
      {showSimModal && (
        <div onClick={() => setShowSimModal(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div onClick={(e) => e.stopPropagation()} className="bg-navy-900 border border-navy-700 rounded-lg w-full max-w-md p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-navy-800">
              <h3 className="text-sm font-semibold text-white">{t('test_modal_title')}</h3>
              <button onClick={() => setShowSimModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSimulate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">{t('col_device_location')}</label>
                <div className="px-3 py-2 bg-navy-800 rounded border border-navy-750 text-xs text-slate-200">{t('loc_zone_a')}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">{t('test_select_type')}</label>
                <select value={simType} onChange={(e) => setSimType(e.target.value as 'suspicious' | 'intrusion')} className="w-full bg-navy-850 border border-navy-750 rounded px-3 py-2 text-xs text-white">
                  <option value="intrusion">{t('test_option_intrusion')}</option>
                  <option value="suspicious">{t('test_option_suspicious')}</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setShowSimModal(false)} className="px-3 py-1.5 bg-navy-800 hover:bg-navy-750 text-slate-300 rounded text-xs font-medium">{t('cancel')}</button>
                <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium">{t('confirm')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
