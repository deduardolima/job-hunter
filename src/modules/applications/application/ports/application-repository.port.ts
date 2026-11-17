import type {
  ApplicationRecord,
  CreateApplicationData,
  UpdateApplicationData,
} from '../types/application.types';

export const APPLICATION_REPOSITORY = Symbol('APPLICATION_REPOSITORY');

export interface ApplicationRepositoryPort {
  create(data: CreateApplicationData): Promise<ApplicationRecord>;
  findAll(): Promise<ApplicationRecord[]>;
  findById(id: string): Promise<ApplicationRecord | null>;
  update(
    id: string,
    data: UpdateApplicationData,
  ): Promise<ApplicationRecord | null>;
  delete(id: string): Promise<boolean>;
}
