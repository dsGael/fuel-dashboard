import type { ComponentType } from 'react';
import { LayoutDashboard, type LucideIcon } from 'lucide-react';
import { DashboardPage } from './DashboardPage';

export interface AppPage {
  path: string;
  label: string;
  icon: LucideIcon;
  component: ComponentType;
}

// Para agregar una página nueva: crea el componente en src/pages y agrégalo aquí.
// Aparece automáticamente en la sidebar y en el router.
export const pages: AppPage[] = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, component: DashboardPage },
];
