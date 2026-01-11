
export interface Role {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface createRoleDto {
  name: string;
}

export interface updateRoleDto {
  name?: string;
}
