export function SplashIllustration() {
  return (
    <svg viewBox="0 0 380 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background blob */}
      <ellipse cx="190" cy="150" rx="180" ry="130" fill="#F5E6D3" />
      <ellipse cx="80" cy="80" rx="60" ry="50" fill="#EDD8BC" opacity="0.6" />
      <ellipse cx="300" cy="220" rx="70" ry="55" fill="#EDD8BC" opacity="0.5" />

      {/* Barber Chair */}
      {/* Base */}
      <rect x="148" y="252" width="80" height="14" rx="7" fill="#8B5E3C" />
      <rect x="180" y="234" width="16" height="22" rx="4" fill="#A67850" />
      {/* Seat */}
      <rect x="128" y="185" width="120" height="52" rx="16" fill="#6B4226" />
      {/* Chair back */}
      <rect x="142" y="118" width="92" height="72" rx="16" fill="#8B5E3C" />
      {/* Headrest */}
      <rect x="153" y="102" width="70" height="28" rx="10" fill="#6B4226" />
      {/* Armrests */}
      <rect x="112" y="182" width="22" height="40" rx="10" fill="#8B5E3C" />
      <rect x="242" y="182" width="22" height="40" rx="10" fill="#8B5E3C" />
      {/* Seat cushion shine */}
      <rect x="145" y="192" width="40" height="8" rx="4" fill="#A67850" opacity="0.4" />

      {/* Large Scissors (tilted, top-right) */}
      <g transform="translate(265, 60) rotate(35)">
        {/* Pivot */}
        <circle cx="18" cy="28" r="5" fill="#C85A31" />
        {/* Top blade */}
        <path d="M18 28 L-8 -12 C-12 -20 -6 -26 0 -22 L18 28Z" fill="#E8734A" />
        <path d="M18 28 L44 -12 C48 -20 42 -26 36 -22 L18 28Z" fill="#C85A31" />
        {/* Handle rings */}
        <circle cx="-14" cy="-28" r="14" fill="none" stroke="#E8734A" strokeWidth="6" />
        <circle cx="50" cy="-28" r="14" fill="none" stroke="#E8734A" strokeWidth="6" />
        {/* Lower blades */}
        <path d="M18 28 L4 70 C2 76 10 78 14 73 L18 28Z" fill="#E8734A" />
        <path d="M18 28 L32 70 C34 76 26 78 22 73 L18 28Z" fill="#C85A31" />
      </g>

      {/* Comb (bottom-left, tilted) */}
      <g transform="translate(42, 160) rotate(-20)">
        <rect x="0" y="0" width="82" height="16" rx="5" fill="#F2A950" />
        {[8, 17, 26, 35, 44, 53, 62, 71].map((x, i) => (
          <rect key={i} x={x} y={16} width="5" height="20" rx="2.5" fill="#F2A950" />
        ))}
      </g>

      {/* Round Mirror */}
      <circle cx="56" cy="62" r="38" fill="#FBF3E9" stroke="#6B4226" strokeWidth="8" />
      <circle cx="56" cy="62" r="26" fill="#F5E6D3" />
      <circle cx="56" cy="62" r="2" fill="#8B5E3C" opacity="0.4" />
      {/* Mirror shine */}
      <ellipse cx="46" cy="50" rx="8" ry="5" fill="white" opacity="0.3" transform="rotate(-30 46 50)" />

      {/* Plant (right side) */}
      <g transform="translate(308, 148)">
        <path d="M8 60 L2 88 L42 88 L36 60Z" fill="#8B5E3C" />
        <rect x="5" y="56" width="34" height="8" rx="4" fill="#6B4226" />
        {/* Stems */}
        <line x1="21" y1="56" x2="21" y2="28" stroke="#8B9D77" strokeWidth="3" strokeLinecap="round" />
        <line x1="21" y1="44" x2="8" y2="32" stroke="#8B9D77" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="21" y1="38" x2="36" y2="24" stroke="#8B9D77" strokeWidth="2.5" strokeLinecap="round" />
        {/* Leaves */}
        <ellipse cx="4" cy="26" rx="16" ry="9" fill="#8B9D77" transform="rotate(-35 4 26)" />
        <ellipse cx="38" cy="20" rx="16" ry="9" fill="#A8BB92" transform="rotate(35 38 20)" />
        <ellipse cx="21" cy="18" rx="14" ry="9" fill="#8B9D77" />
      </g>

      {/* Product Bottle */}
      <g transform="translate(82, 202)">
        <rect x="4" y="0" width="22" height="38" rx="6" fill="#F2A950" />
        <rect x="7" y="-8" width="16" height="12" rx="4" fill="#D4883A" />
        <rect x="10" y="-12" width="10" height="6" rx="3" fill="#C87830" />
        <rect x="8" y="8" width="14" height="3" rx="1.5" fill="white" opacity="0.4" />
        <rect x="8" y="14" width="10" height="2" rx="1" fill="white" opacity="0.3" />
      </g>

      {/* Small razor blade */}
      <g transform="translate(280, 162) rotate(-10)">
        <rect x="0" y="0" width="50" height="12" rx="6" fill="#6B4226" />
        <rect x="5" y="3" width="40" height="6" rx="3" fill="#8B5E3C" />
        <rect x="8" y="4" width="34" height="4" rx="2" fill="#A67850" opacity="0.6" />
      </g>

      {/* Decorative dots */}
      <circle cx="108" cy="46" r="5" fill="#F2A950" />
      <circle cx="122" cy="32" r="3" fill="#E8734A" />
      <circle cx="326" cy="88" r="4" fill="#F2A950" />
      <circle cx="246" cy="228" r="5" fill="#8B9D77" opacity="0.7" />
      <circle cx="32" cy="230" r="4" fill="#E8734A" opacity="0.5" />
      <circle cx="350" cy="145" r="3" fill="#F2A950" />

      {/* Star accents */}
      <path d="M165 48 L167 42 L169 48 L175 50 L169 52 L167 58 L165 52 L159 50 Z" fill="#F2A950" />
      <path d="M295 108 L297 103 L299 108 L304 110 L299 112 L297 117 L295 112 L290 110 Z" fill="#E8734A" opacity="0.7" />
      <path d="M45 150 L46.5 145.5 L48 150 L52.5 151.5 L48 153 L46.5 157.5 L45 153 L40.5 151.5 Z" fill="#8B9D77" />
    </svg>
  );
}

