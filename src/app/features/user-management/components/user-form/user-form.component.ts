import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';
import { RoleModel } from '../../models/role.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm!: FormGroup;
  roles = signal<RoleModel[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  isEditMode = signal<boolean>(false);
  userId: string | null = null;

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoles();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      roleId: [null, Validators.required],
      isActive: [true],
      isDeleted: [false]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private checkEditMode(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditMode.set(true);
      this.loadUser(this.userId);
      // Rendre le mot de passe optionnel en mode édition
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('confirmPassword')?.updateValueAndValidity();
      this.userForm.get('roleId')?.clearValidators();
      this.userForm.get('isActive')?.clearValidators();
      this.userForm.get('isActive')?.updateValueAndValidity();
    }
  }

  private loadUser(id: string): void {
    this.loading.set(true);
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roleId: user.roleId,
          isActive: user.isActive,
          isDeleted: user.isDeleted
        });
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement de l\'utilisateur');
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  private loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles.set(roles);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des rôles:', err);
      }
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const formData = { ...this.userForm.value };
    delete formData.confirmPassword;

    // Si en mode édition et pas de nouveau mot de passe, ne pas l'envoyer
    if (this.isEditMode() && !formData.password) {
      delete formData.password;
    }

    const request = this.isEditMode()
      ? this.userService.updateUser(this.userId!, formData)
      : this.userService.createUser(formData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/user-management/users']);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/user-management/users']);
  }

  // Getters pour accéder aux contrôles du formulaire
  get firstName() {
    return this.userForm.get('firstName')!;
  }

  get lastName() {
    return this.userForm.get('lastName')!;
  }

  get email() {
    return this.userForm.get('email')!;
  }

  get password() {
    return this.userForm.get('password')!;
  }

  get confirmPassword() {
    return this.userForm.get('confirmPassword')!;
  }

  get roleId() {
    return this.userForm.get('roleId')!;
  }

}
