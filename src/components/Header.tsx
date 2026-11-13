import { useState } from 'react';
import { Download, Menu, X } from 'lucide-react';

interface HeaderProps {
  onExportActive: () => void;
  activeSiteName: string;
}

export function Header({ onExportActive, activeSiteName }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#peta-geologi', label: 'Peta Geologi' },
    { href: '#perbandingan', label: 'Perbandingan' },
    { href: '#metodologi', label: 'Metodologi' },
    { href: '#rujukan', label: 'Rujukan Data' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#07090E]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <a
          href="#top"
          className="font-display text-base font-semibold tracking-tight text-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
        >
          TerraAnalog
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 text-slate-300 transition-colors hover:text-white hover:underline underline-offset-4 decoration-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + mobile menu button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onExportActive}
            aria-label={`Ekspor ringkasan data JSON untuk ${activeSiteName}`}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/90 px-4 py-2 text-xs font-medium text-slate-100 whitespace-nowrap shrink-0 transition-colors hover:border-slate-500 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
            <span>Ekspor JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/80 text-slate-200 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-800/80 bg-[#0A0E17]/95 backdrop-blur-md px-4 py-3 md:hidden">
          <nav aria-label="Navigasi seluler" className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-slate-200 hover:bg-slate-800/70"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                onExportActive();
                setMobileMenuOpen(false);
              }}
              className="mt-1 flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900 px-3 text-sm font-medium text-slate-100"
            >
              <Download className="h-4 w-4 text-slate-300" aria-hidden="true" />
              <span>Ekspor Ringkasan JSON</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