export function SuccessIllustration() {
  return (
    <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background blob */}
      <ellipse cx="160" cy="145" rx="145" ry="120" fill="#F5E6D3" />

      {/* Confetti */}
      <rect x="60" y="40" width="14" height="8" rx="2" fill="#E8734A" transform="rotate(25 60 40)" />
      <rect x="230" y="30" width="12" height="7" rx="2" fill="#F2A950" transform="rotate(-15 230 30)" />
      <rect x="280" y="80" width="10" height="6" rx="2" fill="#8B9D77" transform="rotate(40 280 80)" />
      <rect x="30" y="100" width="12" height="7" rx="2" fill="#F2A950" transform="rotate(-30 30 100)" />
      <rect x="260" y="160" width="14" height="8" rx="2" fill="#E8734A" transform="rotate(20 260 160)" />
      <rect x="50" y="200" width="10" height="6" rx="2" fill="#8B9D77" transform="rotate(-20 50 200)" />
      <circle cx="85" cy="55" r="5" fill="#F2A950" />
      <circle cx="245" cy="65" r="4" fill="#E8734A" />
      <circle cx="300" cy="130" r="5" fill="#8B9D77" opacity="0.7" />
      <circle cx="25" cy="155" r="4" fill="#F2A950" />

      {/* Person body */}
      {/* Legs */}
      <path d="M155 220 L145 260 L155 260 L160 235 L165 260 L175 260 L165 220Z" fill="#E8734A" />
      {/* Shoes */}
      <rect x="140" y="258" width="20" height="10" rx="5" fill="#6B4226" />
      <rect x="160" y="258" width="20" height="10" rx="5" fill="#6B4226" />
      {/* Body */}
      <rect x="138" y="158" width="44" height="65" rx="20" fill="#E8734A" />
      {/* Shirt detail */}
      <rect x="148" y="168" width="24" height="3" rx="1.5" fill="#C85A31" opacity="0.4" />

      {/* Left arm (raised) */}
      <path d="M138 165 C120 155 105 140 95 120" stroke="#F09474" strokeWidth="20" strokeLinecap="round" />
      {/* Right arm (raised) */}
      <path d="M182 165 C200 155 215 140 225 120" stroke="#F09474" strokeWidth="20" strokeLinecap="round" />

      {/* Head */}
      <circle cx="160" cy="138" r="30" fill="#F2A950" />
      {/* Eyes (simple dots) */}
      <circle cx="151" cy="134" r="4" fill="#6B4226" />
      <circle cx="169" cy="134" r="4" fill="#6B4226" />
      {/* Smile */}
      <path d="M150 145 Q160 154 170 145" stroke="#6B4226" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Hair */}
      <path d="M132 130 C130 110 140 108 160 108 C180 108 190 110 188 130" fill="#6B4226" />

      {/* Scissors in left hand */}
      <g transform="translate(80, 95) rotate(-30)">
        <circle cx="8" cy="14" r="3" fill="#C85A31" />
        <path d="M8 14 L2 -2 C0 -6 4 -9 7 -7 L8 14Z" fill="#E8734A" />
        <path d="M8 14 L14 -2 C16 -6 12 -9 9 -7 L8 14Z" fill="#C85A31" />
        <circle cx="-2" cy="-10" r="8" fill="none" stroke="#E8734A" strokeWidth="4" />
        <circle cx="18" cy="-10" r="8" fill="none" stroke="#E8734A" strokeWidth="4" />
      </g>

      {/* Star in right hand */}
      <path d="M225 95 L228 85 L231 95 L241 98 L231 101 L228 111 L225 101 L215 98 Z" fill="#F2A950" />

      {/* Stars around */}
      <path d="M110 60 L113 50 L116 60 L126 63 L116 66 L113 76 L110 66 L100 63 Z" fill="#E8734A" />
      <path d="M200 45 L202.5 37 L205 45 L213 47.5 L205 50 L202.5 58 L200 50 L192 47.5 Z" fill="#F2A950" />
      <path d="M262 90 L264 84 L266 90 L272 92 L266 94 L264 100 L262 94 L256 92 Z" fill="#8B9D77" />

      {/* Checkmark badge */}
      <circle cx="160" cy="72" r="24" fill="#8B9D77" />
      <path d="M150 72 L157 80 L172 64" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EmptyAppointmentsIllustration() {
  return (
    <svg viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Background */}
      <ellipse cx="140" cy="115" rx="120" ry="90" fill="#F5E6D3" />

      {/* Calendar */}
      <rect x="70" y="50" width="140" height="120" rx="16" fill="white" stroke="#EDD8BC" strokeWidth="2" />
      <rect x="70" y="50" width="140" height="36" rx="16" fill="#E8734A" />
      <rect x="70" y="68" width="140" height="18" rx="0" fill="#E8734A" />
      {/* Calendar dots row */}
      {[86, 107, 128, 149, 170, 191].map((x, i) => (
        <circle key={i} cx={x} cy={105} r="8" fill={i === 2 ? '#FBF3E9' : '#F5E6D3'} />
      ))}
      {[86, 107, 128, 149, 170, 191].map((x, i) => (
        <circle key={i} cx={x} cy={125} r="8" fill={i === 4 ? '#EDD8BC' : '#F5E6D3'} />
      ))}
      {[86, 107, 128, 149, 170].map((x, i) => (
        <circle key={i} cx={x} cy={145} r="8" fill="#F5E6D3" />
      ))}
      {/* Month label */}
      <rect x="98" y="60" width="84" height="10" rx="5" fill="white" opacity="0.5" />
      {/* Header dots */}
      <rect x="90" y="78" width="12" height="4" rx="2" fill="white" opacity="0.6" />
      <rect x="110" y="78" width="12" height="4" rx="2" fill="white" opacity="0.6" />
      <rect x="130" y="78" width="12" height="4" rx="2" fill="white" opacity="0.6" />

      {/* Person */}
      <circle cx="200" cy="85" r="22" fill="#F2A950" />
      <circle cx="193" cy="81" r="3.5" fill="#6B4226" />
      <circle cx="207" cy="81" r="3.5" fill="#6B4226" />
      <path d="M193 91 Q200 97 207 91" stroke="#6B4226" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M194 105 C182 110 178 125 180 140" stroke="#F09474" strokeWidth="16" strokeLinecap="round" />
      <path d="M206 105 C218 110 222 125 220 140" stroke="#F09474" strokeWidth="16" strokeLinecap="round" />
      <rect x="186" y="105" width="28" height="50" rx="14" fill="#E8734A" />
      <path d="M192 155 L188 180 L196 180 L200 165 L204 180 L212 180 L208 155Z" fill="#E8734A" />
      <rect x="184" y="178" width="14" height="8" rx="4" fill="#6B4226" />
      <rect x="202" y="178" width="14" height="8" rx="4" fill="#6B4226" />

      {/* Question mark */}
      <text x="190" y="68" fontSize="18" fill="#C85A31" fontWeight="bold" fontFamily="Poppins">?</text>

      {/* Decorative dots */}
      <circle cx="42" cy="80" r="5" fill="#F2A950" opacity="0.6" />
      <circle cx="55" cy="172" r="4" fill="#E8734A" opacity="0.5" />
      <circle cx="242" cy="160" r="5" fill="#8B9D77" opacity="0.5" />
    </svg>
  );
}

