import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserService} from '../user-management/services/user.service';
import {FournisseurService} from '../inventory/services/fournisseur.service';
import {MatierePremiereService} from '../inventory/services/matiere-premiere.service';
import {CommandeFournisseurService} from '../inventory/services/commande-fournisseur.service';

interface StatCard {
  title: string;
  value: any;
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
  private readonly userService = inject(UserService);
  private readonly fournisseurService = inject(FournisseurService);
  private readonly MP = inject(MatierePremiereService);
  private readonly CF = inject(CommandeFournisseurService);

  stats = signal<StatCard[]>([
    {
      title: 'Utilisateurs',
      value: 0,
      icon: 'bi-people',
      color: 'primary',
      change: '+12%',
      trend: 'up',
      route: '/user-management/users'
    },
    {
      title: 'Fournisseurs',
      value: 0,
      icon: 'bi-truck',
      color: 'success',
      change: '+5%',
      trend: 'up',
      route: '/inventory/fournisseurs'
    },
    {
      title: 'Matières Premières',
      value: 0,
      icon: 'bi-archive',
      color: 'warning',
      change: '-3%',
      trend: 'down',
      route: '/inventory/matieres-premieres'
    },
    {
      title: 'Commandes en cours',
      value: 0,
      icon: 'bi-cart',
      color: 'info',
      change: '+8%',
      trend: 'up',
      route: '/inventory/commandes-fournisseurs'
    }
  ]);

  constructor() {
    this.loadUserCount();
    this.loadFournisseurCount();
    this.loadMatierePremiereCount();
    this.loadCommandesEnCoursCount();
  }

  private loadUserCount(): void {
    this.userService.getUsers().subscribe(users => {
      const updatedStats = this.stats().map(stat =>
        stat.title === 'Utilisateurs'
          ? { ...stat, value: users.length }
          : stat
      );
      this.stats.set(updatedStats);
    });
  }
  private loadFournisseurCount(): void {
    this.fournisseurService.getAll().subscribe(fournisseurs => {
      const updatedStats = this.stats().map(stat =>
        stat.title === 'Fournisseurs'
          ? { ...stat, value: fournisseurs.length }
          : stat
      );
      this.stats.set(updatedStats);
    });
  }

  private loadMatierePremiereCount(): void {
    this.MP.getAll().subscribe(matieres => {
      const updatedStats = this.stats().map(stat =>
        stat.title === 'Matières Premières'
          ? { ...stat, value: matieres.totalElements }
          : stat
      );
      this.stats.set(updatedStats);
    });
  }

  private loadCommandesEnCoursCount(): void {
    this.CF.getAll().subscribe(commandes => {
      const commandesEnCours = commandes.content.filter((cmd: any) => cmd.status === 'EN_COURS').length;
      const updatedStats = this.stats().map(stat =>
        stat.title === 'Commandes en cours'
          ? { ...stat, value: commandesEnCours }
          : stat
      );
      this.stats.set(updatedStats);
    });
  }

}
