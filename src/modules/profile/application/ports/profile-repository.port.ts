import {
  CreateProfileData,
  ProfileRecord,
  UpdateProfileData,
} from '../types/profile.types';

export const PROFILE_REPOSITORY = Symbol('PROFILE_REPOSITORY');

export interface ProfileRepositoryPort {
  create(data: CreateProfileData): Promise<ProfileRecord>;
  findById(id: string): Promise<ProfileRecord | null>;
  update(
    id: string,
    data: UpdateProfileData,
  ): Promise<ProfileRecord | null>;
}
