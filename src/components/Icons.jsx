const Svg = ({ children, size = 20, fill = 'none', ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

export const SearchIcon = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Svg>
);
export const HeartIcon = ({ filled, ...p }) => (
  <Svg {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7-4.4-9-9.2C1.8 7.6 3.6 4.5 6.8 4.5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.2 0 5 3.1 3.8 6.3C19 15.6 12 20 12 20z" />
  </Svg>
);
export const HeartOffIcon = (p) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.4-9-9.2C1.8 7.6 3.6 4.5 6.8 4.5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.2 0 5 3.1 3.8 6.3C19 15.6 12 20 12 20z" />
    <path d="M4 4l16 16" />
  </Svg>
);
export const BagIcon = (p) => (
  <Svg {...p}>
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 016 0v2" />
  </Svg>
);
export const SunIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);
export const MoonIcon = (p) => (
  <Svg {...p}>
    <path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z" />
  </Svg>
);
export const MenuIcon = (p) => (
  <Svg {...p}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </Svg>
);
export const HomeIcon = (p) => (
  <Svg {...p}>
    <path d="M3 11l9-8 9 8" />
    <path d="M5.5 9.5V21h13V9.5M9.5 21v-7h5v7" />
  </Svg>
);
export const CloseIcon = (p) => (
  <Svg {...p}>
    <path d="M5 5l14 14M19 5L5 19" />
  </Svg>
);
export const PlusIcon = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const MinusIcon = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);
export const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
  </Svg>
);
export const ArrowIcon = (p) => (
  <Svg {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
);
export const StarIcon = (p) => (
  <Svg {...p} fill="currentColor" strokeWidth="0">
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9L12 2.5z" />
  </Svg>
);
export const TruckIcon = (p) => (
  <Svg {...p}>
    <path d="M2 6h12v10H2zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </Svg>
);
export const ReturnIcon = (p) => (
  <Svg {...p}>
    <path d="M4 9h11a5 5 0 010 10H8M4 9l4-4M4 9l4 4" />
  </Svg>
);
export const CashIcon = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="1.5" />
    <circle cx="12" cy="12" r="2.8" />
  </Svg>
);
export const ShieldIcon = (p) => (
  <Svg {...p}>
    <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);
export const FilterIcon = (p) => (
  <Svg {...p}>
    <path d="M3 5h18M6 12h12M10 19h4" />
  </Svg>
);
export const CheckIcon = (p) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </Svg>
);
export const EyeOffIcon = (p) => (
  <Svg {...p}>
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.83m-5.56-1.44a5.5 5.5 0 01-1.78 0T3 12a5.5 5.5 0 011.78-4.32L9.9 2.8zM15 12a3 3 0 10-6 0 3 3 0 006 0z" />
  </Svg>
);

export const LayoutIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Svg>
);
export const PackageIcon = (p) => (
  <Svg {...p}>
    <path d="M21 10V8l-8-4-8 4v2l8 4 8-4z" />
    <polyline points="21 10 14 12 7 10" />
    <polyline points="21 16 14 14 7 16" />
  </Svg>
);
export const ImageIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </Svg>
);
export const LogoutIcon = (p) => (
  <Svg {...p}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);
export const TagIcon = (p) => (
  <Svg {...p}>
    <path d="M12 2H2v10l9.29 9.29a1 1 0 001.42 0l8.58-8.58a1 1 0 000-1.42L12 2z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </Svg>
);
export const EyeIcon = (p) => (
  <Svg {...p}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);
export const UsersIcon = (p) => (
  <Svg {...p}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </Svg>
);
export const ClockIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </Svg>
);
export const EditIcon = (p) => (
  <Svg {...p}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </Svg>
);

export const WhatsAppIcon = (p) => (
  <Svg {...p} fill="currentColor" strokeWidth="0">
    <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.8 11.9 11.9 0 004.6 4.1c1.7.7 2.4.8 3.2.7a2.7 2.7 0 001.8-1.3 2.2 2.2 0 00.2-1.3c-.1-.1-.3-.2-.6-.3z" />
  </Svg>
);
export const InstagramIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".8" fill="currentColor" />
  </Svg>
);
export const FacebookIcon = (p) => (
  <Svg {...p}>
    <path d="M14 8h3V4h-3a4 4 0 00-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0114 8z" />
  </Svg>
);
export const TiktokIcon = (p) => (
  <Svg {...p}>
    <path d="M14 3v11.5a3.5 3.5 0 11-3.5-3.5M14 3c.4 2.6 2 4.2 5 4.5" />
  </Svg>
);
export const XIcon = (p) => (
  <Svg {...p}>
    <path d="M4 4l16 16M20 4L4 20" />
  </Svg>
);

/* Payment method icons */
export const InstapayIcon = (p) => (
  <Svg {...p} fill="currentColor" strokeWidth="0">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16z" />
    <path d="M8 10h8v2H8zM8 14h8v2H8zM8 6h2v2H8zM14 6h2v2h-2z" />
  </Svg>
);
export const WalletIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="6" width="18" height="14" rx="2" />
    <path d="M7 10h2M11 10h2M15 10h2M7 14h2M11 14h2M15 14h2" />
    <line x1="7" y1="7" x2="17" y2="7" />
    <line x1="7" y1="11" x2="17" y2="11" />
  </Svg>
);


