import { useState } from 'react';
import { SERVICES, STYLISTS, getService, formatPrice, formatDuration, CATEGORY_CONFIG, getStylistsForService } from '../data';
import { Button, Card, PopularBadge, StarRating, CategoryBadge, PageHeader, Input } from '../ui';
import { MemphisStylistAvatar, ScissorsIcon } from '../illustrations';

// ─── HOME / CATALOG ────────────────────────────────────────────────────────────

export function ClientHome({ onBook, onViewService, userName = 'Juan' }: {
  onBook: (serviceId?: string) => void;
  onViewService: (id: string) => void;
  userName?: string;
}) {
  const [query, setQuery] = useState('');
  const popularServices = SERVICES.filter(s => s.popular);

  const searchResults = query.trim()
    ? [
        ...SERVICES.filter(s =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          CATEGORY_CONFIG[s.category].label.toLowerCase().includes(query.toLowerCase())
        ).map(s => ({ type: 'service' as const, id: s.id, name: s.name, sub: CATEGORY_CONFIG[s.category].label, emoji: CATEGORY_CONFIG[s.category].emoji })),
        ...STYLISTS.filter(st =>
          st.name.toLowerCase().includes(query.toLowerCase()) ||
          st.specialty.toLowerCase().includes(query.toLowerCase())
        ).map(st => ({ type: 'stylist' as const, id: st.id, name: st.name, sub: st.specialty, emoji: '✂️' })),
      ]
    : [];

  // Recommendations: based on mock history (client has used s3 most)
  const recommendations = [
    { service: SERVICES.find(s => s.id === 's3')!, stylist: STYLISTS[0], reason: 'Tu favorito habitual' },
    { service: SERVICES.find(s => s.id === 's2')!, stylist: STYLISTS[1], reason: 'Con Miguel, tu estilista' },
    { service: SERVICES.find(s => s.id === 's6')!, stylist: STYLISTS[0], reason: 'Porque te gustó antes' },
  ].filter(r => r.service);

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9] overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-[#E8734A] pt-12 pb-8 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm font-medium">¡Buenos días! 👋</p>
              <h1 className="text-white font-black font-display text-2xl">{userName}</h1>
            </div>
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🔔</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A67850]">🔍</span>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar servicio o estilista..."
              className="w-full bg-white rounded-2xl pl-10 pr-4 py-3 text-sm text-[#6B4226] placeholder-[#C8A88A] font-medium outline-none shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C8A88A] hover:text-[#A67850]"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search results */}
      {query.trim() && (
        <div className="px-5 pt-4 pb-2">
          <p className="text-xs font-semibold text-[#C8A88A] mb-3 uppercase tracking-wide">
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{query}"
          </p>
          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-[#A67850] font-medium text-sm">Sin resultados. Intenta con otro término.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery('');
                    if (result.type === 'service') onViewService(result.id);
                    else onBook();
                  }}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-[0_2px_12px_rgba(107,66,38,0.08)] text-left hover:bg-[#FBF3E9] transition-colors"
                >
                  <div className="w-10 h-10 bg-[#FBF3E9] rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {result.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#6B4226] text-sm">{result.name}</div>
                    <div className="text-xs text-[#A67850]">{result.sub}</div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0" style={{
                    background: result.type === 'service' ? '#FBF3E9' : '#EAF2E3',
                    color: result.type === 'service' ? '#E8734A' : '#4A7C59',
                  }}>
                    {result.type === 'service' ? 'Servicio' : 'Estilista'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main content (hidden while searching) */}
      {!query.trim() && (
        <div className="px-5 py-5">
          {/* Quick book CTA */}
          <button
            onClick={() => onBook()}
            className="w-full bg-[#6B4226] rounded-[20px] p-4 flex items-center gap-3 hover:bg-[#8B5E3C] transition-colors mb-5 shadow-[0_4px_20px_rgba(107,66,38,0.2)] active:scale-[0.98]"
          >
            <div className="w-10 h-10 bg-[#E8734A] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">✂️</span>
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-bold">Reservar una cita</div>
              <div className="text-white/70 text-xs">3 pasos · menos de 1 minuto</div>
            </div>
            <span className="text-white/80 text-xl">→</span>
          </button>

          {/* Recommendations */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">✨</span>
            <h2 className="font-black text-[#6B4226] font-display text-lg">Recomendado para ti</h2>
          </div>
          <div className="flex flex-col gap-2 mb-6">
            {recommendations.map((rec, i) => rec.service && (
              <button
                key={i}
                onClick={() => onBook(rec.service.id)}
                className="flex items-center gap-3 p-3.5 bg-white rounded-[20px] shadow-[0_2px_12px_rgba(107,66,38,0.08)] text-left hover:shadow-[0_4px_20px_rgba(107,66,38,0.14)] active:scale-[0.98] transition-all"
              >
                <div className="w-12 h-12 bg-[#FBF3E9] rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                  {CATEGORY_CONFIG[rec.service.category].emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-[#6B4226] font-display text-sm">{rec.service.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MemphisStylistAvatar name={rec.stylist.name} color={rec.stylist.color} size={16} />
                    <span className="text-xs text-[#A67850]">{rec.stylist.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-[#EDD8BC]">·</span>
                    <span className="text-[10px] text-[#8B9D77] font-semibold bg-[#EAF2E3] px-1.5 py-0.5 rounded-full">
                      {rec.reason}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-black text-[#E8734A] text-sm">{formatPrice(rec.service.price)}</div>
                  <div className="text-[10px] text-[#C8A88A]">{formatDuration(rec.service.duration)}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Popular services */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-[#6B4226] font-display text-lg">Servicios populares</h2>
            <button className="text-sm font-semibold text-[#E8734A]">Ver todos →</button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-none mb-6">
            {popularServices.map(service => (
              <button
                key={service.id}
                onClick={() => onViewService(service.id)}
                className="flex-shrink-0 w-44 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(107,66,38,0.1)] p-4 text-left hover:shadow-[0_8px_28px_rgba(107,66,38,0.16)] transition-all active:scale-[0.97]"
              >
                <div className="w-12 h-12 bg-[#FBF3E9] rounded-2xl flex items-center justify-center text-2xl mb-3">
                  {CATEGORY_CONFIG[service.category].emoji}
                </div>
                <div className="font-black text-[#6B4226] font-display text-sm leading-tight mb-1">{service.name}</div>
                <div className="text-xs text-[#A67850] mb-2">{formatDuration(service.duration)}</div>
                <div className="font-black text-[#E8734A]">{formatPrice(service.price)}</div>
              </button>
            ))}
          </div>

          {/* Top stylists */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-[#6B4226] font-display text-lg">Nuestros estilistas</h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-none mb-6">
            {STYLISTS.map(stylist => (
              <div
                key={stylist.id}
                className="flex-shrink-0 w-36 bg-white rounded-[20px] shadow-[0_4px_20px_rgba(107,66,38,0.1)] p-4 text-center"
              >
                <div className="flex justify-center mb-2">
                  <MemphisStylistAvatar name={stylist.name} color={stylist.color} size={52} />
                </div>
                <div className="font-black text-[#6B4226] font-display text-xs leading-tight mb-0.5">
                  {stylist.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-[#A67850] mb-1.5">{stylist.specialty}</div>
                <div className="flex items-center justify-center gap-0.5">
                  <span className="text-[#F2A950] text-xs">★</span>
                  <span className="text-xs font-bold text-[#6B4226]">{stylist.rating}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Promo banner */}
          <div className="bg-[#6B4226] rounded-[20px] p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
            <div className="relative z-10">
              <div className="inline-block bg-[#E8734A] text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                ✨ Oferta especial
              </div>
              <h3 className="text-white font-black font-display text-lg leading-tight mb-1">
                Corte + Barba combo
              </h3>
              <p className="text-white/70 text-sm mb-3">Esta semana con 15% de descuento</p>
              <Button onClick={() => onBook('s3')} variant="secondary" size="sm">
                Reservar ahora
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SERVICE CATALOG ───────────────────────────────────────────────────────────

export function ServiceCatalog({ onViewService, onBook, onBack }: {
  onViewService: (id: string) => void;
  onBook: (serviceId: string) => void;
  onBack: () => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const categories = [
    { id: 'all', label: 'Todos', emoji: '🔍' },
    { id: 'cut', label: 'Corte', emoji: '✂️' },
    { id: 'beard', label: 'Barba', emoji: '🪒' },
    { id: 'color', label: 'Color', emoji: '🎨' },
    { id: 'treatment', label: 'Tratamiento', emoji: '💆' },
  ];

  const filtered = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter(s => s.category === activeCategory);

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9]">
      <div className="bg-white px-5 pt-10 pb-3 shadow-[0_2px_12px_rgba(107,66,38,0.06)]">
        <PageHeader title="Servicios" subtitle={`${SERVICES.length} servicios disponibles`} onBack={onBack} />

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 px-5 -mx-5 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
                ${activeCategory === cat.id
                  ? 'bg-[#E8734A] text-white shadow-[0_4px_12px_rgba(232,115,74,0.3)]'
                  : 'bg-[#F5E6D3] text-[#8B5E3C] hover:bg-[#EDD8BC]'
                }
              `}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-3">
          {filtered.map(service => (
            <Card key={service.id} onClick={() => onViewService(service.id)} padding={false}>
              <div className="p-4 flex items-start gap-4">
                <div className="w-14 h-14 bg-[#FBF3E9] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                  {CATEGORY_CONFIG[service.category].emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <span className="font-black font-display text-[#6B4226] text-base">{service.name}</span>
                    {service.popular && <PopularBadge />}
                  </div>
                  <p className="text-xs text-[#A67850] mt-1 leading-relaxed line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 text-xs font-semibold text-[#A67850]">
                      <span>⏱ {formatDuration(service.duration)}</span>
                      <CategoryBadge label={CATEGORY_CONFIG[service.category].label} icon={CATEGORY_CONFIG[service.category].emoji} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#E8734A]">{formatPrice(service.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4">
                <Button onClick={() => onBook(service.id)} variant="primary" size="sm" fullWidth>
                  Reservar ahora
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SERVICE DETAIL ────────────────────────────────────────────────────────────

export function ServiceDetail({ serviceId, onBook, onBack }: {
  serviceId: string;
  onBook: (id: string) => void;
  onBack: () => void;
}) {
  const service = getService(serviceId);
  const stylists = getStylistsForService(serviceId);

  if (!service) return null;
  const cfg = CATEGORY_CONFIG[service.category];

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9]">
      {/* Hero */}
      <div className="bg-white relative overflow-hidden">
        <div className="bg-[#E8734A] h-40 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#C85A31] opacity-20 rounded-b-[40px]" />
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl">
            {cfg.emoji}
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="absolute top-3 left-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-[#6B4226]"
          >
            ←
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-28">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h1 className="text-2xl font-black text-[#6B4226] font-display">{service.name}</h1>
            <CategoryBadge label={cfg.label} icon={cfg.emoji} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-[#E8734A]">{formatPrice(service.price)}</div>
            <div className="text-xs text-[#A67850]">por sesión</div>
          </div>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white rounded-2xl p-3 flex items-center gap-2 shadow-[0_2px_12px_rgba(107,66,38,0.08)]">
            <div className="w-9 h-9 bg-[#FBF3E9] rounded-xl flex items-center justify-center">⏱</div>
            <div>
              <div className="text-[10px] text-[#C8A88A] font-semibold">DURACIÓN</div>
              <div className="font-bold text-[#6B4226] text-sm">{formatDuration(service.duration)}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-3 flex items-center gap-2 shadow-[0_2px_12px_rgba(107,66,38,0.08)]">
            <div className="w-9 h-9 bg-[#FBF3E9] rounded-xl flex items-center justify-center">💰</div>
            <div>
              <div className="text-[10px] text-[#C8A88A] font-semibold">PRECIO</div>
              <div className="font-bold text-[#6B4226] text-sm">{formatPrice(service.price)}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-5">
          <h3 className="font-black text-[#6B4226] font-display mb-2">Descripción</h3>
          <p className="text-sm text-[#A67850] leading-relaxed">{service.description}</p>
        </Card>

        {/* What's included */}
        <Card className="mb-5">
          <h3 className="font-black text-[#6B4226] font-display mb-3">¿Qué incluye?</h3>
          {[
            'Consulta personalizada con el estilista',
            'Productos premium de alta calidad',
            'Asesoramiento de imagen gratuito',
            'Garantía de satisfacción',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-[#EAF2E3] flex items-center justify-center flex-shrink-0">
                <span className="text-[#4A7C59] text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-[#6B4226] font-medium">{item}</span>
            </div>
          ))}
        </Card>

        {/* Stylists for this service */}
        {stylists.length > 0 && (
          <div className="mb-5">
            <h3 className="font-black text-[#6B4226] font-display mb-3">Especialistas</h3>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5 scrollbar-none">
              {stylists.map(stylist => (
                <div key={stylist.id} className="flex-shrink-0 bg-white rounded-[16px] p-3 flex items-center gap-3 shadow-[0_2px_12px_rgba(107,66,38,0.08)] min-w-40">
                  <MemphisStylistAvatar name={stylist.name} color={stylist.color} size={40} />
                  <div>
                    <div className="font-bold text-[#6B4226] text-sm">{stylist.name.split(' ')[0]}</div>
                    <div className="flex items-center gap-0.5 text-xs">
                      <span className="text-[#F2A950]">★</span>
                      <span className="font-bold text-[#6B4226]">{stylist.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#F5E6D3] p-5 pb-safe">
        <Button onClick={() => onBook(serviceId)} variant="primary" size="lg" fullWidth>
          Reservar {service.name} — {formatPrice(service.price)}
        </Button>
      </div>
    </div>
  );
}

// ─── ADMIN SERVICE MANAGEMENT ──────────────────────────────────────────────────

export function AdminServices({ onBack }: { onBack: () => void }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDuration, setNewDuration] = useState('');

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9] overflow-y-auto">
      <div className="bg-white px-6 pt-8 pb-4 shadow-[0_2px_12px_rgba(107,66,38,0.06)]">
        <PageHeader
          title="Gestión de Servicios"
          subtitle={`${SERVICES.length} servicios activos`}
          action={
            <Button onClick={() => setShowAddForm(!showAddForm)} variant="primary" size="sm">
              + Agregar
            </Button>
          }
        />
      </div>

      <div className="flex-1 px-6 py-5">
        {/* Add form */}
        {showAddForm && (
          <Card className="mb-5 border-2 border-[#E8734A]">
            <h4 className="font-black text-[#6B4226] font-display mb-4">Nuevo servicio</h4>
            <div className="flex flex-col gap-3">
              <Input label="Nombre del servicio" value={newName} onChange={setNewName} placeholder="ej. Mechas balayage" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Precio ($)" type="number" value={newPrice} onChange={setNewPrice} placeholder="0" />
                <Input label="Duración (min)" type="number" value={newDuration} onChange={setNewDuration} placeholder="30" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowAddForm(false)} variant="primary" size="sm" fullWidth>
                  Guardar servicio
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="ghost" size="sm">
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Services list */}
        <div className="flex flex-col gap-3">
          {SERVICES.map(service => (
            <Card key={service.id} padding={false}>
              <div className="p-4 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FBF3E9] rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                  {CATEGORY_CONFIG[service.category].emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black font-display text-[#6B4226]">{service.name}</span>
                    {service.popular && <PopularBadge />}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[#A67850] font-medium">
                    <span>⏱ {formatDuration(service.duration)}</span>
                    <span>💰 {formatPrice(service.price)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="w-8 h-8 rounded-xl bg-[#FBF3E9] hover:bg-[#F5E6D3] flex items-center justify-center text-[#A67850] text-sm transition-colors">
                    ✏️
                  </button>
                  <button className="w-8 h-8 rounded-xl bg-[#FFF5F5] hover:bg-[#FFE8E8] flex items-center justify-center text-[#C45C4C] text-sm transition-colors">
                    🗑
                  </button>
                </div>
              </div>

              {/* Assigned stylists */}
              <div className="px-4 pb-4 border-t border-[#F5E6D3] pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#C8A88A]">Estilistas:</span>
                  <div className="flex gap-1">
                    {getStylistsForService(service.id).map(st => (
                      <div
                        key={st.id}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-white"
                        style={{ background: st.color }}
                        title={st.name}
                      >
                        {st.initials}
                      </div>
                    ))}
                    <button className="w-7 h-7 rounded-full bg-[#F5E6D3] border-2 border-dashed border-[#EDD8BC] flex items-center justify-center text-[#A67850] text-xs hover:bg-[#EDD8BC] transition-colors">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
