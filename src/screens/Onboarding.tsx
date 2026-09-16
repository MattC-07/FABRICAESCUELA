import { useState, useEffect } from 'react';
import { SplashIllustration } from '../illustrations';
import { Button, Input, Card } from '../ui';
import type { UserRole } from '../data';

// Mock registered accounts — in production these would live in the backend
const REGISTERED_ACCOUNTS = [
  { email: 'admin@barberia.com',      password: 'demo1234', role: 'admin'   as UserRole },
  { email: 'estilista@barberia.com',  password: 'demo1234', role: 'stylist' as UserRole },
  { email: 'cliente@demo.com',        password: 'demo1234', role: 'client'  as UserRole },
];
const REGISTERED_EMAILS = REGISTERED_ACCOUNTS.map(a => a.email);

function hasSpecialChar(s: string) {
  return /[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|`~]/.test(s);
}
function hasNumber(s: string) { return /\d/.test(s); }
function hasLetter(s: string) { return /[a-zA-Z]/.test(s); }

// ─── SPLASH ────────────────────────────────────────────────────────────────────

export function SplashScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#FBF3E9] relative overflow-hidden">
      {/* Top decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#F5E6D3] rounded-full -translate-y-1/3 translate-x-1/3" />
      <div className="absolute top-10 left-0 w-28 h-28 bg-[#EDD8BC] rounded-full -translate-x-1/2 opacity-50" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-center pt-12 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-[#E8734A] rounded-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(232,115,74,0.4)]">
            <span className="text-white font-black text-xl">✂</span>
          </div>
          <span className="text-2xl font-black text-[#6B4226] font-display">BarberBook</span>
        </div>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center px-8 py-4">
        <div className="w-full max-w-sm">
          <SplashIllustration />
        </div>
      </div>

      {/* Hero text */}
      <div className="relative z-10 px-8 pb-2">
        <h1 className="text-3xl font-black text-[#6B4226] font-display leading-tight text-center">
          Tu barbería favorita,{' '}
          <span className="text-[#E8734A]">a un toque</span>
        </h1>
        <p className="text-center text-[#A67850] mt-3 leading-relaxed font-medium text-sm">
          Reserva tu cita en segundos. Sin llamadas, sin esperas. Elige tu estilista, elige tu hora.
        </p>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 py-4">
        <span className="w-6 h-2 bg-[#E8734A] rounded-full" />
        <span className="w-2 h-2 bg-[#EDD8BC] rounded-full" />
        <span className="w-2 h-2 bg-[#EDD8BC] rounded-full" />
      </div>

      {/* Bottom wave decoration — behind the CTAs */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#F5E6D3] opacity-30 rounded-t-[60px] z-0" />

      {/* CTAs — above the wave */}
      <div className="relative z-10 px-6 pb-10 flex flex-col gap-3">
        <Button onClick={onRegister} variant="primary" size="lg" fullWidth>
          Crear cuenta gratis
        </Button>
        <Button onClick={onLogin} variant="secondary" size="lg" fullWidth>
          Ya tengo una cuenta
        </Button>
      </div>
    </div>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────────

export function LoginScreen({ onLogin, onRegister, onBack, onForgotPassword }: {
  onLogin: (role: UserRole) => void;
  onRegister: () => void;
  onBack: () => void;
  onForgotPassword?: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockSecondsLeft, setBlockSecondsLeft] = useState(0);

  // Countdown timer while blocked
  useEffect(() => {
    if (!isBlocked) return;
    const interval = setInterval(() => {
      setBlockSecondsLeft(s => {
        if (s <= 1) { setIsBlocked(false); setFailedAttempts(0); setError(''); clearInterval(interval); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isBlocked]);

  const handleLogin = () => {
    if (isBlocked) return;
    if (!email || !password) { setError('Por favor completa todos los campos.'); return; }
    if (password.length < 8) { setError('La contraseña debe tener mínimo 8 caracteres.'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const account = REGISTERED_ACCOUNTS.find(a => a.email === email && a.password === password);
      if (account) {
        setError('');
        setFailedAttempts(0);
        onLogin(account.role);
      } else {
        const next = failedAttempts + 1;
        setFailedAttempts(next);
        if (next >= 5) {
          setIsBlocked(true);
          setBlockSecondsLeft(600);
          setError('Demasiados intentos fallidos. Cuenta temporalmente bloqueada por seguridad.');
        } else {
          setError(`Correo o contraseña incorrectos. Intento ${next} de 5.`);
        }
      }
    }, 900);
  };

  const handleGoogle = () => {
    setGoogleLoading(true);
    setTimeout(() => { setGoogleLoading(false); onLogin('client'); }, 1400);
  };

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9] overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5E6D3] rounded-full -translate-y-1/4 translate-x-1/4 opacity-70" />

      {/* Back + header */}
      <div className="relative z-10 flex items-center gap-4 p-5 pt-10">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-[0_2px_12px_rgba(107,66,38,0.1)] flex items-center justify-center text-[#6B4226] hover:bg-[#F5E6D3] transition-colors"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#E8734A] rounded-xl flex items-center justify-center">
            <span className="text-white font-black">✂</span>
          </div>
          <span className="font-black text-[#6B4226] font-display text-lg">BarberBook</span>
        </div>
      </div>

      {/* Top scissors decoration */}
      <div className="relative z-10 flex justify-center py-4">
        <div className="w-20 h-20 bg-white rounded-[20px] shadow-[0_4px_24px_rgba(107,66,38,0.1)] flex items-center justify-center">
          <span className="text-4xl">✂️</span>
        </div>
      </div>

      {/* Form */}
      <div className="relative z-10 flex-1 px-6 pb-10">
        <h2 className="text-2xl font-black text-[#6B4226] font-display text-center mb-1">Bienvenido de vuelta</h2>
        <p className="text-center text-[#A67850] text-sm mb-8">Inicia sesión para gestionar tus citas</p>

        <Card className="mb-6">
          <div className="flex flex-col gap-4">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="tu@correo.com"
              icon={<span className="text-base">✉️</span>}
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              icon={<span className="text-base">🔒</span>}
            />
            {error && (
              <div className="bg-[#F8D7DA] border border-[#F0C0BE] rounded-xl p-3">
                <p className="text-[#C45C4C] text-sm font-medium">⚠️ {error}</p>
                {isBlocked && blockSecondsLeft > 0 && (
                  <p className="text-[#C45C4C] text-xs mt-1">
                    Podrás intentarlo en {Math.floor(blockSecondsLeft / 60)}:{String(blockSecondsLeft % 60).padStart(2, '0')} min.
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Demo hint */}
        <div className="bg-[#F5E6D3] rounded-2xl p-4 mb-6 border border-[#EDD8BC]">
          <p className="text-xs text-[#8B5E3C] font-semibold mb-1.5">💡 Accesos demo:</p>
          <div className="flex flex-col gap-1">
            {[
              { role: 'Cliente', email: 'cliente@demo.com' },
              { role: 'Estilista', email: 'estilista@barberia.com' },
              { role: 'Admin', email: 'admin@barberia.com' },
            ].map(item => (
              <button
                key={item.role}
                onClick={() => { setEmail(item.email); setPassword('demo1234'); }}
                className="text-left text-xs text-[#E8734A] font-semibold hover:underline"
              >
                {item.role}: {item.email}
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleLogin} variant="primary" size="lg" fullWidth disabled={loading || isBlocked}>
          {loading ? '⏳ Ingresando...' : isBlocked ? '🔒 Bloqueado temporalmente' : 'Iniciar sesión'}
        </Button>

        <button
          onClick={onForgotPassword}
          className="w-full text-center mt-4 text-[#A67850] text-sm font-medium hover:text-[#E8734A] transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#EDD8BC]" />
          <span className="text-xs text-[#C8A88A] font-medium">o continúa con</span>
          <div className="flex-1 h-px bg-[#EDD8BC]" />
        </div>

        {/* Google login */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-[14px] bg-white border-2 border-[#EDD8BC] hover:border-[#D4B896] hover:bg-[#FBF3E9] active:scale-[0.97] transition-all font-semibold text-[#6B4226] text-sm shadow-[0_2px_8px_rgba(107,66,38,0.06)] mb-4"
        >
          {googleLoading ? (
            <span className="text-base">⏳</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {googleLoading ? 'Conectando con Google...' : 'Continuar con Google'}
        </button>

        <Button onClick={onRegister} variant="ghost" fullWidth>
          ¿Sin cuenta? <span className="text-[#E8734A] font-bold">Regístrate gratis</span>
        </Button>
      </div>
    </div>
  );
}

// ─── REGISTER ──────────────────────────────────────────────────────────────────

export function RegisterScreen({ onRegister, onLogin, onBack }: {
  onRegister: () => void;
  onLogin: () => void;
  onBack: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'El nombre es obligatorio';
    if (!email.includes('@')) {
      e.email = 'Correo electrónico inválido';
    } else if (REGISTERED_EMAILS.includes(email.toLowerCase())) {
      e.email = 'Este correo ya se encuentra registrado. Intenta iniciar sesión.';
    }
    if (phone.length < 9) e.phone = 'Ingresa un número válido (mínimo 9 dígitos)';
    if (password.length < 8) {
      e.password = 'Mínimo 8 caracteres';
    } else if (!hasLetter(password) || !hasNumber(password)) {
      e.password = 'Debe contener letras y números';
    } else if (!hasSpecialChar(password)) {
      e.password = 'Debe incluir al menos un símbolo (ej. @, #, !)';
    }
    return e;
  };

  const handleRegister = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowToast(true);
      setTimeout(() => { setShowToast(false); onRegister(); }, 2000);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9] overflow-y-auto">
      <div className="absolute top-0 left-0 w-48 h-48 bg-[#F5E6D3] rounded-full -translate-y-1/3 -translate-x-1/4 opacity-60" />

      <div className="relative z-10 flex items-center gap-4 p-5 pt-10">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-[0_2px_12px_rgba(107,66,38,0.1)] flex items-center justify-center text-[#6B4226] hover:bg-[#F5E6D3] transition-colors"
        >
          ←
        </button>
        <h2 className="text-xl font-black text-[#6B4226] font-display">Crear cuenta</h2>
      </div>

      {/* Progress indicator */}
      <div className="relative z-10 px-6 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-1.5 bg-[#E8734A] rounded-full" />
          <div className="flex-1 h-1.5 bg-[#E8734A] rounded-full" />
          <div className="flex-1 h-1.5 bg-[#EDD8BC] rounded-full" />
        </div>
        <p className="text-xs text-[#A67850] font-medium">Paso 1 de 2 — Información personal</p>
      </div>

      <div className="relative z-10 flex-1 px-6 pb-10">
        <div className="flex items-center gap-3 my-5">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-[0_4px_20px_rgba(107,66,38,0.1)] flex items-center justify-center text-3xl">
            👤
          </div>
          <div>
            <h3 className="font-black text-[#6B4226] font-display text-lg leading-tight">¡Hola, nuevo cliente!</h3>
            <p className="text-sm text-[#A67850]">Completa tus datos para empezar</p>
          </div>
        </div>

        <Card className="mb-4">
          <div className="flex flex-col gap-4">
            <Input
              label="Nombre completo"
              value={name}
              onChange={setName}
              placeholder="Juan García"
              error={errors.name}
              icon={<span>👤</span>}
            />
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="tu@correo.com"
              error={errors.email}
              icon={<span>✉️</span>}
            />
            <Input
              label="Teléfono"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="+34 600 000 000"
              error={errors.phone}
              icon={<span>📱</span>}
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              error={errors.password}
              hint="Mínimo 8 caracteres, con letras, números y un símbolo"
              icon={<span>🔒</span>}
            />
          </div>
        </Card>

        {/* Terms */}
        <p className="text-xs text-[#A67850] text-center mb-5 leading-relaxed">
          Al registrarte, aceptas nuestros{' '}
          <span className="text-[#E8734A] font-semibold">Términos de uso</span>{' '}
          y{' '}
          <span className="text-[#E8734A] font-semibold">Política de privacidad</span>
        </p>

        <Button onClick={handleRegister} variant="primary" size="lg" fullWidth disabled={loading}>
          {loading ? '⏳ Creando cuenta...' : 'Crear mi cuenta ✨'}
        </Button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#EDD8BC]" />
          <span className="text-xs text-[#C8A88A]">o</span>
          <div className="flex-1 h-px bg-[#EDD8BC]" />
        </div>

        <Button onClick={onLogin} variant="ghost" fullWidth>
          ¿Ya tienes cuenta? <span className="text-[#E8734A] font-bold">Inicia sesión</span>
        </Button>
      </div>

      {/* Success toast — HU-01 */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 bg-[#4A7C59] text-white rounded-2xl shadow-2xl flex items-center gap-2.5 font-semibold text-sm whitespace-nowrap">
          <span className="text-lg">✅</span>
          ¡Registro exitoso! Ya puedes iniciar sesión
        </div>
      )}
    </div>
  );
}

// ─── ROLE SELECT (Admin) ────────────────────────────────────────────────────────

export function RoleSelectScreen({ onSelect }: { onSelect: (role: UserRole) => void }) {
  const roles = [
    {
      id: 'client' as UserRole,
      title: 'Cliente',
      desc: 'Reserva y gestiona tus citas',
      icon: '👤',
      color: '#E8734A',
      bg: '#FDEBD0',
    },
    {
      id: 'stylist' as UserRole,
      title: 'Estilista',
      desc: 'Gestiona tu agenda y clientes',
      icon: '✂️',
      color: '#F2A950',
      bg: '#FEF5E4',
    },
    {
      id: 'admin' as UserRole,
      title: 'Administrador',
      desc: 'Control total del negocio',
      icon: '🔐',
      color: '#8B9D77',
      bg: '#EAF2E3',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9] p-6">
      <div className="flex items-center gap-2 mb-8 pt-6">
        <div className="w-8 h-8 bg-[#E8734A] rounded-xl flex items-center justify-center">
          <span className="text-white font-black">✂</span>
        </div>
        <span className="font-black text-[#6B4226] font-display">BarberBook</span>
        <span className="ml-auto bg-[#E8734A] text-white text-xs px-3 py-1 rounded-full font-bold">Admin</span>
      </div>

      <h2 className="text-2xl font-black text-[#6B4226] font-display mb-1">Gestión de Roles</h2>
      <p className="text-[#A67850] text-sm mb-8">Selecciona un rol para previsualizar la experiencia</p>

      <div className="flex flex-col gap-4">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => onSelect(role.id)}
            className="flex items-center gap-4 p-5 bg-white rounded-[20px] shadow-[0_4px_24px_rgba(107,66,38,0.1)] text-left hover:shadow-[0_8px_32px_rgba(107,66,38,0.18)] active:scale-[0.98] transition-all duration-200 group"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-110"
              style={{ background: role.bg }}
            >
              {role.icon}
            </div>
            <div className="flex-1">
              <div className="font-black text-[#6B4226] font-display text-lg">{role.title}</div>
              <div className="text-sm text-[#A67850] font-medium">{role.desc}</div>
            </div>
            <span style={{ color: role.color }} className="text-xl font-bold transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-[#F5E6D3] rounded-2xl border border-[#EDD8BC]">
        <p className="text-xs text-[#8B5E3C] text-center font-medium">
          🔐 Esta pantalla solo es visible para administradores del sistema
        </p>
      </div>
    </div>
  );
}

// ─── FORGOT PASSWORD ───────────────────────────────────────────────────────────

export function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSend = () => {
    if (!email.includes('@')) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#FBF3E9] overflow-y-auto">
      <div className="absolute top-0 right-0 w-52 h-52 bg-[#F5E6D3] rounded-full -translate-y-1/3 translate-x-1/4 opacity-60" />

      <div className="relative z-10 flex items-center gap-4 p-5 pt-10">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-[0_2px_12px_rgba(107,66,38,0.1)] flex items-center justify-center text-[#6B4226] hover:bg-[#F5E6D3] transition-colors"
        >
          ←
        </button>
        <h2 className="text-xl font-black text-[#6B4226] font-display">Recuperar contraseña</h2>
      </div>

      <div className="relative z-10 flex justify-center py-6">
        <div className="w-20 h-20 bg-white rounded-[20px] shadow-[0_4px_24px_rgba(107,66,38,0.1)] flex items-center justify-center text-4xl">
          🔑
        </div>
      </div>

      <div className="relative z-10 flex-1 px-6 pb-10">
        {sent ? (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-20 h-20 bg-[#EAF2E3] rounded-full flex items-center justify-center text-4xl">
              ✉️
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#6B4226] font-display mb-2">¡Correo enviado!</h3>
              <p className="text-[#A67850] text-sm leading-relaxed">
                Hemos enviado las instrucciones para restablecer tu contraseña a{' '}
                <strong className="text-[#6B4226]">{email}</strong>.
              </p>
              <p className="text-[#A67850] text-sm leading-relaxed mt-2">
                Revisa tu bandeja de entrada (y la carpeta de spam).
              </p>
            </div>
            <div className="w-full bg-[#EAF2E3] border border-[#A8BB92] rounded-2xl p-4">
              <p className="text-[#4A7C59] text-sm font-semibold">✓ Correo enviado correctamente</p>
            </div>
            <Button onClick={onBack} variant="primary" size="lg" fullWidth>
              Volver al inicio de sesión
            </Button>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="text-sm text-[#A67850] hover:text-[#E8734A] font-medium transition-colors"
            >
              Usar otro correo
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-black text-[#6B4226] font-display text-center mb-2">
              ¿Olvidaste tu contraseña?
            </h3>
            <p className="text-center text-[#A67850] text-sm mb-8 leading-relaxed">
              No te preocupes. Ingresa tu correo y te enviaremos instrucciones para crear una nueva.
            </p>

            <Card className="mb-5">
              <Input
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={v => { setEmail(v); setError(''); }}
                placeholder="tu@correo.com"
                error={error}
                icon={<span>✉️</span>}
              />
            </Card>

            <Button onClick={handleSend} variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? '⏳ Enviando...' : 'Enviar instrucciones'}
            </Button>

            <button
              onClick={onBack}
              className="w-full text-center mt-4 text-[#A67850] text-sm font-medium hover:text-[#E8734A] transition-colors"
            >
              ← Volver al inicio de sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
