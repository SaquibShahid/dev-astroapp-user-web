import {
  IconHome,
  IconMenu2,
  IconMessageCircle,
  IconPhone,
  IconPlus,
  IconSearch,
  IconShoppingBag,
  IconSparkles,
  IconUserCircle,
  IconWallet,
  IconX,
} from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../Components/Logo';
import { useAuthStore } from '../store/useAuthStore';
import { useHomeStore } from '../store/useHomeStore';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: IconHome, end: true },
  { to: '/chat', label: 'Chat', icon: IconMessageCircle, end: false },
  { to: '/call', label: 'Call', icon: IconPhone, end: false },
  { to: '/store', label: 'Store', icon: IconShoppingBag, end: false },
  { to: '/remedies', label: 'Remedies', icon: IconSparkles, end: false },
];

const SEARCH_DEBOUNCE_MS = 350;

const Header: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const fetchWallet = useAuthStore((state) => state.fetchWallet);
  const { searchHints, fetchSearchHints, clearSearchHints } = useHomeStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 3) {
      clearSearchHints();
      return;
    }
    debounceRef.current = setTimeout(() => {
      fetchSearchHints(value);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleHintClick = (hint: string) => {
    setSearchQuery(hint);
    clearSearchHints();
  };

  const showDropdown = isSearchFocused && searchQuery.trim().length >= 3 && searchHints.length > 0;

  return (
    <header className="sticky top-0 z-30 bg-bg border-b border-border">
      <div className="container-custom flex items-center gap-5 py-7 md:py-9 mb-1 md:mb-2">
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={() => setMenuOpen(false)}>
          <Logo size="sm" />
          <span className="hidden sm:block text-primary font-bold leading-tight text-sm">
            EDWID
            <br />
            ASTRO
          </span>
        </Link>

        <div className="relative flex-1 max-w-md min-w-0 my-2 md:my-3">
          <IconSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search for astrologers, services..."
            className="w-full h-12 pl-11 pr-4 bg-bg-soft border border-border rounded-full focus:outline-none focus:border-primary focus:shadow-sm transition-all text-sm"
          />

          {showDropdown && (
            <ul className="absolute top-full left-0 right-0 mt-2 bg-bg border border-border rounded-2xl shadow-lg py-2 max-h-72 overflow-y-auto z-40">
              {searchHints.map((hint, index) => (
                <li key={`${hint}-${index}`}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleHintClick(hint)}
                    className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-bg-soft transition-colors"
                  >
                    {hint}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="ml-auto flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-2.5 bg-bg-soft rounded-full pl-4 pr-1.5 py-2">
            <IconWallet size={18} className="text-primary" />
            <span className="text-text-main font-semibold text-sm">{user?.wallet ?? 0}</span>
            <button
              type="button"
              className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-primary-dark"
              aria-label="Add money"
            >
              <IconPlus size={14} stroke={3} />
            </button>
          </div>

          <Link to="/profile" className="w-11 h-11 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-bg-soft flex items-center justify-center">
                <IconUserCircle size={22} className="text-text-light" />
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden text-text-main"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
          </button>
        </div>
      </div>

      <nav className="hidden md:block bg-primary-dark">
        <div className="container-custom flex items-center gap-8 h-12">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 h-full text-xs font-semibold uppercase tracking-wide border-b-2 transition-colors ${
                  isActive ? 'text-white border-accent' : 'text-white/60 border-transparent hover:text-white'
                }`
              }
            >
              <Icon size={16} stroke={1.75} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {menuOpen && (
        <nav className="md:hidden bg-primary-dark border-t border-white/10">
          <div className="container-custom py-2 flex flex-col">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={18} stroke={1.75} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
