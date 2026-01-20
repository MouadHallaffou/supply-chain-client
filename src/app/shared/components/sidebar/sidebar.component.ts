import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isCollapsed = false;

  menuItems = signal<MenuItem[]>([
    {
      label: 'Dashboard',
      icon: 'bi-speedometer2',
      route: '/dashboard'
    },
    {
      label: 'Gestion Utilisateurs',
      icon: 'bi-people',
      expanded: false,
      children: [
        {
          label: 'Utilisateurs',
          icon: 'bi-person',
          route: '/user-management/users'
        },
        {
          label: 'Rôles',
          icon: 'bi-shield-lock',
          route: '/user-management/roles'
        }
      ]
    },
    {
      label: 'Approvisionnement',
      icon: 'bi-box-seam',
      expanded: false,
      children: [
        {
          label: 'Fournisseurs',
          icon: 'bi-truck',
          route: '/inventory/fournisseurs'
        },
        {
          label: 'Matières Premières',
          icon: 'bi-archive',
          route: '/inventory/matieres-premieres'
        },
        {
          label: 'Commandes Fournisseurs',
          icon: 'bi-cart',
          route: '/inventory/commandes-fournisseurs'
        }
      ]
    },
    {
      label: 'Production',
      icon: 'bi-gear',
      expanded: false,
      children: [
        {
          label: 'Produits',
          icon: 'bi-box',
          route: '/products'
        },
        {
          label: 'Ordres de Production',
          icon: 'bi-clipboard-check',
          route: '/product-orders'
        },
        {
          label: 'bill of Materials',
          icon: 'bi-list-ul',
          route: '/bill-of-materials'
        }
      ]
    },
    {
      label: 'Livraison',
      icon: 'bi-truck',
      route: '/delivery',
      expanded: false
    },
    {
      label: 'Rapports',
      icon: 'bi-graph-up',
      route: '/reports'
    },
    {
      label: 'Paramètres',
      icon: 'bi-gear-fill',
      route: '/settings'
    }
  ]);

  toggleSubmenu(item: MenuItem) {
    if (item.children) {
      item.expanded = !item.expanded;
      this.menuItems.update(items => [...items]);
    }
  }
}
