// Base API response structure - DO NOT MODIFY
export type ApiResponse<T = unknown> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};
// MLS ProAdmin Application Types
export type UserRole = 'Level 1' | 'Level 2' | 'Level 3';
export interface User {
  id: string;
  username: string;
  password?: string; // Password should be optional on the frontend
  role: UserRole;
  createdAt: string;
}
export interface Sponsor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  status: 'Active' | 'Inactive';
}
export interface Center {
  id: string;
  name: string;
  location: string;
  primaryContact: string;
  status: 'Active' | 'Inactive';
}
export interface Researcher {
  id: string;
  name: string;
  specialty: string;
  centerId: string;
  email: string;
}
export interface ProjectCode {
  id: string;
  code: string;
  description: string;
  sponsorId: string;
  status: 'Ongoing' | 'Completed' | 'On Hold';
}
export interface WorkPerformed {
  id: string;
  name: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}
export interface SdcTrackingEntry {
  id: string;
  sdcPersonnelFirstName: string;
  sdcPersonnelLastName: string;
  patientCode: string;
  date: string; // YYYY-MM-DD
  sponsorId: string;
  centerId: string;
  researcherId: string;
  projectCodeId: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  createdBy: string; // User ID
}
export interface SdcWorkPerformedItem {
  id: string;
  sdcTrackingEntryId: string;
  name: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  notes: string;
}
export type DefinitionEntity = Sponsor | Center | Researcher | ProjectCode | WorkPerformed | SdcTrackingEntry | SdcWorkPerformedItem;