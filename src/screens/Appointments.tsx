import { useState } from 'react';
import { APPOINTMENTS, SERVICES, STYLISTS, getService, getStylist, formatDate, formatDateShort, formatPrice, formatDuration, CATEGORY_CONFIG, STATUS_CONFIG, type Appointment, type AppointmentStatus } from '../data';
import { StatusBadge, Button, Card, PageHeader, EmptyState } from '../ui';
import { EmptyAppointmentsIllustration, MemphisStylistAvatar } from '../illustrations';

// ─── MY APPOINTMENTS ───────────────────────────────────────────────────────────

export function MyAppointments({ onBook, onViewDetail, onBack }: {
  onBook: () => void;
  onViewDetail: (id: string) => void;
  onBack?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const upcoming = APPOINTMENTS.filter(a =>
    a.date >= todayStr && (a.status === 'confirmed' || a.status === 'pending')
  );
  const past = APPOINTMENTS.filter(a =>
    a.date < todayStr || a.status === 'completed' || a.status === 'cancelled'
  );

  const list = activeTab === 'upcoming' ? upcoming : past;

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9]">
      <div className="bg-white px-5 pt-10 pb-0 shadow-[0_2px_12px_rgba(107,66,38,0.06)]">
        <PageHeader title="Mis Citas" subtitle="Gestiona todas tus reservas" onBack={onBack} />

        {/* Tabs */}
        <div className="flex px-5 gap-1">
          {(['upcoming', 'past'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex-1 py-3 text-sm font-bold transition-all duration-200 border-b-2
                ${activeTab === tab
                  ? 'text-[#E8734A] border-[#E8734A]'
                  : 'text-[#C8A88A] border-transparent hover:text-[#A67850]'
                }
              `}
            >
              {tab === 'upcoming' ? `Próximas (${upcoming.length})` : `Historial (${past.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-24">
        {list.length === 0 ? (
          <EmptyState
            illustration={<EmptyAppointmentsIllustration />}
            title={activeTab === 'upcoming' ? 'Sin citas próximas' : 'Sin historial aún'}
            subtitle={activeTab === 'upcoming'
              ? 'Aún no tienes ninguna cita reservada. ¡Anímate a reservar ahora!'
              : 'Aquí aparecerán tus citas pasadas una vez las tengas.'
            }
            action={
              activeTab === 'upcoming'
                ? <Button onClick={onBook} variant="primary" size="md">Reservar mi primera cita</Button>
                : undefined
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {list.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onClick={() => onViewDetail(appointment.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APPOINTMENT CARD ──────────────────────────────────────────────────────────

function AppointmentCard({ appointment, onClick }: { appointment: Appointment; onClick: () => void }) {
  const service = getService(appointment.serviceId);
  const stylist = getStylist(appointment.stylistId);
  if (!service || !stylist) return null;

  const [y, m, d] = appointment.date.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayNum = dateObj.getDate();
  const month = dateObj.toLocaleDateString('es-ES', { month: 'short' });
  const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'short' });

  return (
    <Card onClick={onClick} padding={false}>
      <div className="p-4 flex items-start gap-3">
        {/* Date block */}
        <div className="flex-shrink-0 w-14 bg-[#FBF3E9] rounded-2xl flex flex-col items-center justify-center py-2 px-1">
          <span className="text-[10px] font-bold text-[#A67850] uppercase">{month}</span>
          <span className="text-2xl font-black text-[#E8734A] leading-none">{dayNum}</span>
          <span className="text-[10px] font-bold text-[#C8A88A] capitalize">{dayName}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className="font-black font-display text-[#6B4226] text-base leading-tight">{service.name}</span>
            <StatusBadge status={appointment.status} />
          </div>

          <div className="flex items-center gap-2 mt-1.5">
            <MemphisStylistAvatar name={stylist.name} color={stylist.color} size={22} />
            <span className="text-xs text-[#A67850] font-medium">{stylist.name}</span>
          </div>

          <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-[#A67850]">
            <span className="flex items-center gap-1">🕐 {appointment.time}</span>
            <span className="flex items-center gap-1">⏱ {formatDuration(service.duration)}</span>
            <span className="flex items-center gap-1 text-[#E8734A]">💰 {formatPrice(service.price)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── APPOINTMENT DETAIL ────────────────────────────────────────────────────────

export function AppointmentDetail({ appointmentId, onReschedule, onCancel, onRebook, onBack }: {
  appointmentId: string;
  onReschedule: () => void;
  onCancel: () => void;
  onRebook: (serviceId: string) => void;
  onBack: () => void;
}) {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [tipAmount, setTipAmount] = useState('');
  const [tipCustom, setTipCustom] = useState('');
  const [tipSent, setTipSent] = useState(false);
  const [tipLoading, setTipLoading] = useState(false);

  const handleReviewSubmit = () => {
    if (reviewRating === 0) return;
    setReviewLoading(true);
    setTimeout(() => { setReviewLoading(false); setReviewSubmitted(true); }, 800);
  };

  const handleTip = () => {
    const amount = tipAmount === 'custom' ? tipCustom : tipAmount;
    if (!amount) return;
    setTipLoading(true);
    setTimeout(() => { setTipLoading(false); setTipSent(true); }, 800);
  };

  const appointment = APPOINTMENTS.find(a => a.id === appointmentId);
  if (!appointment) return null;

  const service = getService(appointment.serviceId);
  const stylist = getStylist(appointment.stylistId);
  if (!service || !stylist) return null;

  const [y, m, d] = appointment.date.split('-').map(Number);
  const formattedDate = new Date(y, m - 1, d).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const isUpcoming = appointment.status === 'confirmed' || appointment.status === 'pending';

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9]">
      <div className="bg-white px-5 pt-10 pb-4 shadow-[0_2px_12px_rgba(107,66,38,0.06)]">
        <PageHeader title="Detalle de Cita" onBack={onBack} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-28">
        {/* Status header */}
        <div className={`rounded-[20px] p-5 mb-5 flex items-center gap-4`}
          style={{ background: STATUS_CONFIG[appointment.status].bg }}>
          <div className="w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center text-3xl flex-shrink-0">
            {CATEGORY_CONFIG[service.category].emoji}
          </div>
          <div className="flex-1">
            <div className="font-black font-display text-[#6B4226] text-lg">{service.name}</div>
            <StatusBadge status={appointment.status} />
          </div>
        </div>

        {/* Details */}
        <Card className="mb-5">
          <h3 className="font-black text-[#6B4226] font-display mb-4">Información de la cita</h3>
          {[
            { icon: '📅', label: 'Fecha', value: formattedDate },
            { icon: '🕐', label: 'Hora', value: appointment.time },
            { icon: '⏱', label: 'Duración', value: formatDuration(service.duration) },
            { icon: '💰', label: 'Precio', value: formatPrice(service.price) },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#FBF3E9] rounded-xl flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="text-[10px] font-semibold text-[#C8A88A] uppercase tracking-wide">{item.label}</div>
                <div className="font-semibold text-[#6B4226] text-sm capitalize">{item.value}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Stylist card */}
        <Card className="mb-5">
          <h3 className="font-black text-[#6B4226] font-display mb-3">Tu estilista</h3>
          <div className="flex items-center gap-3">
            <MemphisStylistAvatar name={stylist.name} color={stylist.color} size={52} />
            <div className="flex-1">
              <div className="font-black text-[#6B4226] font-display">{stylist.name}</div>
              <div className="text-sm text-[#A67850]">{stylist.specialty}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[#F2A950] text-sm">★</span>
                <span className="text-sm font-bold text-[#6B4226]">{stylist.rating}</span>
                <span className="text-xs text-[#C8A88A]">({stylist.reviewCount} reseñas)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Completed: review + tip */}
        {appointment.status === 'completed' && (
          <>
            {/* Review card */}
            <Card className="mb-4">
              {reviewSubmitted ? (
                <div className="text-center py-3">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="font-black text-[#6B4226] font-display">¡Gracias por tu reseña!</p>
                  <p className="text-sm text-[#A67850] mt-1">Tu opinión ayuda a mejorar el servicio</p>
                  <div className="flex justify-center gap-0.5 mt-2">
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={`text-lg ${s <= reviewRating ? 'text-[#F2A950]' : 'text-[#EDD8BC]'}`}>★</span>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <h4 className="font-black text-[#6B4226] font-display mb-1">¿Cómo fue tu experiencia?</h4>
                  <p className="text-sm text-[#A67850] mb-3">Tu reseña es muy valiosa para nosotros</p>
                  {/* Star selector */}
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-3xl transition-all hover:scale-110 active:scale-95 ${star <= reviewRating ? 'text-[#F2A950]' : 'text-[#EDD8BC]'}`}
                      >
                        ★
                      </button>
                    ))}
                    {reviewRating > 0 && (
                      <span className="text-sm text-[#A67850] self-center ml-1 font-medium">
                        {['','Muy malo','Malo','Regular','Bueno','¡Excelente!'][reviewRating]}
                      </span>
                    )}
                  </div>
                  {/* Comment */}
                  <textarea
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Cuéntanos tu experiencia (opcional)..."
                    rows={3}
                    className="w-full rounded-[14px] border-2 border-[#EDD8BC] bg-[#FBF3E9] px-4 py-3 text-sm text-[#6B4226] placeholder-[#C8A88A] focus:border-[#E8734A] outline-none resize-none transition-colors mb-3"
                  />
                  {reviewRating === 0 && (
                    <div className="flex items-center gap-2 bg-[#FEF5E4] rounded-xl p-2.5 mb-3">
                      <span className="text-sm">⚠️</span>
                      <p className="text-xs text-[#8B6914] font-medium">Selecciona al menos una estrella para enviar</p>
                    </div>
                  )}
                  <Button onClick={handleReviewSubmit} variant="primary" size="md" fullWidth disabled={reviewRating === 0 || reviewLoading}>
                    {reviewLoading ? '⏳ Enviando...' : '✉️ Enviar reseña'}
                  </Button>
                </>
              )}
            </Card>

            {/* Tip card */}
            <Card className="mb-4 bg-[#FBF3E9] border-2 border-[#EDD8BC]">
              {tipSent ? (
                <div className="text-center py-2">
                  <div className="text-3xl mb-1">💛</div>
                  <p className="font-black text-[#6B4226] font-display">¡Propina enviada!</p>
                  <p className="text-sm text-[#A67850]">
                    ${tipAmount === 'custom' ? tipCustom : tipAmount} enviados a {stylist.name}. Muy amable de tu parte.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-black text-[#6B4226] font-display">Dejar propina 💛</h4>
                      <p className="text-xs text-[#A67850]">100% va al estilista</p>
                    </div>
                    {!showTip && (
                      <Button onClick={() => setShowTip(true)} variant="secondary" size="sm">
                        Dejar propina
                      </Button>
                    )}
                  </div>
                  {showTip && (
                    <>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {['2', '5', '10', 'custom'].map(amt => (
                          <button
                            key={amt}
                            onClick={() => setTipAmount(amt)}
                            className={`py-2.5 rounded-2xl text-sm font-bold transition-all ${
                              tipAmount === amt
                                ? 'bg-[#E8734A] text-white shadow-[0_4px_12px_rgba(232,115,74,0.3)]'
                                : 'bg-white border-2 border-[#EDD8BC] text-[#6B4226] hover:border-[#E8734A]'
                            }`}
                          >
                            {amt === 'custom' ? '✏️' : `$${amt}`}
                          </button>
                        ))}
                      </div>
                      {tipAmount === 'custom' && (
                        <div className="mb-3 relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A67850] font-bold">$</span>
                          <input
                            type="number"
                            min="1"
                            value={tipCustom}
                            onChange={e => setTipCustom(e.target.value)}
                            placeholder="Escribe el monto"
                            className="w-full rounded-[14px] border-2 border-[#EDD8BC] bg-white pl-8 pr-4 py-3 text-sm text-[#6B4226] focus:border-[#E8734A] outline-none transition-colors"
                          />
                        </div>
                      )}
                      {tipAmount && (
                        <Button onClick={handleTip} variant="primary" size="md" fullWidth disabled={tipLoading || (tipAmount === 'custom' && !tipCustom)}>
                          {tipLoading ? '⏳ Procesando...' : `Enviar $${tipAmount === 'custom' ? tipCustom || '—' : tipAmount} de propina`}
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
            </Card>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#F5E6D3] p-5 pb-safe">
        {isUpcoming ? (
          <div className="flex flex-col gap-2">
            <Button onClick={onReschedule} variant="secondary" size="lg" fullWidth>
              📅 Reprogramar cita
            </Button>
            <Button onClick={onCancel} variant="danger" size="md" fullWidth>
              Cancelar cita
            </Button>
          </div>
        ) : appointment.status === 'completed' ? (
          <Button onClick={() => onRebook(appointment.serviceId)} variant="primary" size="lg" fullWidth>
            🔄 Reservar de nuevo
          </Button>
        ) : (
          <Button onClick={() => onRebook(appointment.serviceId)} variant="primary" size="lg" fullWidth>
            ✂️ Reservar otra cita
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── CANCEL APPOINTMENT ────────────────────────────────────────────────────────

export function CancelAppointment({ appointmentId, onConfirm, onBack }: {
  appointmentId: string;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [loading, setLoading] = useState(false);

  const appointment = APPOINTMENTS.find(a => a.id === appointmentId);
  const service = appointment ? getService(appointment.serviceId) : null;

  const reasons = [
    'Cambio de planes',
    'Problema de salud',
    'Trabajo / compromisos',
    'Encontré otra barbería',
    'Otro motivo',
  ];

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onConfirm(); }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9]">
      <div className="bg-white px-5 pt-10 pb-4 shadow-[0_2px_12px_rgba(107,66,38,0.06)]">
        <PageHeader title="Cancelar Cita" onBack={onBack} />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-28">
        {/* Warning */}
        <div className="bg-[#F8D7DA] border border-[#F0C0BE] rounded-2xl p-4 mb-5 flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-bold text-[#C45C4C] mb-1">¿Seguro que quieres cancelar?</p>
            <p className="text-sm text-[#A84A3A]">
              Cancelaciones con menos de 2 horas de anticipación pueden tener un cargo del 20%.
            </p>
          </div>
        </div>

        {service && (
          <Card className="mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FBF3E9] rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                {CATEGORY_CONFIG[service.category].emoji}
              </div>
              <div>
                <div className="font-black font-display text-[#6B4226]">{service.name}</div>
                <div className="text-sm text-[#A67850]">
                  {appointment?.date} a las {appointment?.time}
                </div>
              </div>
            </div>
          </Card>
        )}

        <Card>
          <h4 className="font-black text-[#6B4226] font-display mb-3">Motivo (opcional)</h4>
          <div className="flex flex-col gap-2 mb-3">
            {reasons.map(r => (
              <button
                key={r}
                onClick={() => setSelectedReason(r === selectedReason ? '' : r)}
                className={`
                  flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all text-left
                  ${selectedReason === r
                    ? 'border-[#E8734A] bg-[#FBF3E9] text-[#E8734A]'
                    : 'border-[#F5E6D3] text-[#A67850] hover:border-[#EDD8BC]'
                  }
                `}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedReason === r ? 'border-[#E8734A] bg-[#E8734A]' : 'border-[#C8A88A]'}`}>
                  {selectedReason === r && <span className="text-white text-[8px] font-black">•</span>}
                </div>
                {r}
              </button>
            ))}
          </div>

          {selectedReason === 'Otro motivo' && (
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Cuéntanos más..."
              rows={3}
              className="w-full rounded-[14px] border-2 border-[#EDD8BC] bg-white px-4 py-3 text-sm text-[#6B4226] placeholder-[#C8A88A] focus:border-[#E8734A] outline-none resize-none transition-colors"
            />
          )}
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#F5E6D3] p-5 pb-safe flex flex-col gap-2">
        <Button onClick={handleConfirm} variant="danger" size="lg" fullWidth disabled={loading}>
          {loading ? '⏳ Cancelando...' : 'Confirmar cancelación'}
        </Button>
        <Button onClick={onBack} variant="ghost" size="md" fullWidth>
          Mantener mi cita
        </Button>
      </div>
    </div>
  );
}
