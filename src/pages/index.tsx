import type { ComponentType } from 'react';
import { BriefcaseBusiness, BusFront, LayoutDashboard,  UserGroup,  type LucideIcon } from 'lucide-react';
import { DashboardPage } from './DashboardPage';
import { AutobusesPage } from './AutobusesPage';
import { ClientesPage } from './ClientesPage';
import { UsuariosPage } from './UsuariosPage';

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
  {path: '/autobuses', label: 'Autobuses', icon: BusFront, component: AutobusesPage},
  {path: '/empresas', label: 'Clientes', icon: BriefcaseBusiness, component: ClientesPage},
  {path: '/usuarios', label: 'Usuarios', icon: UserGroup, component: UsuariosPage},
];
