import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.css']
})
export class RoleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roleForm!: FormGroup;
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  isEditMode = signal<boolean>(false);
  roleId: number | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.roleId = parseInt(id);
      this.isEditMode.set(true);
      this.loadRole(this.roleId);
    }
  }

  private loadRole(id: number): void {
    this.loading.set(true);
    this.roleService.getRoleById(id).subscribe({
      next: (role) => {
        this.roleForm.patchValue({
          name: role.name
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du rôle');
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formData = this.roleForm.value;

    const request = this.isEditMode()
      ? this.roleService.updateRole(this.roleId!, formData)
      : this.roleService.createRole(formData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/user-management/roles']);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/user-management/roles']);
  }

  get name() {
    return this.roleForm.get('name')!;
  }
}
