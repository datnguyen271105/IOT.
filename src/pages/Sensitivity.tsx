// Trang Cấu hình độ nhạy: 4 chế độ, điều chỉnh thông số và khôi phục mặc định
import React, { useState } from 'react';
import { Sliders, RotateCcw, Save, AlertCircle } from 'lucide-react';
import { useStore } from '../store';
import { Card } from '../components/Card';
import { SensitivityMode, SensitivityConfig } from '../types';
import { presetSensitivityConfigs } from '../mockData';
import { t } from '../i18n';

export const Sensitivity: React.FC = () => {
  const { sensitivityConfig, saveSensitivityConfig, resetSensitivityConfig, showToast } = useStore();
  const [formConfig, setFormConfig] = useState<SensitivityConfig>(sensitivityConfig);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const isCustom = formConfig.mode === 'custom';

  const handleSelectMode = (mode: SensitivityMode) => {
    if (mode === 'custom') {
      setFormConfig((prev) => ({ ...prev, mode: 'custom' }));
    } else {
      const p = presetSensitivityConfigs[mode];
      setFormConfig({ mode, ...p });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (formConfig.humidityThreshold < 30 || formConfig.humidityThreshold > 95) {
      showToast('toast_invalid_humidity', 'error');
      return;
    }
    saveSensitivityConfig(formConfig);
  };

  const handleConfirmReset = () => {
    resetSensitivityConfig();
    setFormConfig({ mode: 'normal', ...presetSensitivityConfigs.normal });
    setShowConfirmReset(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t('sensitivity_title')}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{t('sensitivity_desc')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowConfirmReset(true)}
            className="inline-flex items-center px-3 py-2 bg-navy-850 hover:bg-navy-800 text-slate-300 rounded-lg text-sm border border-navy-750 transition"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            {t('reset_default')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow transition"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {t('save')}
          </button>
        </div>
      </div>

      {/* 4 Chế độ độ nhạy */}
      <Card>
        <span className="text-xs text-slate-400 font-medium block mb-3">{t('sensitivity_desc')}</span>
        <div className="grid grid-cols-4 gap-4">
          {(['normal', 'strong_wind', 'leaf_fall', 'custom'] as SensitivityMode[]).map((m) => {
            const isSelected = formConfig.mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => handleSelectMode(m)}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition ${
                  isSelected ? 'bg-blue-600 border-blue-500 text-white shadow' : 'bg-navy-850 border-navy-800 text-slate-300 hover:bg-navy-800'
                }`}
              >
                {t(`mode_${m}`)}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Thông số chi tiết */}
      <Card>
        <div className="flex items-center space-x-2 pb-3 mb-5 border-b border-navy-800">
          <Sliders className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-semibold text-slate-200">{t(`mode_${formConfig.mode}`)}</h2>
          {!isCustom && <span className="text-xs text-slate-400 italic">({t('sensitivity_note')})</span>}
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-2 gap-6">
          <div className="space-y-2 bg-navy-850 p-4 rounded-lg border border-navy-800">
            <div className="flex justify-between items-center text-sm font-medium">
              <label htmlFor="laser-slider" className="text-slate-300">{t('laser_sensitivity_label')}</label>
              <span className="font-mono text-blue-400 font-bold">{formConfig.laserSensitivity}%</span>
            </div>
            <input
              id="laser-slider"
              type="range"
              min="10"
              max="100"
              disabled={!isCustom}
              value={formConfig.laserSensitivity}
              onChange={(e) => setFormConfig((prev) => ({ ...prev, laserSensitivity: Number(e.target.value) }))}
              className="w-full accent-blue-500 disabled:opacity-50 cursor-pointer"
            />
          </div>

          <div className="space-y-2 bg-navy-850 p-4 rounded-lg border border-navy-800">
            <div className="flex justify-between items-center text-sm font-medium">
              <label htmlFor="count-slider" className="text-slate-300">{t('confirm_count_label')}</label>
              <span className="font-mono text-blue-400 font-bold">{formConfig.confirmCount}</span>
            </div>
            <input
              id="count-slider"
              type="range"
              min="1"
              max="10"
              disabled={!isCustom}
              value={formConfig.confirmCount}
              onChange={(e) => setFormConfig((prev) => ({ ...prev, confirmCount: Number(e.target.value) }))}
              className="w-full accent-blue-500 disabled:opacity-50 cursor-pointer"
            />
          </div>

          <div className="space-y-2 bg-navy-850 p-4 rounded-lg border border-navy-800">
            <label htmlFor="window-select" className="block text-sm font-medium text-slate-300">{t('confirm_window_label')}</label>
            <select
              id="window-select"
              disabled={!isCustom}
              value={formConfig.confirmWindow}
              onChange={(e) => setFormConfig((prev) => ({ ...prev, confirmWindow: Number(e.target.value) }))}
              className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-sm text-slate-100 disabled:opacity-50 focus:outline-none focus:border-blue-500"
            >
              {[1, 2, 3, 5, 10].map((sec) => (<option key={sec} value={sec}>{sec} {t('unit_seconds')}</option>))}
            </select>
          </div>

          <div className="space-y-2 bg-navy-850 p-4 rounded-lg border border-navy-800">
            <label htmlFor="humidity-input" className="block text-sm font-medium text-slate-300">{t('humidity_threshold_label')}</label>
            <input
              id="humidity-input"
              type="number"
              min="30"
              max="95"
              disabled={!isCustom}
              value={formConfig.humidityThreshold}
              onChange={(e) => setFormConfig((prev) => ({ ...prev, humidityThreshold: Number(e.target.value) }))}
              className="w-full bg-navy-900 border border-navy-700 rounded px-3 py-2 text-sm text-slate-100 disabled:opacity-50 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </form>

        <div className="mt-5 flex items-start space-x-2 text-xs text-slate-400 bg-navy-850 p-3 rounded border border-navy-800">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{t('sensitivity_note')}</span>
        </div>
      </Card>

      {/* Xác nhận khôi phục */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmReset(false)}>
          <div className="w-full max-w-sm bg-navy-900 border border-navy-700 rounded-lg p-5 shadow-xl text-slate-100 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-sm">{t('reset_default')}</h3>
            <p className="text-xs text-slate-300">{t('confirm_reset_prompt')}</p>
            <div className="flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setShowConfirmReset(false)} className="px-3 py-1.5 text-xs bg-navy-800 hover:bg-navy-700 rounded text-slate-300">{t('cancel')}</button>
              <button type="button" onClick={handleConfirmReset} className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-500 rounded text-white font-medium">{t('confirm')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
