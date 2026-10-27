// Trang Cảnh báo và lịch sử: Bảng sự kiện, bộ lọc và các nút cập nhật trạng thái
import React, { useState } from 'react';
import { CheckCircle2, AlertOctagon } from 'lucide-react';
import { useStore } from '../store';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { EventType, Severity, EventStatus } from '../types';
import { t, TranslationKey } from '../i18n';

export const Alerts: React.FC = () => {
  const { events, resolveEvent, markFalseAlarm } = useStore();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Lọc danh sách sự kiện theo các tiêu chí
  const filteredEvents = events.filter((ev) => {
    if (filterType !== 'all' && ev.type !== filterType) return false;
    if (filterSeverity !== 'all' && ev.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && ev.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">{t('alerts_title')}</h1>
        <p className="text-xs text-slate-400 mt-0.5">{t('alerts_desc')}</p>
      </div>

      {/* Bộ lọc 3 tiêu chí */}
      <Card>
        <div className="grid grid-cols-3 gap-4">
          {/* Lọc loại sự kiện */}
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">
              {t('filter_event_type')}
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-navy-850 border border-navy-750 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="all">{t('all')}</option>
              <option value="laser_break">{t('event_laser_break')}</option>
              <option value="vibration">{t('event_vibration')}</option>
              <option value="high_humidity">{t('event_high_humidity')}</option>
              <option value="sensor_disconnected">{t('event_sensor_disconnected')}</option>
              <option value="manual_test">{t('event_manual_test')}</option>
            </select>
          </div>

          {/* Lọc mức độ */}
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">
              {t('filter_severity')}
            </label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full bg-navy-850 border border-navy-750 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="all">{t('all')}</option>
              <option value="info">{t('severity_info')}</option>
              <option value="warning">{t('severity_warning')}</option>
              <option value="danger">{t('severity_danger')}</option>
            </select>
          </div>

          {/* Lọc trạng thái */}
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">
              {t('filter_status')}
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-navy-850 border border-navy-750 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="all">{t('all')}</option>
              <option value="unresolved">{t('status_unresolved')}</option>
              <option value="resolved">{t('status_resolved')}</option>
              <option value="false_alarm">{t('status_false_alarm')}</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Bảng sự kiện */}
      <Card>
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            {t('no_events')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-navy-850 text-slate-400 uppercase text-[11px] border-b border-navy-800">
                <tr>
                  <th className="py-3 px-3">{t('col_id')}</th>
                  <th className="py-3 px-3">{t('col_time')}</th>
                  <th className="py-3 px-3">{t('col_location')}</th>
                  <th className="py-3 px-3">{t('col_type')}</th>
                  <th className="py-3 px-3">{t('col_severity')}</th>
                  <th className="py-3 px-3">{t('col_status')}</th>
                  <th className="py-3 px-3 text-right">{t('col_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-navy-850/50">
                    <td className="py-3 px-3 font-mono text-slate-300 font-semibold">{ev.id}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{ev.time}</td>
                    <td className="py-3 px-3 font-medium text-slate-200">
                      {t(`loc_${ev.location === 'gateway' ? 'gateway' : ev.location === 'system' ? 'system' : `zone_${ev.location.toLowerCase()}`}` as TranslationKey)}
                    </td>
                    <td className="py-3 px-3">{t(`event_${ev.type}` as TranslationKey)}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={ev.severity as Severity} />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={ev.status as EventStatus} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      {ev.status === 'unresolved' ? (
                        <div className="inline-flex space-x-2">
                          <button
                            type="button"
                            onClick={() => resolveEvent(ev.id)}
                            className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-600/40 text-[11px] font-medium transition"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            {t('btn_resolve')}
                          </button>
                          <button
                            type="button"
                            onClick={() => markFalseAlarm(ev.id)}
                            className="inline-flex items-center px-2.5 py-1 rounded bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600 text-[11px] font-medium transition"
                          >
                            <AlertOctagon className="w-3.5 h-3.5 mr-1" />
                            {t('btn_false_alarm')}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
