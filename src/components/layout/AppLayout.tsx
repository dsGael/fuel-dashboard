import { useState } from 'react';
import { Outlet } from 'react-router';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

const COLLAPSED_KEY = 'sidebar-collapsed';

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1';
  } catch {
    return false;
  }
}

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem(COLLAPSED_KEY, next ? '1' : '0');
    } catch {
      // sin localStorage solo se pierde la preferencia al recargar
    }
  };

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      <div className="flex-1 min-w-0 overflow-x-hidden">
        <div className="lg:hidden flex items-center h-14 px-4 border-b border-border bg-card">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-slate-200"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
