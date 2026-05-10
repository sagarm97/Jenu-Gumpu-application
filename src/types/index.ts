export type UserRole = 'hunter' | 'manager';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  photoURL?: string;
  totalHarvested: number;
  createdAt: string;
}

export interface Harvest {
  id: string;
  hunterId: string;
  hunterName: string;
  quantity: number;
  floralSource: string;
  location: string;
  grade: 'A' | 'B' | 'U';
  timestamp: any; // Firestore Timestamp
}

export interface MarketPrice {
  city: string;
  retail: number;
  wholesale: number;
  date: string;
}
