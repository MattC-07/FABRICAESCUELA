import { useState } from 'react';
import type { UserRole, BookingState } from './data';
import { BottomNav, SideNav } from './ui';

// Onboarding
import { SplashScreen, LoginScreen, RegisterScreen, RoleSelectScreen, ForgotPasswordScreen } from './screens/Onboarding';

// Booking
import { BookStep1, BookStep2, BookStep3, BookStep4, BookSuccess } from './screens/Booking';

// Services
import { ClientHome, ServiceCatalog, ServiceDetail, AdminServices } from './screens/Services';

// Appointments
import { MyAppointments, AppointmentDetail, CancelAppointment } from './screens/Appointments';

// Admin
import { AdminDashboard, AdminTeam, AdminReports } from './screens/Admin';

// Stylist
import { StylistSchedule, StylistClients, StylistPerformance } from './screens/Stylist';

type Screen =
  | 'splash' | 'login' | 'register' | 'role-select' | 'forgot-password'
  | 'client-home' | 'service-catalog' | 'service-detail'
  | 'book-1' | 'book-2' | 'book-3' | 'book-4' | 'book-success'
  | 'my-appointments' | 'appointment-detail' | 'cancel-appointment'
  | 'admin-dashboard' | 'admin-services' | 'admin-team' | 'admin-reports'
  | 'stylist-schedule' | 'stylist-clients' | 'stylist-reports'
  | 'profile';

type ClientTab = 'home' | 'book' | 'appointments' | 'profile';
type AdminTab = 'dashboard' | 'services' | 'team' | 'schedule' | 'clients' | 'reports';

