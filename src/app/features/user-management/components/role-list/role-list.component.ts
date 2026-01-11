import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  private roleService = inject(RoleService);
  private router = inject(Router);

  roles = signal<Role[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading.set(true);
    this.error.set(null);

    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des rôles');
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  createRole(): void {
    this.router.navigate(['/user-management/roles/create']);
  }

  editRole(role: Role): void {
    this.router.navigate(['/user-management/roles', role.id, 'edit']);
  }

  deleteRole(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rôle ?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => {
          this.loadRoles();
        },
        error: (err) => {
          this.error.set('Erreur lors de la suppression du rôle');
          console.error(err);
        }
      });
    }
  }

  backToUsers(): void {
    this.router.navigate(['/user-management/users']);
  }
}
