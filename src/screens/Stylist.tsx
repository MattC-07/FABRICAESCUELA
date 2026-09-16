import { useState, useCallback } from 'react';
import { APPOINTMENTS, STYLISTS, getService, getStylist, formatPrice, formatDuration, CATEGORY_CONFIG } from '../data';
import { Card, StatusBadge, Button, PageHeader, StarRating } from '../ui';
import { MemphisStylistAvatar } from '../illustrations';

// ─── STYLIST SCHEDULE ──────────────────────────────────────────────────────────

interface ScheduleEvent {
  time: string;
  client: string;
  service: string;
  status: 'confirmed' | 'pending';
  duration: number;
  blocked?: boolean;
}

const SCHEDULE_DATA: Record<string, ScheduleEvent[]> = {
  Mon: [
    { time: '09:30', client: 'Ana M.', service: 's1', status: 'confirmed' as const, duration: 30 },
    { time: '10:30', client: 'Pedro R.', service: 's3', status: 'confirmed' as const, duration: 50 },
    { time: '14:00', client: 'Luis G.', service: 's6', status: 'pending' as const, duration: 30 },
    { time: '15:00', client: '—', service: '', status: 'confirmed' as const, duration: 30, blocked: true },
    { time: '16:30', client: 'María V.', service: 's2', status: 'confirmed' as const, duration: 20 },
  ],
  Tue: [
    { time: '09:00', client: 'Jorge P.', service: 's3', status: 'confirmed' as const, duration: 50 },
    { time: '11:00', client: 'Sofia K.', service: 's1', status: 'confirmed' as const, duration: 30 },
    { time: '12:00', client: '—', service: '', status: 'confirmed' as const, duration: 90, blocked: true },
    { time: '15:00', client: 'Carlos F.', service: 's6', status: 'pending' as const, duration: 30 },
  ],
  Wed: [
    { time: '09:30', client: 'Elena T.', service: 's1', status: 'confirmed' as const, duration: 30 },
    { time: '11:00', client: 'David M.', service: 's3', status: 'confirmed' as const, duration: 50 },
    { time: '14:30', client: 'Isabel R.', service: 's2', status: 'confirmed' as const, duration: 20 },
    { time: '16:00', client: 'Marco A.', service: 's6', status: 'confirmed' as const, duration: 30 },
  ],
  Thu: [
    { time: '09:00', client: '—', service: '', status: 'confirmed' as const, duration: 120, blocked: true },
    { time: '11:30', client: 'Laura C.', service: 's1', status: 'confirmed' as const, duration: 30 },
    { time: '14:00', client: 'Roberto P.', service: 's3', status: 'pending' as const, duration: 50 },
    { time: '16:30', client: 'Paula G.', service: 's6', status: 'confirmed' as const, duration: 30 },
  ],
  Fri: [
    { time: '09:00', client: 'Andrés L.', service: 's3', status: 'confirmed' as const, duration: 50 },
    { time: '10:30', client: 'Camila P.', service: 's1', status: 'confirmed' as const, duration: 30 },
    { time: '12:00', client: 'Felipe R.', service: 's2', status: 'confirmed' as const, duration: 20 },
    { time: '14:00', client: 'Diana V.', service: 's1', status: 'confirmed' as const, duration: 30 },
    { time: '15:30', client: 'Miguel A.', service: 's6', status: 'confirmed' as const, duration: 30 },
    { time: '17:00', client: 'Valeria M.', service: 's3', status: 'pending' as const, duration: 50 },
  ],
  Sat: [
    { time: '09:00', client: 'Juan G.', service: 's3', status: 'confirmed' as const, duration: 50 },
    { time: '10:30', client: 'Pedro T.', service: 's1', status: 'confirmed' as const, duration: 30 },
    { time: '12:00', client: 'Ana R.', service: 's6', status: 'confirmed' as const, duration: 30 },
    { time: '14:00', client: 'Luis M.', service: 's2', status: 'confirmed' as const, duration: 20 },
    { time: '15:30', client: 'Sofia D.', service: 's1', status: 'confirmed' as const, duration: 30 },
  ],
  Sun: [],
};

type DayKey = string;

