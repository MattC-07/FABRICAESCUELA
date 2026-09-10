import { useState, useMemo } from 'react';
import {
  SERVICES, STYLISTS, TIME_SLOTS, UNAVAILABLE_DATES, BUSY_DATES,
  getStylistsForService, getService, getStylist,
  formatPrice, formatDuration, formatDate,
  CATEGORY_CONFIG, type BookingState,
} from '../data';
import { SuccessIllustration, MemphisStylistAvatar } from '../illustrations';
import { Button, BookingProgress, Card, PopularBadge, StarRating, PageHeader } from '../ui';

// ─── STEP 1 — Choose Service ───────────────────────────────────────────────────

export function BookStep1({ onNext, onBack }: {
  onNext: (serviceId: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const categories = ['cut', 'beard', 'color', 'treatment'] as const;

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9]">
      <div className="bg-white px-5 pt-10 pb-4 shadow-[0_2px_12px_rgba(107,66,38,0.06)]">
        <PageHeader title="Reservar Cita" subtitle="Elige un servicio para continuar" onBack={onBack} />
        <div className="px-5 pt-2 pb-4">
          <BookingProgress step={1} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-28">
        {categories.map(cat => {
          const catServices = SERVICES.filter(s => s.category === cat);
          if (!catServices.length) return null;
          const cfg = CATEGORY_CONFIG[cat];
          return (
            <div key={cat} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{cfg.emoji}</span>
                <h3 className="font-black text-[#6B4226] font-display">{cfg.label}</h3>
              </div>
              <div className="flex flex-col gap-3">
                {catServices.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelected(service.id)}
                    className={`
                      flex items-start gap-4 p-4 rounded-[20px] text-left w-full transition-all duration-200
                      ${selected === service.id
                        ? 'bg-[#E8734A] shadow-[0_4px_20px_rgba(232,115,74,0.35)] scale-[1.01]'
                        : 'bg-white shadow-[0_2px_12px_rgba(107,66,38,0.08)] hover:shadow-[0_4px_20px_rgba(107,66,38,0.14)] hover:scale-[1.01]'
                      }
                    `}
                  >
                    {/* Service icon area */}
                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl
                      ${selected === service.id ? 'bg-white/20' : 'bg-[#FBF3E9]'}
                    `}>
                      {cfg.emoji}
                    </div>

                    {/* Service info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <span className={`font-black font-display text-base leading-tight ${selected === service.id ? 'text-white' : 'text-[#6B4226]'}`}>
                          {service.name}
                        </span>
                        {service.popular && <PopularBadge />}
                      </div>
                      <p className={`text-sm mt-1 leading-relaxed line-clamp-2 ${selected === service.id ? 'text-white/80' : 'text-[#A67850]'}`}>
                        {service.description}
                      </p>
                      <div className={`flex items-center gap-3 mt-2 text-sm font-semibold ${selected === service.id ? 'text-white' : 'text-[#E8734A]'}`}>
                        <span className="flex items-center gap-1">
                          <span>⏱</span> {formatDuration(service.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>💰</span> {formatPrice(service.price)}
                        </span>
                      </div>
                    </div>

                    {selected === service.id && (
                      <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#F5E6D3] p-5 pb-safe">
        <Button
          onClick={() => selected && onNext(selected)}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selected}
        >
          {selected ? `Continuar con ${getService(selected)?.name}` : 'Selecciona un servicio'}
        </Button>
      </div>
    </div>
  );
}

// ─── STEP 2 — Choose Stylist ───────────────────────────────────────────────────

export function BookStep2({ serviceId, onNext, onBack }: {
  serviceId: string;
  onNext: (stylistId: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const service = getService(serviceId);
  const stylists = getStylistsForService(serviceId);

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9]">
      <div className="bg-white px-5 pt-10 pb-4 shadow-[0_2px_12px_rgba(107,66,38,0.06)]">
        <PageHeader title="Elige tu Estilista" subtitle={`Para: ${service?.name}`} onBack={onBack} />
        <div className="px-5 pt-2 pb-4">
          <BookingProgress step={2} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-28">
        {/* "Any available" option */}
        <button
          onClick={() => setSelected('any')}
          className={`
            flex items-center gap-4 w-full p-4 rounded-[20px] text-left mb-4 transition-all duration-200
            ${selected === 'any'
              ? 'bg-[#E8734A] shadow-[0_4px_20px_rgba(232,115,74,0.35)]'
              : 'bg-white shadow-[0_2px_12px_rgba(107,66,38,0.08)] hover:shadow-[0_4px_20px_rgba(107,66,38,0.14)]'
            }
          `}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${selected === 'any' ? 'bg-white/20' : 'bg-[#F5E6D3]'}`}>
            🎲
          </div>
          <div className="flex-1">
            <div className={`font-black font-display text-base ${selected === 'any' ? 'text-white' : 'text-[#6B4226]'}`}>
              Cualquiera disponible
            </div>
            <div className={`text-sm font-medium ${selected === 'any' ? 'text-white/80' : 'text-[#A67850]'}`}>
              Te asignamos el primer profesional libre
            </div>
          </div>
          {selected === 'any' && (
            <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          )}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#EDD8BC]" />
          <span className="text-xs font-semibold text-[#C8A88A]">o elige un estilista</span>
          <div className="flex-1 h-px bg-[#EDD8BC]" />
        </div>

        <div className="flex flex-col gap-3">
          {stylists.map(stylist => (
            <button
              key={stylist.id}
              onClick={() => setSelected(stylist.id)}
              className={`
                flex items-center gap-4 w-full p-4 rounded-[20px] text-left transition-all duration-200
                ${selected === stylist.id
                  ? 'bg-[#E8734A] shadow-[0_4px_20px_rgba(232,115,74,0.35)]'
                  : 'bg-white shadow-[0_2px_12px_rgba(107,66,38,0.08)] hover:shadow-[0_4px_20px_rgba(107,66,38,0.14)]'
                }
              `}
            >
              <div className="flex-shrink-0">
                <MemphisStylistAvatar name={stylist.name} color={stylist.color} size={56} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-black font-display text-base ${selected === stylist.id ? 'text-white' : 'text-[#6B4226]'}`}>
                  {stylist.name}
                </div>
                <div className={`text-sm font-medium ${selected === stylist.id ? 'text-white/80' : 'text-[#A67850]'}`}>
                  {stylist.specialty}
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <span className={`text-xs font-bold ${selected === stylist.id ? 'text-white' : 'text-[#F2A950]'}`}>
                    ★ {stylist.rating.toFixed(1)}
                  </span>
                  <span className={`text-xs ${selected === stylist.id ? 'text-white/60' : 'text-[#C8A88A]'}`}>
                    ({stylist.reviewCount} reseñas)
                  </span>
                </div>
              </div>
              {selected === stylist.id && (
                <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#F5E6D3] p-5 pb-safe">
        <Button
          onClick={() => selected && onNext(selected)}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selected}
        >
          {selected ? 'Elegir horario →' : 'Selecciona un estilista'}
        </Button>
      </div>
    </div>
  );
}

// ─── STEP 3 — Choose Date & Time ───────────────────────────────────────────────

function Calendar({ selected, onSelect }: { selected: string | null; onSelect: (d: string) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const dayLabels = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const getDateStr = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${viewYear}-${mm}-${dd}`;
  };

  const isPast = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayMidnight;
  };

  return (
    <Card className="mb-5">
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-full bg-[#F5E6D3] hover:bg-[#EDD8BC] flex items-center justify-center text-[#6B4226] transition-colors font-bold"
        >
          ‹
        </button>
        <span className="font-black text-[#6B4226] font-display capitalize">{monthName}</span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full bg-[#F5E6D3] hover:bg-[#EDD8BC] flex items-center justify-center text-[#6B4226] transition-colors font-bold"
        >
          ›
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-2">
        {dayLabels.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-[#C8A88A] py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: adjustedFirstDay }).map((_, i) => <div key={`pad-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = getDateStr(day);
          const past = isPast(day);
          const unavailable = UNAVAILABLE_DATES.includes(dateStr);
          const busy = BUSY_DATES.includes(dateStr);
          const isSelected = selected === dateStr;
          const disabled = past || unavailable;

          return (
            <button
              key={day}
              onClick={() => !disabled && onSelect(dateStr)}
              disabled={disabled}
              className={`
                relative flex flex-col items-center justify-center h-10 rounded-xl text-sm font-semibold transition-all duration-150
                ${isSelected ? 'bg-[#E8734A] text-white shadow-[0_4px_12px_rgba(232,115,74,0.4)] scale-[1.1]' : ''}
                ${!isSelected && !disabled && !busy ? 'hover:bg-[#FBF3E9] text-[#6B4226] hover:scale-[1.05]' : ''}
                ${!isSelected && busy && !disabled ? 'bg-[#FEF5E4] text-[#D4883A] hover:bg-[#FDEBD0] hover:scale-[1.05]' : ''}
                ${disabled ? 'text-[#D8C4B0] cursor-not-allowed' : ''}
              `}
            >
              {day}
              {busy && !isSelected && !disabled && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#F2A950]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#F5E6D3]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#E8734A]" />
          <span className="text-[10px] text-[#A67850] font-medium">Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FEF5E4] border border-[#F2A950]" />
          <span className="text-[10px] text-[#A67850] font-medium">Pocas plazas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#F5E6D3]" />
          <span className="text-[10px] text-[#A67850] font-medium">No disponible</span>
        </div>
      </div>
    </Card>
  );
}

export function BookStep3({ serviceId, stylistId, onNext, onBack }: {
  serviceId: string;
  stylistId: string;
  onNext: (date: string, time: string) => void;
  onBack: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const service = getService(serviceId);

  const slots = useMemo(() => {
    if (!selectedDate) return [];
    return TIME_SLOTS.map(slot => ({
      ...slot,
      available: slot.available && !BUSY_DATES.includes(selectedDate),
    }));
  }, [selectedDate]);

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9]">
      <div className="bg-white px-5 pt-10 pb-4 shadow-[0_2px_12px_rgba(107,66,38,0.06)]">
        <PageHeader title="Elige el Horario" subtitle={service?.name} onBack={onBack} />
        <div className="px-5 pt-2 pb-4">
          <BookingProgress step={3} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-32">
        {/* Duration info */}
        <div className="flex items-center gap-2 mb-5 p-3 bg-white rounded-2xl border border-[#F5E6D3]">
          <span className="text-lg">⏱</span>
          <span className="text-sm font-semibold text-[#6B4226]">
            Duración del servicio: <span className="text-[#E8734A]">{formatDuration(service?.duration ?? 30)}</span>
          </span>
        </div>

        {/* Calendar */}
        <h3 className="font-black text-[#6B4226] font-display mb-3">Selecciona el día</h3>
        <Calendar selected={selectedDate} onSelect={d => { setSelectedDate(d); setSelectedTime(null); }} />

        {/* Time slots */}
        {selectedDate && (
          <div>
            <h3 className="font-black text-[#6B4226] font-display mb-3">
              Horarios disponibles
              <span className="ml-2 text-sm text-[#A67850] font-medium">
                {new Date(...(selectedDate.split('-').map(Number) as [number, number, number])).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </h3>

            <div className="grid grid-cols-4 gap-2">
              {slots.map(slot => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`
                    py-2.5 rounded-2xl text-sm font-bold transition-all duration-150
                    ${selectedTime === slot.time
                      ? 'bg-[#E8734A] text-white shadow-[0_4px_12px_rgba(232,115,74,0.4)] scale-[1.05]'
                      : slot.available
                        ? 'bg-white border-2 border-[#E8734A] text-[#E8734A] hover:bg-[#FBF3E9] hover:scale-[1.03]'
                        : 'bg-[#F5E6D3] text-[#D8C4B0] cursor-not-allowed border-2 border-transparent'
                    }
                  `}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}

        {!selectedDate && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📅</div>
            <p className="text-[#A67850] font-medium text-sm">Selecciona una fecha en el calendario para ver los horarios disponibles</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#F5E6D3] p-5 pb-safe">
        {selectedDate && selectedTime && (
          <div className="flex items-center gap-2 mb-3 p-3 bg-[#FBF3E9] rounded-2xl">
            <span className="text-base">📍</span>
            <div className="flex-1">
              <span className="text-xs font-semibold text-[#6B4226]">
                {new Date(...(selectedDate.split('-').map(Number) as [number, number, number])).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                {' '}a las {selectedTime}
              </span>
            </div>
          </div>
        )}
        <Button
          onClick={() => selectedDate && selectedTime && onNext(selectedDate, selectedTime)}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!selectedDate || !selectedTime}
        >
          {selectedDate && selectedTime ? 'Revisar reserva →' : 'Elige fecha y hora'}
        </Button>
      </div>
    </div>
  );
}

// ─── STEP 4 — Confirm ──────────────────────────────────────────────────────────

export function BookStep4({ booking, onConfirm, onBack }: {
  booking: BookingState;
  onConfirm: () => void;
  onBack: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const service = getService(booking.serviceId!);
  const stylist = booking.stylistId === 'any' ? null : getStylist(booking.stylistId!);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onConfirm(); }, 1200);
  };

  if (!service || !booking.date || !booking.time) return null;

  const formattedDate = (() => {
    const [y, m, d] = booking.date.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  })();

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9]">
      <div className="bg-white px-5 pt-10 pb-4 shadow-[0_2px_12px_rgba(107,66,38,0.06)]">
        <PageHeader title="Confirmar Reserva" subtitle="Revisa los detalles antes de confirmar" onBack={onBack} />
        <div className="px-5 pt-2 pb-4">
          <BookingProgress step={4} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 pb-36">
        {/* Summary card */}
        <Card className="mb-5">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#F5E6D3]">
            <div className="w-12 h-12 rounded-2xl bg-[#FBF3E9] flex items-center justify-center text-2xl flex-shrink-0">
              {CATEGORY_CONFIG[service.category].emoji}
            </div>
            <div className="flex-1">
              <div className="font-black text-[#6B4226] font-display text-lg leading-tight">{service.name}</div>
              <div className="text-sm text-[#A67850] font-medium">{formatDuration(service.duration)} de servicio</div>
            </div>
            <div className="text-xl font-black text-[#E8734A]">{formatPrice(service.price)}</div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FBF3E9] flex items-center justify-center flex-shrink-0">
                <span className="text-base">📅</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#C8A88A] uppercase tracking-wide">Fecha</div>
                <div className="font-semibold text-[#6B4226] capitalize text-sm">{formattedDate}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FBF3E9] flex items-center justify-center flex-shrink-0">
                <span className="text-base">🕐</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#C8A88A] uppercase tracking-wide">Hora</div>
                <div className="font-semibold text-[#6B4226] text-sm">{booking.time}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FBF3E9] flex items-center justify-center flex-shrink-0">
                <span className="text-base">✂️</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-[#C8A88A] uppercase tracking-wide">Estilista</div>
                <div className="font-semibold text-[#6B4226] text-sm">
                  {stylist ? stylist.name : 'Cualquiera disponible'}
                </div>
                {stylist && (
                  <div className="text-xs text-[#A67850]">{stylist.specialty}</div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Price breakdown */}
        <Card className="mb-5">
          <h4 className="font-black text-[#6B4226] font-display mb-3">Resumen de pago</h4>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#A67850]">{service.name}</span>
              <span className="font-semibold text-[#6B4226] text-sm">{formatPrice(service.price)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#A67850]">Gestión de reserva</span>
              <span className="font-semibold text-[#8B9D77] text-sm">Gratis</span>
            </div>
            <div className="h-px bg-[#F5E6D3] my-1" />
            <div className="flex justify-between items-center">
              <span className="font-black text-[#6B4226] font-display">Total a pagar</span>
              <span className="font-black text-[#E8734A] text-xl">{formatPrice(service.price)}</span>
            </div>
          </div>
          <div className="mt-3 p-3 bg-[#EAF2E3] rounded-xl">
            <p className="text-xs text-[#4A7C59] font-semibold text-center">
              💳 Pago al momento de la cita — no se cobra ahora
            </p>
          </div>
        </Card>

        {/* Cancellation policy */}
        <div className="bg-[#FEF5E4] border border-[#F2A950]/30 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-[#8B6914]">Política de cancelación</p>
              <p className="text-xs text-[#A67850] mt-1 leading-relaxed">
                Puedes cancelar sin coste hasta 2 horas antes de tu cita. Cancelaciones tardías pueden suponer un cargo del 20%.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#F5E6D3] p-5 pb-safe">
        <Button onClick={handleConfirm} variant="primary" size="lg" fullWidth disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span> Confirmando reserva...
            </span>
          ) : (
            '✅ Confirmar cita'
          )}
        </Button>
        <p className="text-center text-xs text-[#A67850] mt-2">
          Recibirás una confirmación por correo
        </p>
      </div>
    </div>
  );
}

// ─── SUCCESS ───────────────────────────────────────────────────────────────────

export function BookSuccess({ booking, onGoToAppointments, onGoHome }: {
  booking: BookingState;
  onGoToAppointments: () => void;
  onGoHome: () => void;
}) {
  const service = getService(booking.serviceId!);
  const stylist = booking.stylistId === 'any' ? null : getStylist(booking.stylistId!);

  if (!service || !booking.date || !booking.time) return null;

  const formattedDate = (() => {
    const [y, m, d] = booking.date.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  })();

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9] overflow-y-auto">
      {/* Top decoration blobs */}
      <div className="absolute top-0 right-0 w-52 h-52 bg-[#F5E6D3] rounded-full -translate-y-1/3 translate-x-1/3" />
      <div className="absolute top-20 left-0 w-32 h-32 bg-[#EDD8BC] rounded-full -translate-x-1/2 opacity-50" />

      {/* Illustration */}
      <div className="relative z-10 flex-shrink-0 h-64 flex items-center justify-center px-8 pt-12">
        <SuccessIllustration />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 px-6 pb-10">
        {/* Success badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-[#EAF2E3] px-4 py-2 rounded-full border border-[#A8BB92]">
            <span className="text-[#4A7C59] text-sm">✓</span>
            <span className="text-sm font-bold text-[#4A7C59]">¡Reserva confirmada!</span>
          </div>
        </div>

        <h1 className="text-3xl font-black text-[#6B4226] font-display text-center leading-tight mb-2">
          ¡Todo listo!
        </h1>
        <p className="text-center text-[#A67850] text-sm leading-relaxed mb-6">
          Tu cita ha sido reservada con éxito. Te esperamos pronto.
        </p>

        {/* Booking summary card */}
        <Card className="mb-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 pb-3 border-b border-[#F5E6D3]">
              <div className="w-10 h-10 rounded-2xl bg-[#FBF3E9] flex items-center justify-center text-xl flex-shrink-0">
                {CATEGORY_CONFIG[service.category].emoji}
              </div>
              <div className="flex-1">
                <div className="font-black text-[#6B4226] font-display">{service.name}</div>
                <div className="text-xs text-[#A67850]">{formatDuration(service.duration)}</div>
              </div>
              <div className="font-black text-[#E8734A]">{formatPrice(service.price)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FBF3E9] rounded-xl p-3">
                <div className="text-[10px] font-semibold text-[#C8A88A] uppercase tracking-wide mb-1">Fecha</div>
                <div className="font-bold text-[#6B4226] text-sm capitalize">{formattedDate}</div>
              </div>
              <div className="bg-[#FBF3E9] rounded-xl p-3">
                <div className="text-[10px] font-semibold text-[#C8A88A] uppercase tracking-wide mb-1">Hora</div>
                <div className="font-bold text-[#6B4226] text-sm">{booking.time}</div>
              </div>
            </div>

            <div className="bg-[#FBF3E9] rounded-xl p-3">
              <div className="text-[10px] font-semibold text-[#C8A88A] uppercase tracking-wide mb-1">Estilista</div>
              <div className="font-bold text-[#6B4226] text-sm">{stylist?.name ?? 'Cualquiera disponible'}</div>
            </div>
          </div>
        </Card>

        {/* Confirmation number */}
        <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-white rounded-2xl border-2 border-dashed border-[#EDD8BC]">
          <span className="text-sm text-[#A67850]">Nº de reserva:</span>
          <span className="font-black text-[#E8734A] text-sm tracking-widest">#BB-{Math.random().toString(36).slice(2, 8).toUpperCase()}</span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Button onClick={onGoToAppointments} variant="primary" size="lg" fullWidth>
            Ver mis citas
          </Button>
          <Button onClick={onGoHome} variant="secondary" size="lg" fullWidth>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