const INITIAL_BOOKING: BookingState = {
  serviceId: null,
  stylistId: null,
  date: null,
  time: null,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [role, setRole] = useState<UserRole>('client');
  const [booking, setBooking] = useState<BookingState>(INITIAL_BOOKING);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [clientTab, setClientTab] = useState<ClientTab>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  const nav = (s: Screen) => setScreen(s);

  const handleLogin = (r: UserRole) => {
    setRole(r);
    if (r === 'admin') nav('admin-dashboard');
    else if (r === 'stylist') nav('stylist-schedule');
    else nav('client-home');
  };

  const startBooking = (serviceId?: string) => {
    if (serviceId) {
      setBooking({ ...INITIAL_BOOKING, serviceId });
      nav('book-2');
    } else {
      setBooking(INITIAL_BOOKING);
      nav('book-1');
    }
    setClientTab('book');
  };

  const handleClientTab = (tab: ClientTab) => {
    setClientTab(tab);
    if (tab === 'home') nav('client-home');
    else if (tab === 'book') { setBooking(INITIAL_BOOKING); nav('book-1'); }
    else if (tab === 'appointments') nav('my-appointments');
    else if (tab === 'profile') nav('profile');
  };

  const handleAdminTab = (tab: AdminTab) => {
    setAdminTab(tab);
    if (tab === 'dashboard') nav('admin-dashboard');
    else if (tab === 'services') nav('admin-services');
    else if (tab === 'team') nav('admin-team');
    else if (tab === 'schedule') nav('stylist-schedule');
    else if (tab === 'clients') nav('stylist-clients');
    else if (tab === 'reports') nav('admin-reports');
  };

  const handleStylistTab = (tab: AdminTab) => {
    if (tab === 'schedule') nav('stylist-schedule');
    else if (tab === 'clients') nav('stylist-clients');
    else if (tab === 'reports') nav('stylist-reports');
  };

  // ── Determine layout ──────────────────────────────────────────────────────
  const isAdminOrStylist = role !== 'client' && !['splash', 'login', 'register', 'role-select', 'forgot-password'].includes(screen);
  const isClientWithNav = role === 'client' && !['splash', 'login', 'register', 'book-success', 'forgot-password'].includes(screen) &&
    !screen.startsWith('book-');
  const inBookingFlow = screen.startsWith('book-');

  // ── Render screen ─────────────────────────────────────────────────────────
  const renderScreen = () => {
    switch (screen) {
      // ── Onboarding ────────────────────────────────────────────────────────
      case 'splash':
        return <SplashScreen onLogin={() => nav('login')} onRegister={() => nav('register')} />;

      case 'login':
        return <LoginScreen onLogin={handleLogin} onRegister={() => nav('register')} onBack={() => nav('splash')} onForgotPassword={() => nav('forgot-password')} />;

      case 'forgot-password':
        return <ForgotPasswordScreen onBack={() => nav('login')} />;

      case 'register':
        return (
          <RegisterScreen
            onRegister={() => { setRole('client'); nav('client-home'); }}
            onLogin={() => nav('login')}
            onBack={() => nav('splash')}
          />
        );

      case 'role-select':
        return <RoleSelectScreen onSelect={r => { setRole(r); handleLogin(r); }} />;

      // ── Client: Home / Catalog / Detail ────────────────────────────────────
      case 'client-home':
        return (
          <ClientHome
            onBook={id => startBooking(id)}
            onViewService={id => { setSelectedServiceId(id); nav('service-detail'); }}
          />
        );

      case 'service-catalog':
        return (
          <ServiceCatalog
            onViewService={id => { setSelectedServiceId(id); nav('service-detail'); }}
            onBook={id => startBooking(id)}
            onBack={() => nav('client-home')}
          />
        );

      case 'service-detail':
        return selectedServiceId ? (
          <ServiceDetail
            serviceId={selectedServiceId}
            onBook={id => startBooking(id)}
            onBack={() => nav('service-catalog')}
          />
        ) : null;

      // ── Booking Flow ────────────────────────────────────────────────────────
      case 'book-1':
        return (
          <BookStep1
            onNext={id => { setBooking(b => ({ ...b, serviceId: id })); nav('book-2'); }}
            onBack={() => nav('client-home')}
          />
        );

      case 'book-2':
        return booking.serviceId ? (
          <BookStep2
            serviceId={booking.serviceId}
            onNext={id => { setBooking(b => ({ ...b, stylistId: id })); nav('book-3'); }}
            onBack={() => nav('book-1')}
          />
        ) : null;

      case 'book-3':
        return (booking.serviceId && booking.stylistId) ? (
          <BookStep3
            serviceId={booking.serviceId}
            stylistId={booking.stylistId}
            onNext={(date, time) => { setBooking(b => ({ ...b, date, time })); nav('book-4'); }}
            onBack={() => nav('book-2')}
          />
        ) : null;

      case 'book-4':
        return (booking.serviceId && booking.stylistId && booking.date && booking.time) ? (
          <BookStep4
            booking={booking}
            onConfirm={() => nav('book-success')}
            onBack={() => nav('book-3')}
          />
        ) : null;

      case 'book-success':
        return (booking.serviceId && booking.date && booking.time) ? (
          <BookSuccess
            booking={booking}
            onGoToAppointments={() => { nav('my-appointments'); setClientTab('appointments'); }}
            onGoHome={() => { nav('client-home'); setClientTab('home'); }}
          />
        ) : null;

      // ── My Appointments ─────────────────────────────────────────────────────
      case 'my-appointments':
        return (
          <MyAppointments
            onBook={() => startBooking()}
            onViewDetail={id => { setSelectedAppointmentId(id); nav('appointment-detail'); }}
          />
        );

      case 'appointment-detail':
        return selectedAppointmentId ? (
          <AppointmentDetail
            appointmentId={selectedAppointmentId}
            onReschedule={() => startBooking()}
            onCancel={() => nav('cancel-appointment')}
            onRebook={id => startBooking(id)}
            onBack={() => nav('my-appointments')}
          />
        ) : null;

      case 'cancel-appointment':
        return selectedAppointmentId ? (
          <CancelAppointment
            appointmentId={selectedAppointmentId}
            onConfirm={() => nav('my-appointments')}
            onBack={() => nav('appointment-detail')}
          />
        ) : null;

      // ── Admin ───────────────────────────────────────────────────────────────
      case 'admin-dashboard':
        return <AdminDashboard />;

      case 'admin-services':
        return <AdminServices onBack={() => nav('admin-dashboard')} />;

      case 'admin-team':
        return <AdminTeam onBack={() => nav('admin-dashboard')} />;

      case 'admin-reports':
        return <AdminReports />;

      // ── Stylist ─────────────────────────────────────────────────────────────
      case 'stylist-schedule':
        return <StylistSchedule />;

      case 'stylist-clients':
        return <StylistClients />;

      case 'stylist-reports':
        return <StylistPerformance />;

      // ── Profile ─────────────────────────────────────────────────────────────
      case 'profile':
        return <ProfileScreen role={role} onChangeRole={() => nav('role-select')} onLogout={() => nav('splash')} />;

      default:
        return <SplashScreen onLogin={() => nav('login')} onRegister={() => nav('register')} />;
    }
  };

  // ── Layout wrappers ────────────────────────────────────────────────────────

  // Admin / Stylist: side-nav layout
  if (isAdminOrStylist) {
    const activeAdminTab = ((): AdminTab => {
      if (screen === 'admin-services') return 'services';
      if (screen === 'admin-team') return 'team';
      if (screen === 'admin-reports' || screen === 'stylist-reports') return 'reports';
      if (screen === 'stylist-schedule') return 'schedule';
      if (screen === 'stylist-clients') return 'clients';
      return 'dashboard';
    })();

    return (
      <div className="flex h-full bg-[#FBF3E9]">
        <SideNav
          active={activeAdminTab}
          role={role as 'admin' | 'stylist'}
          onNavigate={role === 'admin' ? handleAdminTab : handleStylistTab}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderScreen()}
        </div>
      </div>
    );
  }

  // Client with bottom nav
  if (isClientWithNav) {
    return (
      <div className="flex flex-col h-full bg-[#FBF3E9]">
        <div className="flex-1 overflow-hidden">
          {renderScreen()}
        </div>
        <BottomNav active={clientTab} onNavigate={handleClientTab} />
      </div>
    );
  }

  // Full-screen (onboarding, booking flow, success)
  return (
    <div className="h-full bg-[#FBF3E9] overflow-hidden">
      {renderScreen()}
    </div>
  );
}

