import { useState } from 'react';
import { APPOINTMENTS, SERVICES, STYLISTS, getService, getStylist, formatPrice, CATEGORY_CONFIG, STATUS_CONFIG } from '../data';
import { Card, StatusBadge, Button, PageHeader, Input } from '../ui';
import { MemphisStylistAvatar } from '../illustrations';

// ─── DASHBOARD ─────────────────────────────────────────────────────────────────

const METRICS = {
  today: 12,
  todayRevenue: 384,
  weeklyOccupation: 78,
  avgRating: 4.85,
  monthAppointments: 247,
  monthRevenue: 8420,
};

function MetricCard({ value, label, color, icon, trend }: {
  value: string | number;
  label: string;
  color: string;
  icon: string;
  trend?: string;
}) {
  return (
    <div className="bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(107,66,38,0.1)]">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl mb-3`} style={{ background: color + '20' }}>
        {icon}
      </div>
      <div className="text-2xl font-black font-display" style={{ color }}>{value}</div>
      <div className="text-xs font-semibold text-[#A67850] mt-0.5">{label}</div>
      {trend && <div className="text-[10px] text-[#8B9D77] font-semibold mt-1">{trend}</div>}
    </div>
  );
}

function BarChart({ data, max, color }: { data: { label: string; value: number }[]; max: number; color: string }) {
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold" style={{ color }}>{item.value}</span>
          <div
            className="w-full rounded-t-xl transition-all duration-500"
            style={{
              height: `${(item.value / max) * 80}px`,
              background: i === data.length - 1 ? color : color + '70',
              minHeight: '4px',
            }}
          />
          <span className="text-[9px] text-[#C8A88A] font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ percentage, color, label }: { percentage: number; color: string; label: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="#F5E6D3" strokeWidth="10" />
        <circle
          cx="44" cy="44" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 44 44)"
        />
        <text x="44" y="48" textAnchor="middle" fontSize="16" fontWeight="900" fill={color} fontFamily="Nunito">
          {percentage}%
        </text>
      </svg>
      <span className="text-xs text-[#A67850] font-semibold text-center">{label}</span>
    </div>
  );
}

export function AdminDashboard() {
  const weeklyData = [
    { label: 'Lu', value: 28 },
    { label: 'Ma', value: 35 },
    { label: 'Mi', value: 22 },
    { label: 'Ju', value: 41 },
    { label: 'Vi', value: 38 },
    { label: 'Sá', value: 47 },
    { label: 'Do', value: 12 },
  ];

  const serviceData = [
    { label: 'Corte', value: 45 },
    { label: 'Barba', value: 30 },
    { label: 'Combo', value: 55 },
    { label: 'Color', value: 20 },
    { label: 'Trat.', value: 15 },
  ];

  const recentAppointments = APPOINTMENTS.slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF3E9] p-6">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#6B4226] font-display">Dashboard</h1>
        <p className="text-[#A67850] text-sm">Hoy, viernes 29 de agosto de 2026</p>
      </div>

      {/* Today's quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MetricCard value={METRICS.today} label="Citas hoy" color="#E8734A" icon="📅" trend="↑ 3 vs ayer" />
        <MetricCard value={`$${METRICS.todayRevenue}`} label="Ingresos hoy" color="#F2A950" icon="💰" trend="↑ 12% vs ayer" />
        <MetricCard value={`${METRICS.weeklyOccupation}%`} label="Ocupación semanal" color="#8B9D77" icon="📊" trend="↑ 5% vs semana ant." />
        <MetricCard value={`★${METRICS.avgRating}`} label="Valoración media" color="#6B4226" icon="⭐" trend="Excelente" />
      </div>

      {/* Occupation donut charts */}
      <Card className="mb-6">
        <h3 className="font-black text-[#6B4226] font-display mb-4">Ocupación por estilista</h3>
        <div className="grid grid-cols-4 gap-2">
          {STYLISTS.map(stylist => (
            <DonutChart
              key={stylist.id}
              percentage={Math.floor(65 + Math.random() * 30)}
              color={stylist.color}
              label={stylist.name.split(' ')[0]}
            />
          ))}
        </div>
      </Card>

      {/* Weekly appointments chart */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-[#6B4226] font-display">Citas esta semana</h3>
          <span className="text-xs font-bold text-[#8B9D77] bg-[#EAF2E3] px-2 py-1 rounded-full">
            Total: {weeklyData.reduce((a, b) => a + b.value, 0)}
          </span>
        </div>
        <BarChart data={weeklyData} max={60} color="#E8734A" />
      </Card>

      {/* Services popularity */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-[#6B4226] font-display">Servicios más solicitados</h3>
        </div>
        <BarChart data={serviceData} max={70} color="#F2A950" />
      </Card>

      {/* Monthly summary */}
      <Card className="mb-6 bg-[#6B4226]">
        <h3 className="font-black text-white font-display mb-3">Resumen mensual</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-white/60 text-xs font-semibold">Citas completadas</div>
            <div className="text-white font-black text-xl">{METRICS.monthAppointments}</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <div className="text-white/60 text-xs font-semibold">Ingresos totales</div>
            <div className="text-[#F2A950] font-black text-xl">${METRICS.monthRevenue}</div>
          </div>
        </div>
        <div className="mt-3 bg-white/10 rounded-xl p-3 flex items-center justify-between">
          <span className="text-white/70 text-xs font-semibold">Tasa de cancelación</span>
          <span className="text-[#A8BB92] font-black text-sm">3.2%</span>
        </div>
      </Card>

      {/* Recent appointments */}
      <div className="mb-2">
        <h3 className="font-black text-[#6B4226] font-display mb-3">Citas recientes</h3>
        <div className="flex flex-col gap-2">
          {recentAppointments.map(appointment => {
            const service = getService(appointment.serviceId);
            const stylist = getStylist(appointment.stylistId);
            if (!service || !stylist) return null;

            return (
              <Card key={appointment.id} padding={false}>
                <div className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FBF3E9] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {CATEGORY_CONFIG[service.category].emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#6B4226] text-sm truncate">{service.name}</span>
                      <StatusBadge status={appointment.status} />
                    </div>
                    <div className="text-xs text-[#A67850]">{appointment.clientName} · {stylist.name}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-[#E8734A]">{formatPrice(service.price)}</div>
                    <div className="text-xs text-[#C8A88A]">{appointment.time}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN TEAM ────────────────────────────────────────────────────────────────

const STYLIST_PHONES: Record<string, string> = {
  st1: '+34 612 345 678',
  st2: '+34 623 456 789',
  st3: '+34 634 567 890',
  st4: '+34 645 678 901',
};

const STYLIST_SCHEDULES: Record<string, { day: string; slots: string }[]> = {
  st1: [
    { day: 'Lunes', slots: '09:00 – 18:00' },
    { day: 'Martes', slots: '09:00 – 18:00' },
    { day: 'Miércoles', slots: '09:00 – 14:00' },
    { day: 'Jueves', slots: '12:00 – 20:00' },
    { day: 'Viernes', slots: '09:00 – 18:00' },
    { day: 'Sábado', slots: '09:00 – 15:00' },
  ],
  st2: [
    { day: 'Lunes', slots: '10:00 – 19:00' },
    { day: 'Martes', slots: 'Libre' },
    { day: 'Miércoles', slots: '10:00 – 19:00' },
    { day: 'Jueves', slots: '10:00 – 19:00' },
    { day: 'Viernes', slots: '10:00 – 19:00' },
    { day: 'Sábado', slots: '10:00 – 18:00' },
  ],
  st3: [
    { day: 'Lunes', slots: '09:00 – 17:00' },
    { day: 'Martes', slots: '09:00 – 17:00' },
    { day: 'Miércoles', slots: '09:00 – 17:00' },
    { day: 'Jueves', slots: 'Libre' },
    { day: 'Viernes', slots: '09:00 – 17:00' },
    { day: 'Sábado', slots: '10:00 – 16:00' },
  ],
  st4: [
    { day: 'Martes', slots: '11:00 – 20:00' },
    { day: 'Miércoles', slots: '11:00 – 20:00' },
    { day: 'Jueves', slots: '11:00 – 20:00' },
    { day: 'Viernes', slots: '11:00 – 20:00' },
    { day: 'Sábado', slots: '09:00 – 18:00' },
    { day: 'Domingo', slots: '10:00 – 15:00' },
  ],
};

// Pending appointments per stylist (simulated)
const STYLIST_PENDING: Record<string, number> = { st1: 3, st2: 1, st3: 0, st4: 2 };

export function AdminTeam({ onBack }: { onBack: () => void }) {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<string | null>(null);

  const stylistStats = [
    { id: 'st1', appointments: 48, revenue: 1840, rating: 4.9 },
    { id: 'st2', appointments: 42, revenue: 1580, rating: 4.8 },
    { id: 'st3', appointments: 38, revenue: 1960, rating: 4.9 },
    { id: 'st4', appointments: 35, revenue: 1420, rating: 4.7 },
  ];

  const handleInvite = () => {
    if (!inviteEmail) return;
    setInviteLoading(true);
    setTimeout(() => { setInviteLoading(false); setInviteSent(true); }, 1000);
  };

  const deleteTargetStylist = STYLISTS.find(s => s.id === deleteTarget);
  const scheduleTargetStylist = STYLISTS.find(s => s.id === scheduleTarget);
  const pendingCount = deleteTarget ? (STYLIST_PENDING[deleteTarget] ?? 0) : 0;

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF3E9] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-[#6B4226] font-display">Equipo</h2>
          <p className="text-sm text-[#A67850]">{STYLISTS.length} estilistas activos</p>
        </div>
        <Button onClick={() => { setShowInvite(!showInvite); setInviteSent(false); }} variant="primary" size="sm">
          + Invitar
        </Button>
      </div>

      {showInvite && (
        <Card className="mb-5 border-2 border-[#E8734A]">
          <h4 className="font-black text-[#6B4226] font-display mb-3">Invitar estilista</h4>
          {inviteSent ? (
            <div className="bg-[#EAF2E3] rounded-xl p-3 flex items-center gap-2">
              <span className="text-[#4A7C59] text-lg">✓</span>
              <p className="text-[#4A7C59] text-sm font-semibold">¡Invitación enviada a {inviteEmail}!</p>
            </div>
          ) : (
            <>
              <Input
                label="Correo electrónico"
                type="email"
                value={inviteEmail}
                onChange={setInviteEmail}
                placeholder="estilista@barberia.com"
                icon={<span>✉️</span>}
              />
              <div className="flex gap-2 mt-3">
                <Button onClick={handleInvite} variant="primary" size="sm" fullWidth disabled={inviteLoading}>
                  {inviteLoading ? '⏳ Enviando...' : 'Enviar invitación'}
                </Button>
                <Button onClick={() => setShowInvite(false)} variant="ghost" size="sm">
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {STYLISTS.map((stylist, idx) => {
          const stats = stylistStats[idx];
          return (
            <Card key={stylist.id} padding={false}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <MemphisStylistAvatar name={stylist.name} color={stylist.color} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-[#6B4226] font-display">{stylist.name}</div>
                    <div className="text-sm text-[#A67850]">{stylist.specialty}</div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="text-[#F2A950] text-xs">★</span>
                        <span className="text-xs font-bold text-[#6B4226]">{stylist.rating}</span>
                        <span className="text-[10px] text-[#C8A88A]">({stylist.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#A67850]">
                        <span>📱</span>
                        <span className="font-medium">{STYLIST_PHONES[stylist.id]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => setScheduleTarget(stylist.id)}
                      className="w-8 h-8 rounded-xl bg-[#FBF3E9] hover:bg-[#F5E6D3] flex items-center justify-center text-sm transition-colors"
                      title="Ver horario"
                    >
                      📅
                    </button>
                    <button className="w-8 h-8 rounded-xl bg-[#FBF3E9] hover:bg-[#F5E6D3] flex items-center justify-center text-sm transition-colors">
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleteTarget(stylist.id)}
                      className="w-8 h-8 rounded-xl bg-[#FFF5F5] hover:bg-[#FFE8E8] flex items-center justify-center text-sm transition-colors"
                      title="Dar de baja"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                {/* Performance stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Citas/mes', value: stats.appointments, color: '#E8734A' },
                    { label: 'Ingresos', value: `$${stats.revenue}`, color: '#F2A950' },
                    { label: 'Rating', value: `★${stats.rating}`, color: '#8B9D77' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-[#FBF3E9] rounded-xl p-2 text-center">
                      <div className="text-sm font-black" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-[9px] text-[#C8A88A] font-semibold">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Services */}
                <div className="mt-3 pt-3 border-t border-[#F5E6D3]">
                  <span className="text-xs font-semibold text-[#C8A88A]">Servicios: </span>
                  {stylist.serviceIds.map(sid => {
                    const s = getService(sid);
                    return s ? (
                      <span key={sid} className="text-xs text-[#A67850] mr-1">{s.name}</span>
                    ) : null;
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && deleteTargetStylist && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-5">
              <div className="w-16 h-16 bg-[#FFF5F5] rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="font-black text-[#6B4226] font-display text-xl mb-1">¿Dar de baja?</h3>
              <p className="text-[#A67850] text-sm">
                ¿Confirmas que quieres dar de baja a <strong className="text-[#6B4226]">{deleteTargetStylist.name}</strong>?
              </p>
            </div>

            {pendingCount > 0 && (
              <div className="bg-[#FEF5E4] border border-[#F2A950]/40 rounded-2xl p-3 mb-4 flex items-start gap-2">
                <span className="text-lg flex-shrink-0">⚠️</span>
                <p className="text-sm text-[#8B6914] font-medium">
                  Este estilista tiene <strong>{pendingCount} citas futuras</strong> pendientes que deberán reasignarse antes de proceder.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {pendingCount > 0 ? (
                <Button variant="secondary" size="md" fullWidth onClick={() => setDeleteTarget(null)}>
                  Ver citas pendientes
                </Button>
              ) : (
                <Button variant="danger" size="md" fullWidth onClick={() => setDeleteTarget(null)}>
                  Confirmar baja
                </Button>
              )}
              <Button variant="ghost" size="md" fullWidth onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule drawer */}
      {scheduleTarget && scheduleTargetStylist && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-[32px] p-6 w-full max-h-[80vh] overflow-y-auto">
            <div className="w-10 h-1 bg-[#EDD8BC] rounded-full mx-auto mb-5" />
            <div className="flex items-center gap-3 mb-5">
              <MemphisStylistAvatar name={scheduleTargetStylist.name} color={scheduleTargetStylist.color} size={44} />
              <div>
                <h3 className="font-black text-[#6B4226] font-display text-lg">{scheduleTargetStylist.name}</h3>
                <p className="text-sm text-[#A67850]">Horario disponible</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-5">
              {(STYLIST_SCHEDULES[scheduleTarget] ?? []).map((entry, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-2xl ${entry.slots === 'Libre' ? 'bg-[#F5E6D3]' : 'bg-[#FBF3E9]'}`}>
                  <span className="font-semibold text-[#6B4226] text-sm">{entry.day}</span>
                  <span className={`text-sm font-bold ${entry.slots === 'Libre' ? 'text-[#C8A88A] line-through' : 'text-[#E8734A]'}`}>
                    {entry.slots}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="secondary" size="md" fullWidth onClick={() => setScheduleTarget(null)}>
                Editar horario
              </Button>
              <Button variant="ghost" size="md" onClick={() => setScheduleTarget(null)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REPORTS ───────────────────────────────────────────────────────────────────

export function AdminReports() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const stylistPerf = [
    { name: 'Carlos R.', appointments: 48, revenue: 1840, satisfaction: 98 },
    { name: 'Miguel T.', appointments: 42, revenue: 1580, satisfaction: 95 },
    { name: 'David S.', appointments: 38, revenue: 1960, satisfaction: 97 },
    { name: 'Luis M.', appointments: 35, revenue: 1420, satisfaction: 92 },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF3E9] p-6">
      <div className="mb-6">
        <h2 className="text-xl font-black text-[#6B4226] font-display">Reportes</h2>
        <p className="text-sm text-[#A67850]">Análisis de desempeño del negocio</p>
      </div>

      {/* Period selector */}
      <div className="flex gap-2 mb-6">
        {(['week', 'month', 'year'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`flex-1 py-2 rounded-2xl text-sm font-bold transition-all ${period === p ? 'bg-[#E8734A] text-white shadow-[0_4px_12px_rgba(232,115,74,0.3)]' : 'bg-white text-[#A67850] hover:bg-[#F5E6D3]'}`}
          >
            {p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
          </button>
        ))}
      </div>

      {/* Performance table */}
      <Card className="mb-5">
        <h3 className="font-black text-[#6B4226] font-display mb-4">Desempeño por estilista</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr>
                <th className="text-left text-[10px] font-bold text-[#C8A88A] uppercase tracking-wide pb-2">Estilista</th>
                <th className="text-right text-[10px] font-bold text-[#C8A88A] uppercase tracking-wide pb-2">Citas</th>
                <th className="text-right text-[10px] font-bold text-[#C8A88A] uppercase tracking-wide pb-2">Ingresos</th>
                <th className="text-right text-[10px] font-bold text-[#C8A88A] uppercase tracking-wide pb-2">Satisf.</th>
              </tr>
            </thead>
            <tbody>
              {stylistPerf.map((perf, i) => (
                <tr key={i} className="border-t border-[#F5E6D3]">
                  <td className="py-2.5 text-sm font-semibold text-[#6B4226]">{perf.name}</td>
                  <td className="text-right text-sm font-bold text-[#E8734A]">{perf.appointments}</td>
                  <td className="text-right text-sm font-bold text-[#F2A950]">${perf.revenue}</td>
                  <td className="text-right">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${perf.satisfaction >= 96 ? 'bg-[#EAF2E3] text-[#4A7C59]' : 'bg-[#FEF5E4] text-[#8B6914]'}`}>
                      {perf.satisfaction}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top services */}
      <Card>
        <h3 className="font-black text-[#6B4226] font-display mb-4">Top servicios</h3>
        {SERVICES.slice(0, 4).map((service, i) => {
          const pct = [85, 72, 55, 40][i];
          return (
            <div key={service.id} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_CONFIG[service.category].emoji}</span>
                  <span className="text-sm font-semibold text-[#6B4226]">{service.name}</span>
                </div>
                <span className="text-xs font-bold text-[#E8734A]">{pct}%</span>
              </div>
              <div className="h-2 bg-[#F5E6D3] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: i === 0 ? '#E8734A' : i === 1 ? '#F2A950' : i === 2 ? '#8B9D77' : '#A67850',
                  }}
                />
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
