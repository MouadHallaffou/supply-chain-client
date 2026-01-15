import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change: string;
  trend: 'up' | 'down';
  route: string;
}

interface RecentActivity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  stats = signal<StatCard[]>([
    {
      title: 'Utilisateurs',
      value: 45,
      icon: 'bi-people',
      color: 'primary',
      change: '+12%',
      trend: 'up',
      route: '/user-management/users'
    },
    {
      title: 'Fournisseurs',
      value: 23,
      icon: 'bi-truck',
      color: 'success',
      change: '+5%',
      trend: 'up',
      route: '/inventory/fournisseurs'
    },
    {
      title: 'Matières Premières',
      value: 156,
      icon: 'bi-archive',
      color: 'warning',
      change: '-3%',
      trend: 'down',
      route: '/inventory/matieres-premieres'
    },
    {
      title: 'Commandes en cours',
      value: 12,
      icon: 'bi-cart',
      color: 'info',
      change: '+8%',
      trend: 'up',
      route: '/inventory/commandes-fournisseurs'
    }
  ]);

}