export function ScissorsIcon({ size = 24, color = '#E8734A' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="6" r="3" stroke={color} strokeWidth="1.8" />
      <circle cx="6" cy="18" r="3" stroke={color} strokeWidth="1.8" />
      <line x1="8.5" y1="8.5" x2="21" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8.5" y1="15.5" x2="15" y2="9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function RazorIcon({ size = 24, color = '#E8734A' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="10" width="18" height="4" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M7 10 L5 4 L19 4 L17 10" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M7 14 L5 20 L19 20 L17 14" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function CombIcon({ size = 24, color = '#E8734A' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="8" width="20" height="6" rx="2" stroke={color} strokeWidth="1.8" />
      {[5, 9, 13, 17].map((x, i) => (
        <line key={i} x1={x} y1="14" x2={x} y2="19" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      ))}
    </svg>
  );
}

export function BrushIcon({ size = 24, color = '#E8734A' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 3L6 15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 15 C3 15 2 17 2 19 C2 21 4 22 6 22 C8 22 9 20 9 18 L6 15Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="15" y1="6" x2="20" y2="11" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function BottleIcon({ size = 24, color = '#E8734A' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="7" y="9" width="10" height="13" rx="3" stroke={color} strokeWidth="1.8" />
      <path d="M9 9 L8 5 L16 5 L15 9" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth="1.8" />
      <line x1="9" y1="14" x2="15" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChairIcon({ size = 24, color = '#E8734A' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="6" y="8" width="12" height="8" rx="3" stroke={color} strokeWidth="1.8" />
      <rect x="7" y="4" width="10" height="5" rx="2" stroke={color} strokeWidth="1.8" />
      <line x1="12" y1="16" x2="12" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="9" y1="21" x2="15" y2="21" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="5" y1="12" x2="2" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="19" y1="12" x2="22" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MirrorIcon({ size = 24, color = '#E8734A' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="10" r="7" stroke={color} strokeWidth="1.8" />
      <line x1="12" y1="17" x2="12" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="9" y1="22" x2="15" y2="22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MemphisStylistAvatar({ name, color, size = 56 }: { name: string; color: string; size?: number }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const bgColors: Record<string, string> = {
    '#E8734A': '#FDEBD0',
    '#F2A950': '#FEF5E4',
    '#8B9D77': '#EAF2E3',
    '#6B4226': '#F5E6D3',
  };
  const bg = bgColors[color] || '#F5E6D3';

  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="28" fill={bg} />
      {/* Abstract Memphis face */}
      {/* Head */}
      <ellipse cx="28" cy="24" rx="14" ry="15" fill={color} />
      {/* Hair top blob */}
      <ellipse cx="28" cy="13" rx="12" ry="7" fill="#6B4226" opacity="0.8" />
      {/* Eyes */}
      <circle cx="23" cy="22" r="2.5" fill="white" />
      <circle cx="33" cy="22" r="2.5" fill="white" />
      <circle cx="23.8" cy="22" r="1.2" fill="#333" />
      <circle cx="33.8" cy="22" r="1.2" fill="#333" />
      {/* Smile */}
      <path d="M22 28 Q28 33 34 28" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Body */}
      <rect x="16" y="38" width="24" height="14" rx="8" fill={color} opacity="0.7" />
      {/* Collar/shirt detail */}
      <path d="M22 38 L28 44 L34 38" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.7" />
    </svg>
  );
}
