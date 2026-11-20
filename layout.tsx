'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bluetooth,
  Gauge,
  Play,
  History,
  Bot,
  TrendingUp,
  Car,
  Activity,
  Leaf,
  Cpu,
  Trophy,
  FileSpreadsheet,
  Settings,
  ChevronRight,
  Menu,
  X,
  Radio,
  ExternalLink,
} from 'lucide-react';

const mainNav = [
  { href: '/app', label: 'Command Cockpit', icon: LayoutDashboard, exact: true },
  { href: '/app/connect', label: 'OBD-II Bluetooth', icon: Bluetooth, badge: 'HARDWARE' },
  { href: '/app/drive', label: 'Live HUD Session', icon: Gauge, pulse: true },
  { href: '/app/simulator', label: 'Simulation Studio', icon: Play },
  { href: '/app/trips', label: 'Trips Library', icon: History },
];

const intelligenceNav = [
  { href: '/app/coach', label: 'AI Eco Coach', icon: Bot },
  { href: '/app/insights', label: 'Driving Insights', icon: TrendingUp },
  { href: '/app/vehicle', label: 'Vehicle Garage', icon: Car },
  { href: '/app/diagnostics', label: 'ECU Diagnostics', icon: Activity },
];

const climateNav = [
  { href: '/app/sustainability', label: 'Sustainability Hub', icon: Leaf },
  { href: '/app/green-computing', label: 'Green Computing', icon: Cpu },
  { href: '/app/achievements', label: 'Eco Badges & XP', icon: Trophy },
];

const utilityNav = [
  { href: '/app/reports', label: 'Reports & Export', icon: FileSpreadsheet },
  { href: '/app/settings', label: 'Settings & Units', icon: Settings },
  { href: '/status', label: 'System Status', icon: Radio },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  const NavGroup = ({ title, items }: { title: string; items: any[] }) => (
    <div className="mb-5">
      <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-emerald-400/80 uppercase">
        {title}
      </div>
      <div className="space-y-0.5">
        {items.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={[
                'group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200',
                active
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-transparent',
              ].join(' ')}
            >
              <Icon className={['w-4 h-4 flex-shrink-0', active ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-200'].join(' ')} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold tracking-wider">
                  {item.badge}
                </span>
              )}
              {item.pulse && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
              {active && !item.badge && !item.pulse && (
                <ChevronRight className="w-3 h-3 text-emerald-400" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#081118] text-zinc-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-[#0c1821] border-r border-zinc-800/80 flex-shrink-0 z-30">
        {/* Brand */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Gauge className="w-4 h-4 text-zinc-950 font-bold" />
            </div>
            <div>
              <div className="text-sm font-black tracking-widest text-zinc-100 flex items-center gap-1.5 font-mono">
                REVX <span className="text-[10px] text-emerald-400 px-1 py-0.2 bg-emerald-950/60 rounded border border-emerald-800/50">v3.0</span>
              </div>
              <div className="text-[10px] text-zinc-400 tracking-wider font-mono">DRIVE INTELLIGENCE</div>
            </div>
          </Link>
        </div>

        {/* Scrollable nav items */}
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-zinc-700">
          <NavGroup title="Real-Time Operation" items={mainNav} />
          <NavGroup title="Telemetry & Intelligence" items={intelligenceNav} />
          <NavGroup title="Climate & Green Computing" items={climateNav} />
          <NavGroup title="System & Exports" items={utilityNav} />
        </div>

        {/* Mode & Profile footer */}
        <div className="p-3 border-t border-zinc-800/80 bg-[#0a141b]">
          <div className="flex items-center justify-between text-[11px] mb-2 px-1">
            <span className="text-zinc-400">Connection Mode</span>
            <span className="text-amber-400 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> STANDBY
            </span>
          </div>
          <Link
            href="/app/connect"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-medium transition-all"
          >
            <Bluetooth className="w-3.5 h-3.5" /> Hardware Pair Wizard
          </Link>
          <div className="mt-2 text-[10px] text-zinc-500 text-center font-mono">
            CHRIST (Deemed to be Univ) NCR
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 w-72 bg-[#0c1821] border-r border-zinc-800 flex flex-col h-full">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="text-sm font-bold tracking-widest text-emerald-400 font-mono">REVX COCKPIT</div>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <NavGroup title="Real-Time Operation" items={mainNav} />
              <NavGroup title="Telemetry & Intelligence" items={intelligenceNav} />
              <NavGroup title="Climate & Green Computing" items={climateNav} />
              <NavGroup title="System & Exports" items={utilityNav} />
            </div>
          </aside>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-zinc-800/80 bg-[#081118]/80 backdrop-blur-md px-4 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-zinc-400 hidden sm:inline">Active Telemetry:</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                STANDBY · HARDWARE READY
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
            >
              <span>Public Showcase</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <div className="h-4 w-px bg-zinc-800" />
            <Link
              href="/app/simulator"
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-all"
            >
              Simulator Studio
            </Link>
          </div>
        </header>

        {/* Content surface */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#081118]">
          {children}
        </main>
      </div>
    </div>
  );
}
