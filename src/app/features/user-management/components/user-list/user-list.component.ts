import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { User } from '../../models/user';
import { Role } from '../../models/role';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private fb = inject(FormBuilder);
  router = inject(Router); // Public pour l'utiliser dans le template

  users = signal<User[]>([]);
  roles = signal<Role[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  searchForm: FormGroup;

  filteredUsers = computed(() => {
    const { search, roleId, isActive } = this.searchForm.value;
    let filtered = this.users();

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(searchLower) ||
          (user.username ? user.username.toLowerCase().includes(searchLower) : false) ||
          (user.email ? user.email.toLowerCase().includes(searchLower) : false);
      });
    }

    if (roleId) {
      filtered = filtered.filter(user => user.roleId === +roleId);
    }

    if (isActive !== null && isActive !== undefined) {
      const activeStatus = isActive === 'true' || isActive === true;
      filtered = filtered.filter(user => user.isActive === activeStatus);
    }

    return filtered;
  });

  constructor() {
    this.searchForm = this.fb.group({
      search: [''],
      roleId: [null],
      isActive: [null]
    });

    this.searchForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      // Le filtrage se fait automatiquement via computed signal
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set('Erreur lors du chargement des utilisateurs');
        console.error('Erreur:', err);
        this.loading.set(false);
      }
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        this.roles.set(roles);
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des rôles:', err);
      }
    });
  }

  resetFilters(): void {
    this.searchForm.reset({
      search: '',
      roleId: null,
      isActive: null
    });
  }

  createUser(): void {
    this.router.navigate(['/user-management/users/create']);
  }

  viewUser(user: User): void {
    this.router.navigate(['/user-management/users', user.userId]);
  }

  editUser(user: User): void {
    this.router.navigate(['/user-management/users', user.userId, 'edit']);
  }

  deleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err: any) => {
          this.error.set('Erreur lors de la suppression de l\'utilisateur');
          console.error('Erreur:', err);
        }
      });
    }
  }

  deactivateUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
      this.userService.deactivateUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err: any) => {
          this.error.set('Erreur lors de la désactivation de l\'utilisateur');
          console.error('Erreur:', err);
        }
      });
    }
  }

  activateUser(userId: number): void {
    this.userService.activateUser(userId).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err: any) => {
        this.error.set('Erreur lors de l\'activation de l\'utilisateur');
        console.error('Erreur:', err);
      }
    });
  }

  getRoleName(roleId: number): string {
    const role = this.roles().find(r => r.id === roleId);
    return role ? role.name : 'N/A';
  }
}
