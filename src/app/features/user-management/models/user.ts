import {Role} from './role';

export interface User {
  userId?: number;
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  password?: string;
  isActive: boolean;
  isDeleted: boolean;
  roleId: number;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  roleId?: number;
}

export interface AuthResponse<T> {
  success: boolean;
  data: T,
  message?: string;
  error?: string;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED'
}
