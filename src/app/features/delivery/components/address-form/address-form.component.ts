import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import * as AddressActions from '../../store/address/address.actions';
import {
  selectSelectedAddress,
  selectSaving,
  selectUpdating,
  selectCreateError,
  selectUpdateError
} from '../../store/address/address.selectors';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  addressForm!: FormGroup;
  isEditMode = false;
  addressId: number | null = null;

  saving$: Observable<boolean>;
  updating$: Observable<boolean>;
  createError$: Observable<string | null>;
  updateError$: Observable<string | null>;

  constructor() {
    this.saving$ = this.store.select(selectSaving);
    this.updating$ = this.store.select(selectUpdating);
    this.createError$ = this.store.select(selectCreateError);
    this.updateError$ = this.store.select(selectUpdateError);
  }

  ngOnInit(): void {
    this.initForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.addressId = +id;
      this.loadAddress(this.addressId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(AddressActions.clearSelectedAddress());
  }

  initForm(): void {
    this.addressForm = this.fb.group({
      street: ['', [Validators.required, Validators.maxLength(200)]],
      city: ['', [Validators.required, Validators.maxLength(100)]],
      state: ['', Validators.maxLength(100)],
      country: ['', Validators.maxLength(100)],
      zipCode: ['', [Validators.required, Validators.maxLength(20)]],
      clientId: ['', [Validators.required, Validators.min(1)]]
    });
  }

  loadAddress(id: number): void {
    this.store.dispatch(AddressActions.loadAddress({ id }));

    this.store.select(selectSelectedAddress)
      .pipe(takeUntil(this.destroy$))
      .subscribe(address => {
        if (address) {
          this.addressForm.patchValue(address);
        }
      });
  }

  onSubmit(): void {
    if (this.addressForm.invalid) {
      this.markFormGroupTouched(this.addressForm);
      return;
    }

    const formValue = this.addressForm.value;

    if (this.isEditMode && this.addressId) {
      this.store.dispatch(AddressActions.updateAddress({
        id: this.addressId,
        address: formValue
      }));
    } else {
      this.store.dispatch(AddressActions.createAddress({
        address: formValue
      }));
    }
  }

  onCancel(): void {
    this.router.navigate(['/delivery/addresses']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper getters for template
  get street() { return this.addressForm.get('street'); }
  get city() { return this.addressForm.get('city'); }
  get state() { return this.addressForm.get('state'); }
  get country() { return this.addressForm.get('country'); }
  get zipCode() { return this.addressForm.get('zipCode'); }
  get clientId() { return this.addressForm.get('clientId'); }
}
