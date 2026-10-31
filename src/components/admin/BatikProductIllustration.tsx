export default function BatikProductIllustration({ variant }: { variant: string }) {
  const patternId = `batik-pattern-${variant}`;
  const isLabel = variant === "photo-2";

  return (
    <svg
      viewBox="0 0 240 180"
      className="h-full w-full"
      role="img"
      aria-label="Ilustrasi produk batik"
    >
      <defs>
        <pattern id={patternId} width="22" height="22" patternUnits="userSpaceOnUse">
          <path
            d="M0 11 Q5.5 0 11 11 T22 11"
            stroke="#b45309"
            strokeWidth="1.2"
            fill="none"
            opacity="0.45"
          />
          <circle cx="5" cy="17" r="1.2" fill="#b45309" opacity="0.35" />
          <circle cx="17" cy="5" r="1.2" fill="#b45309" opacity="0.35" />
        </pattern>
      </defs>
      <rect width="240" height="180" fill="#f5ecdd" />
      <rect width="240" height="180" fill={`url(#${patternId})`} opacity="0.55" />
      {isLabel ? (
        <g>
          <rect x="65" y="48" width="110" height="88" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="78" y="60" width="84" height="52" fill={`url(#${patternId})`} />
          <rect x="78" y="118" width="42" height="18" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
          <path d="M85 124H113M85 129H105" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path
            d="M85 45 L105 32 Q120 44 135 32 L155 45 L175 65 L157 82 L148 72 L148 145 L92 145 L92 72 L83 82 L65 65 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          <path d="M105 45 Q120 58 135 45" stroke="#cbd5e1" strokeWidth="2" fill="none" />
          <path d="M92 76 L148 76" stroke="#e2e8f0" strokeWidth="1.5" />
          <g opacity="0.5">
            <path d="M100 90 q6 -6 12 0 t12 0" stroke="#b45309" strokeWidth="1.3" fill="none" />
            <path d="M100 105 q6 -6 12 0 t12 0" stroke="#b45309" strokeWidth="1.3" fill="none" />
            <path d="M100 120 q6 -6 12 0 t12 0" stroke="#b45309" strokeWidth="1.3" fill="none" />
          </g>
        </g>
      )}
    </svg>
  );
}