export function StylistSchedule() {
  const days = Object.keys(SCHEDULE_DATA) as DayKey[];
  const [activeDay, setActiveDay] = useState<DayKey>('Fri');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [completedEvents, setCompletedEvents] = useState<Set<string>>(new Set());

  const eventKey = (day: string, idx: number) => `${day}-${idx}`;
  const markComplete = useCallback((idx: number) => {
    setCompletedEvents(prev => new Set(prev).add(eventKey(activeDay, idx)));
  }, [activeDay]);

  const stylist = STYLISTS[0];
  const dayEvents = SCHEDULE_DATA[activeDay];
  const totalAppointments = dayEvents.filter(e => !e.blocked).length;
  const totalRevenue = dayEvents
    .filter(e => !e.blocked && e.service)
    .reduce((sum, e) => {
      const svc = getService(e.service);
      return sum + (svc?.price ?? 0);
    }, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF3E9]">
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-4 shadow-[0_2px_12px_rgba(107,66,38,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MemphisStylistAvatar name={stylist.name} color={stylist.color} size={44} />
            <div>
              <h2 className="font-black text-[#6B4226] font-display">Mi Agenda</h2>
              <p className="text-xs text-[#A67850]">{stylist.specialty}</p>
            </div>
          </div>
          <Button onClick={() => setShowBlockModal(true)} variant="secondary" size="sm">
            🚫 Bloquear
          </Button>
        </div>

        {/* Day selector */}
        <div className="flex gap-1 overflow-x-auto pb-1 -mx-6 px-6 scrollbar-none">
          {days.map(day => {
            const count = SCHEDULE_DATA[day].filter(e => !e.blocked).length;
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`
                  flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-2xl min-w-12 transition-all duration-200
                  ${activeDay === day
                    ? 'bg-[#E8734A] shadow-[0_4px_12px_rgba(232,115,74,0.3)]'
                    : 'bg-[#FBF3E9] hover:bg-[#F5E6D3]'
                  }
                `}
              >
                <span className={`text-xs font-bold ${activeDay === day ? 'text-white' : 'text-[#A67850]'}`}>{day}</span>
                <span className={`text-lg font-black font-display ${activeDay === day ? 'text-white' : 'text-[#6B4226]'}`}>
                  {count > 0 ? count : '–'}
                </span>
                {count > 0 && (
                  <div className={`w-1 h-1 rounded-full mt-0.5 ${activeDay === day ? 'bg-white/60' : 'bg-[#E8734A]'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-5">
        {/* Day summary */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Citas', value: totalAppointments, color: '#E8734A' },
            { label: 'Ingresos', value: `$${totalRevenue}`, color: '#F2A950' },
            { label: 'Horas', value: `${Math.round(dayEvents.reduce((s, e) => s + e.duration, 0) / 60 * 10) / 10}h`, color: '#8B9D77' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-3 text-center shadow-[0_2px_12px_rgba(107,66,38,0.08)]">
              <div className="font-black text-lg font-display" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[10px] text-[#C8A88A] font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        {dayEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">😴</div>
            <h3 className="font-black text-[#6B4226] font-display">Día libre</h3>
            <p className="text-sm text-[#A67850] mt-1">No tienes citas programadas para este día</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {dayEvents.map((event, i) => {
              const service = event.service ? getService(event.service) : null;
              const isCompleted = completedEvents.has(eventKey(activeDay, i));
              return (
                <div key={i} className={`flex gap-3 ${event.blocked ? 'opacity-70' : ''}`}>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-[#A67850] w-12 text-right pt-2.5">{event.time}</span>
                  </div>
                  <div className="flex-1">
                    <div
                      className={`rounded-2xl p-3 ${
                        event.blocked
                          ? 'bg-[#F5E6D3] border-2 border-dashed border-[#EDD8BC]'
                          : event.status === 'pending'
                            ? 'bg-white border-2 border-[#F2A950]/50 shadow-[0_2px_12px_rgba(107,66,38,0.08)]'
                            : 'bg-white border-2 border-transparent shadow-[0_2px_12px_rgba(107,66,38,0.08)]'
                      }`}
                    >
                      {event.blocked ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🚫</span>
                          <div>
                            <span className="text-sm font-bold text-[#A67850]">Tiempo bloqueado</span>
                            <div className="text-xs text-[#C8A88A]">{formatDuration(event.duration)}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {service && (
                            <div className="w-9 h-9 bg-[#FBF3E9] rounded-xl flex items-center justify-center text-base flex-shrink-0">
                              {CATEGORY_CONFIG[service.category].emoji}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#6B4226] text-sm">{event.client}</span>
                              {isCompleted
                                ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF2E3] text-[#4A7C59]">✓ Completada</span>
                                : <StatusBadge status={event.status} />
                              }
                            </div>
                            {service && (
                              <div className="text-xs text-[#A67850] flex items-center gap-2">
                                <span>{service.name}</span>
                                <span>·</span>
                                <span>{formatDuration(event.duration)}</span>
                                <span>·</span>
                                <span className="text-[#E8734A] font-semibold">{formatPrice(service.price)}</span>
                              </div>
                            )}
                          </div>
                          {!event.blocked && !isCompleted && event.status === 'confirmed' && (
                            <button
                              onClick={() => markComplete(i)}
                              className="flex-shrink-0 px-3 py-1.5 bg-[#EAF2E3] text-[#4A7C59] text-xs font-bold rounded-xl hover:bg-[#D4EBCA] transition-colors cursor-pointer"
                            >
                              ✓ Finalizar
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    {/* Duration indicator */}
                    <div
                      className="ml-2 my-0.5 rounded-full"
                      style={{
                        height: `${Math.max(4, (event.duration / 90) * 12)}px`,
                        background: event.blocked ? '#EDD8BC' : '#F5E6D3',
                        width: '2px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Block time modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end">
          <div className="bg-white rounded-t-[32px] p-6 w-full">
            <div className="w-10 h-1 bg-[#EDD8BC] rounded-full mx-auto mb-5" />
            <h3 className="font-black text-[#6B4226] font-display text-xl mb-4">Bloquear tiempo</h3>
            <div className="flex flex-col gap-3 mb-5">
              {[
                { icon: '🍽️', label: 'Descanso para comer', duration: '30 min' },
                { icon: '☕', label: 'Pausa corta', duration: '15 min' },
                { icon: '🏖️', label: 'Día libre / vacaciones', duration: 'Todo el día' },
                { icon: '📋', label: 'Reunión de equipo', duration: '60 min' },
                { icon: '🏥', label: 'Cita médica', duration: 'Variable' },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={() => setShowBlockModal(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#FBF3E9] hover:bg-[#F5E6D3] transition-colors text-left"
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-[#6B4226] text-sm">{item.label}</div>
                    <div className="text-xs text-[#A67850]">{item.duration}</div>
                  </div>
                  <span className="text-[#E8734A] font-bold">+</span>
                </button>
              ))}
            </div>
            <Button onClick={() => setShowBlockModal(false)} variant="ghost" fullWidth>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STYLIST CLIENTS ───────────────────────────────────────────────────────────

export function StylistClients() {
  const clients = [
    { name: 'Ana Martínez', visits: 24, lastService: 'Corte Clásico', lastDate: '2026-08-22' },
    { name: 'Pedro Ramírez', visits: 8, lastService: 'Corte + Barba', lastDate: '2026-08-18' },
    { name: 'Luis García', visits: 21, lastService: 'Afeitado con Navaja', lastDate: '2026-08-15' },
    { name: 'María Velásquez', visits: 15, lastService: 'Arreglo de Barba', lastDate: '2026-08-25' },
    { name: 'Carlos Fernández', visits: 4, lastService: 'Corte Clásico', lastDate: '2026-08-10' },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF3E9] p-6">
      <div className="mb-5">
        <h2 className="text-xl font-black text-[#6B4226] font-display">Mis Clientes</h2>
        <p className="text-sm text-[#A67850]">{clients.length} clientes recurrentes</p>
      </div>

      <div className="flex flex-col gap-3">
        {clients.map((client, i) => (
          <Card key={i} padding={false}>
            <div className="p-4 flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{ background: ['#E8734A', '#F2A950', '#8B9D77', '#6B4226', '#C85A31'][i % 5] }}
              >
                {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-[#6B4226] font-display truncate">{client.name}</span>
                  {client.visits >= 20 && (
                    <span className="text-xs font-black bg-[#FEF5E4] text-[#D4883A] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-[#F2A950]/40 shrink-0">
                      👑 VIP
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#A67850] truncate">Última: {client.lastService}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-black text-[#E8734A]">{client.visits}</div>
                <div className="text-[10px] text-[#C8A88A]">visitas</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── STYLIST PERFORMANCE ───────────────────────────────────────────────────────

const MOCK_REVIEWS = [
  { author: 'Ana M.', rating: 5, comment: 'Increíble trabajo, siempre sale perfecto el corte. ¡Ya es mi estilista de cabecera!', date: '2026-08-28' },
  { author: 'Pedro R.', rating: 5, comment: 'Muy profesional y puntual. El corte + barba quedó impecable.', date: '2026-08-22' },
  { author: 'Luis G.', rating: 4, comment: 'Muy buen servicio, el afeitado con navaja fue una experiencia única. Recomendado.', date: '2026-08-18' },
  { author: 'María V.', rating: 5, comment: 'Siempre atento a los detalles, escucha exactamente lo que quieres. 100% recomendado.', date: '2026-08-10' },
  { author: 'Jorge P.', rating: 4, comment: 'Gran profesional. El combo corte+barba quedó genial, precio muy justo.', date: '2026-08-05' },
];

export function StylistPerformance() {
  const stylist = STYLISTS[0];
  const totalAppointments = 163;
  const monthAppointments = 48;
  const avgTip = 4.5;

  const ratingDistribution = [
    { stars: 5, count: 189, pct: 81 },
    { stars: 4, count: 38, pct: 16 },
    { stars: 3, count: 5, pct: 2 },
    { stars: 2, count: 2, pct: 1 },
    { stars: 1, count: 0, pct: 0 },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF3E9] p-4 md:p-6">
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl font-black text-[#6B4226] font-display">Mi Desempeño</h2>
        <p className="text-sm text-[#A67850]">Estadísticas y reseñas de clientes</p>
      </div>

      {/* Hero rating card — plain div so bg-[#E8734A] is not overridden by Card's bg-white */}
      <div className="mb-5 rounded-[20px] p-5 overflow-hidden relative shadow-[0_4px_24px_-4px_rgba(232,115,74,0.35)]" style={{ background: '#E8734A' }}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">✂️</div>
            <div>
              <div className="text-white font-black font-display text-lg">{stylist.name}</div>
              <div className="text-white/80 text-sm">{stylist.specialty}</div>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-white/70 text-xs font-semibold mb-1">VALORACIÓN MEDIA</div>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-black text-white font-display">{stylist.rating}</span>
                <div className="pb-1">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-lg ${s <= Math.round(stylist.rating) ? 'text-[#F2A950]' : 'text-white/30'}`}>★</span>
                    ))}
                  </div>
                  <div className="text-white/70 text-xs mt-0.5">{stylist.reviewCount} reseñas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Citas totales', value: totalAppointments, color: '#E8734A' },
          { label: 'Este mes', value: monthAppointments, color: '#F2A950' },
          { label: 'Propina media', value: `$${avgTip}`, color: '#8B9D77' },
        ].map(s => (
          <Card key={s.label} className="text-center !p-3">
            <div className="text-xl font-black font-display" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[10px] text-[#C8A88A] font-semibold mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Rating distribution */}
      <Card className="mb-5">
        <h3 className="font-black text-[#6B4226] font-display mb-4">Distribución de valoraciones</h3>
        {ratingDistribution.map(row => (
          <div key={row.stars} className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#F2A950] w-4 text-right">{row.stars}</span>
            <span className="text-[#F2A950] text-xs">★</span>
            <div className="flex-1 h-2.5 bg-[#F5E6D3] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${row.pct}%`, background: row.stars >= 4 ? '#E8734A' : row.stars === 3 ? '#F2A950' : '#C45C4C' }}
              />
            </div>
            <span className="text-xs text-[#A67850] font-medium w-8 text-right">{row.count}</span>
          </div>
        ))}
      </Card>

      {/* Recent reviews */}
      <h3 className="font-black text-[#6B4226] font-display mb-3">Últimas reseñas</h3>
      <div className="flex flex-col gap-3">
        {MOCK_REVIEWS.map((review, i) => (
          <Card key={i}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ background: ['#E8734A','#F2A950','#8B9D77','#6B4226','#C85A31'][i % 5] }}
                >
                  {review.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#6B4226]">{review.author}</div>
                  <div className="text-[10px] text-[#C8A88A]">{review.date}</div>
                </div>
              </div>
              <div className="flex gap-0.5 flex-shrink-0">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-sm ${s <= review.rating ? 'text-[#F2A950]' : 'text-[#EDD8BC]'}`}>★</span>
                ))}
              </div>
            </div>
            <p className="text-sm text-[#6B4226] leading-relaxed italic">"{review.comment}"</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
