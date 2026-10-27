// Trang Tổng quan: 5 thẻ số liệu thời gian thực, biểu đồ trượt độ ẩm và 5 sự kiện gần nhất
import React from 'react';
import { ShieldAlert, Cpu, Bell, Droplets, Volume2, Power } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useStore } from '../store';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { t, TranslationKey } from '../i18n';

export const Overview: React.FC = () => {
  const {
    securityStatus,
    activeDevicesCount,
    totalDevicesCount,
    events,
    humidity,
    isSirenActive,
    chartData,
    isMonitoring,
    toggleMonitoring,
  } = useStore();

  const recentEvents = events.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Tiêu đề & nút bật/tắt giám sát */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t('nav_overview')}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isMonitoring ? t('monitoring_state_active') : t('monitoring_state_paused')}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleMonitoring}
          className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition shadow ${
            isMonitoring ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          <Power className="w-4 h-4 mr-2" />
          {isMonitoring ? t('btn_monitoring_off') : t('btn_monitoring_on')}
        </button>
      </div>

      {/* 5 Thẻ số liệu thời gian thực */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t('card_security_status')}</span>
            <ShieldAlert className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3"><StatusBadge status={securityStatus} /></div>
        </Card>
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t('card_active_sensors')}</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{activeDevicesCount} / {totalDevicesCount}</div>
        </Card>
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t('card_alerts_today')}</span>
            <Bell className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{events.length}</div>
        </Card>
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t('card_humidity')}</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-cyan-300">{humidity}%</div>
        </Card>
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t('card_siren')}</span>
            <Volume2 className={`w-4 h-4 ${isSirenActive ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                isSirenActive
                  ? 'bg-red-950 text-red-400 border-red-700 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {isSirenActive ? t('siren_state_on') : t('siren_state_off')}
            </span>
          </div>
        </Card>
      </div>

      {/* Biểu đồ đường trượt độ ẩm */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">{t('chart_title')}</h2>
          <span className="text-xs text-slate-400">{t('chart_timespan')}</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[30, 95]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0b1329', borderColor: '#1e293b', fontSize: '12px', borderRadius: '6px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="humidity"
                name={t('chart_humidity_label')}
                stroke="#06b6d4"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 5 Sự kiện gần nhất */}
      <Card>
        <h2 className="text-sm font-semibold text-slate-200 mb-3">{t('recent_events_title')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-navy-850 text-slate-400 uppercase text-[11px] border-b border-navy-800">
              <tr>
                <th className="py-2.5 px-3">{t('col_time')}</th>
                <th className="py-2.5 px-3">{t('col_location')}</th>
                <th className="py-2.5 px-3">{t('col_type')}</th>
                <th className="py-2.5 px-3">{t('col_severity')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800/60">
              {recentEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-navy-850/50">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{ev.time}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">
                    {t(`loc_${ev.location === 'gateway' ? 'gateway' : ev.location === 'system' ? 'system' : `zone_${ev.location.toLowerCase()}`}` as TranslationKey)}
                  </td>
                  <td className="py-2.5 px-3">{t(`event_${ev.type}` as TranslationKey)}</td>
                  <td className="py-2.5 px-3"><StatusBadge status={ev.severity} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