// ─── PROFILE SCREEN ────────────────────────────────────────────────────────────

const MOCK_POINTS = 1240;
const MOCK_TOTAL_VISITS = 5; // change to 22 to see VIP state
const IS_VIP = MOCK_TOTAL_VISITS >= 20;

const REWARDS = [
  { id: 1, title: 'Descuento 10%', subtitle: 'En tu próximo servicio', points: 500, icon: '🏷️', available: true },
  { id: 2, title: 'Corte gratis', subtitle: 'Corte Clásico de regalo', points: 2000, icon: '✂️', available: false },
  { id: 3, title: 'Afeitado gratis', subtitle: 'Afeitado con navaja', points: 1500, icon: '🪒', available: true },
  { id: 4, title: 'Combo con 20%', subtitle: 'Corte + Barba con descuento', points: 1000, icon: '🎁', available: true },
];

function ProfileScreen({ role, onChangeRole, onLogout }: {
  role: UserRole;
  onChangeRole: () => void;
  onLogout: () => void;
}) {
  const [showReferral, setShowReferral] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);
  const [activeReward, setActiveReward] = useState<number | null>(null);
  const [rewardRedeemed, setRewardRedeemed] = useState<number | null>(null);

  const handleCopyCode = () => {
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
  };

  const referralCode = 'JUAN-BB2026';

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9] overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-[#E8734A] pt-12 pb-8 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="flex flex-col items-center relative z-10">
          <div className="relative mb-3">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl border-4 border-white/30">
              👤
            </div>
            {IS_VIP && (
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#F2A950] rounded-full flex items-center justify-center shadow-lg border-2 border-white" title="Cliente VIP">
                <span className="text-sm">👑</span>
              </div>
            )}
          </div>
          <h2 className="text-white font-black font-display text-xl">Juan García</h2>
          <p className="text-white/80 text-sm">juan@correo.com</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold capitalize">
              {role === 'client' ? 'Cliente' : role === 'stylist' ? 'Estilista' : 'Administrador'}
            </span>
            {IS_VIP && (
              <span className="bg-[#F2A950] text-white text-xs px-3 py-1 rounded-full font-black flex items-center gap-1">
                👑 Cliente VIP
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-5">
        {/* Client stats */}
        {role === 'client' && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Citas totales', value: MOCK_TOTAL_VISITS, color: '#E8734A' },
              { label: 'Este año', value: '3', color: '#F2A950' },
              { label: 'Completadas', value: '2', color: '#8B9D77' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-[0_2px_12px_rgba(107,66,38,0.08)]">
                <div className="font-black text-xl font-display" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[10px] text-[#C8A88A] font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* VIP progress (client only, not yet VIP) */}
        {role === 'client' && !IS_VIP && (
          <div className="bg-white rounded-[20px] p-4 mb-5 shadow-[0_4px_20px_rgba(107,66,38,0.1)]">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">👑</span>
              <div className="flex-1">
                <div className="font-black text-[#6B4226] font-display text-sm">Camino al Cliente VIP</div>
                <div className="text-xs text-[#A67850]">{20 - MOCK_TOTAL_VISITS} citas más para desbloquear</div>
              </div>
              <span className="text-xs font-bold text-[#F2A950]">{MOCK_TOTAL_VISITS}/20</span>
            </div>
            <div className="h-2.5 bg-[#F5E6D3] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#F2A950] to-[#E8734A] transition-all"
                style={{ width: `${(MOCK_TOTAL_VISITS / 20) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Rewards section (client only) */}
        {role === 'client' && (
          <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(107,66,38,0.1)] overflow-hidden mb-5">
            {/* Points header */}
            <div className="bg-gradient-to-r from-[#6B4226] to-[#8B5E3C] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 text-xs font-semibold">TUS PUNTOS</div>
                  <div className="text-white font-black font-display text-2xl">{MOCK_POINTS.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl">🎁</div>
                  <div className="text-white/60 text-[10px] mt-1">+10 pts/visita</div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-white/70">
                <span>💡</span>
                <span>Gana puntos por cada servicio y al referir amigos</span>
              </div>
            </div>

            {/* Reward cards */}
            <div className="p-4">
              <h4 className="font-black text-[#6B4226] font-display text-sm mb-3">Canjear recompensas</h4>
              <div className="flex flex-col gap-2">
                {REWARDS.map(reward => {
                  const canRedeem = MOCK_POINTS >= reward.points;
                  const isRedeemed = rewardRedeemed === reward.id;
                  return (
                    <div key={reward.id} className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${canRedeem && !isRedeemed ? 'bg-[#FBF3E9] hover:bg-[#F5E6D3] cursor-pointer' : 'bg-[#F5E6D3] opacity-60'}`}
                      onClick={() => canRedeem && !isRedeemed && setActiveReward(reward.id)}
                    >
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                        {reward.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#6B4226] text-sm">{reward.title}</div>
                        <div className="text-xs text-[#A67850]">{reward.subtitle}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {isRedeemed ? (
                          <span className="text-xs font-bold text-[#4A7C59] bg-[#EAF2E3] px-2 py-1 rounded-full">✓ Canjeado</span>
                        ) : (
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${canRedeem ? 'text-[#E8734A] bg-[#FBF3E9]' : 'text-[#C8A88A] bg-[#F5E6D3]'}`}>
                            {reward.points.toLocaleString()} pts
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Referral section (client only) */}
        {role === 'client' && (
          <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(107,66,38,0.1)] overflow-hidden mb-5">
            <button
              onClick={() => setShowReferral(!showReferral)}
              className="flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-[#FBF3E9] transition-colors"
            >
              <span className="w-8 h-8 rounded-xl bg-[#FEF5E4] flex items-center justify-center text-base flex-shrink-0">🎁</span>
              <div className="flex-1">
                <span className="font-semibold text-[#6B4226] text-sm block">Referir a un amigo</span>
                <span className="text-xs text-[#A67850]">Gana 200 puntos por cada amigo</span>
              </div>
              <span className="text-[#C8A88A] text-lg">{showReferral ? '∧' : '›'}</span>
            </button>
            {showReferral && (
              <div className="px-4 pb-4">
                <p className="text-xs text-[#A67850] mb-3">Comparte tu código. Cuando tu amigo reserve su primera cita, ¡ambos ganan 200 puntos!</p>
                <div className="flex items-center gap-2 bg-[#FBF3E9] rounded-2xl p-3 mb-3">
                  <span className="flex-1 text-center font-black text-[#E8734A] text-lg tracking-widest">{referralCode}</span>
                  <button
                    onClick={handleCopyCode}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${referralCopied ? 'bg-[#EAF2E3] text-[#4A7C59]' : 'bg-[#E8734A] text-white'}`}
                  >
                    {referralCopied ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 rounded-2xl bg-[#E8734A] text-white text-xs font-bold hover:bg-[#C85A31] transition-colors">
                    📤 Compartir código
                  </button>
                  <button className="flex-1 py-2.5 rounded-2xl bg-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-opacity">
                    💬 WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Menu items */}
        <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(107,66,38,0.1)] overflow-hidden mb-4">
          {[
            { icon: '✏️', label: 'Editar perfil' },
            { icon: '🔔', label: 'Notificaciones' },
            { icon: '🔒', label: 'Cambiar contraseña' },
            { icon: '📍', label: 'Dirección favorita' },
            { icon: '💳', label: 'Métodos de pago' },
          ].map((item, i) => (
            <button
              key={i}
              className="flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-[#FBF3E9] transition-colors border-b border-[#F5E6D3] last:border-0"
            >
              <span className="w-8 h-8 rounded-xl bg-[#FBF3E9] flex items-center justify-center text-base flex-shrink-0">{item.icon}</span>
              <span className="font-semibold text-[#6B4226] text-sm flex-1">{item.label}</span>
              <span className="text-[#C8A88A] text-lg">›</span>
            </button>
          ))}
        </div>

        {/* Admin shortcut */}
        <div className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(107,66,38,0.1)] overflow-hidden mb-4">
          <button
            onClick={onChangeRole}
            className="flex items-center gap-3 w-full px-4 py-3.5 text-left hover:bg-[#FBF3E9] transition-colors"
          >
            <span className="w-8 h-8 rounded-xl bg-[#FBF3E9] flex items-center justify-center">🔐</span>
            <span className="font-semibold text-[#6B4226] text-sm flex-1">Cambiar rol (demo)</span>
            <span className="text-[#C8A88A] text-lg">›</span>
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[20px] bg-[#FFF5F5] border-2 border-[#F0C0BE] text-[#C45C4C] font-bold text-sm hover:bg-[#FFE8E8] transition-colors"
        >
          🚪 Cerrar sesión
        </button>
      </div>

      {/* Reward redeem confirmation modal */}
      {activeReward !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-2xl">
            {(() => {
              const reward = REWARDS.find(r => r.id === activeReward);
              if (!reward) return null;
              return (
                <>
                  <div className="text-center mb-5">
                    <div className="text-4xl mb-2">{reward.icon}</div>
                    <h3 className="font-black text-[#6B4226] font-display text-xl">{reward.title}</h3>
                    <p className="text-[#A67850] text-sm mt-1">{reward.subtitle}</p>
                    <div className="mt-3 inline-flex items-center gap-1 bg-[#FBF3E9] px-3 py-1.5 rounded-full">
                      <span className="text-sm font-black text-[#E8734A]">{reward.points.toLocaleString()} pts</span>
                      <span className="text-xs text-[#A67850]">de {MOCK_POINTS.toLocaleString()} disponibles</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { setRewardRedeemed(reward.id); setActiveReward(null); }}
                      className="w-full py-3.5 bg-[#E8734A] text-white font-black rounded-[14px] hover:bg-[#C85A31] transition-colors shadow-[0_4px_16px_rgba(232,115,74,0.4)]"
                    >
                      ✅ Confirmar canje
                    </button>
                    <button
                      onClick={() => setActiveReward(null)}
                      className="w-full py-3 text-[#A67850] font-semibold text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
