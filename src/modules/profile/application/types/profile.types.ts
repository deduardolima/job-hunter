export interface ProfileRecord {
  id: string;
  fullName: string;
  professionalTitle: string | null;
  summary: string | null;
  location: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateProfileData = Omit<
  ProfileRecord,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateProfileData = Partial<CreateProfileData>;