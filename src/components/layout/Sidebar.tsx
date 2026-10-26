import { NavLink, useNavigate } from 'react-router';
import type { MouseEvent } from 'react';
import clsx from 'clsx';
import { Fuel, LogOut, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { pages } from '../../pages';
import { logout } from '../../api/client';

interface SidebarProps {
  open: boolean; // panel abierto en celular
  onClose: () => void;
  collapsed: boolean; // contraída a solo íconos en escritorio
  onToggleCollapsed: () => void;
}

export function Sidebar({ open, onClose, collapsed, onToggleCollapsed }: Readonly<SidebarProps>) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Contraída en escritorio: un clic en cualquier zona libre la expande.
  // Los links y botones conservan su propia acción.
  const handleAsideClick = (e: MouseEvent<HTMLElement>) => {
    if (!collapsed || !window.matchMedia('(min-width: 1024px)').matches) return;
    if ((e.target as HTMLElement).closest('a, button')) return;
    onToggleCollapsed();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 w-60 shrink-0 flex flex-col bg-card border-r border-border transition-[width,translate] duration-50 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
          collapsed && 'lg:w-16 lg:cursor-pointer',
        )}
        onClick={handleAsideClick}
      >
        <div
          className={clsx(
            'flex items-center justify-between h-16 px-5 border-b border-border',
            collapsed && 'lg:flex-col-reverse lg:justify-center lg:h-auto lg:py-3 lg:px-0 lg:gap-3',
          )}
        >
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5 shrink-0 text-accent-blue" />
            <span className={clsx('font-semibold whitespace-nowrap', collapsed && 'lg:hidden')}>
              Fuel Dashboard
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-slate-200"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={onToggleCollapsed}
            title={collapsed ? 'Expandir menú' : 'Contraer menú'}
            aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
            aria-expanded={!collapsed}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4 "  /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {pages.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={onClose}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                  collapsed && 'lg:justify-center lg:px-0',
                  isActive
                    ? 'bg-accent-blue/15 text-accent-blue font-medium'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className={clsx('whitespace-nowrap', collapsed && 'lg:hidden')}>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Cerrar sesión' : undefined}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors',
              collapsed && 'lg:justify-center lg:px-0',
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className={clsx('whitespace-nowrap', collapsed && 'lg:hidden')}>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
