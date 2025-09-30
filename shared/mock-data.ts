import { User, Sponsor, Center, Researcher, ProjectCode, WorkPerformed, SdcTrackingEntry, SdcWorkPerformedItem } from './types';
// MLS ProAdmin Mock Data
export const MOCK_USERS: User[] = [
  { id: 'user-001', username: 'MLS', password: '2008', role: 'Level 3', createdAt: '2023-01-15T10:00:00Z' },
  { id: 'user-002', username: 'admin_user', password: 'password123', role: 'Level 2', createdAt: '2023-02-20T11:30:00Z' },
  { id: 'user-003', username: 'normal_user', password: 'password123', role: 'Level 1', createdAt: '2023-03-10T09:00:00Z' },
  { id: 'user-004', username: 'jane.doe', password: 'password123', role: 'Level 2', createdAt: '2023-04-05T14:20:00Z' },
  { id: 'user-005', username: 'john.smith', password: 'password123', role: 'Level 1', createdAt: '2023-05-12T16:45:00Z' },
  { id: 'user-006', username: 'sara.jones', password: 'password123', role: 'Level 1', createdAt: '2023-06-18T08:15:00Z' },
];
export const MOCK_SPONSORS: Sponsor[] = [
  { id: 'sp-001', name: 'Global Health Inc.', contactPerson: 'Dr. Emily Carter', email: 'ecarter@gh.com', status: 'Active' },
  { id: 'sp-002', name: 'BioInnovate Labs', contactPerson: 'Dr. Ben Schiller', email: 'ben.s@bioinnovate.com', status: 'Active' },
  { id: 'sp-003', name: 'PharmaCore', contactPerson: 'Alice Johnson', email: 'alice.j@pharmacore.co', status: 'Inactive' },
  { id: 'sp-004', name: 'MedTech Solutions', contactPerson: 'Robert Brown', email: 'r.brown@medtech.io', status: 'Active' },
];
export const MOCK_CENTERS: Center[] = [
  { id: 'ctr-001', name: 'Downtown Research Center', location: 'New York, NY', primaryContact: 'Dr. Michael Lee', status: 'Active' },
  { id: 'ctr-002', name: 'West Coast Clinical', location: 'San Francisco, CA', primaryContact: 'Dr. Susan Wu', status: 'Active' },
  { id: 'ctr-003', name: 'Midwest Medical Hub', location: 'Chicago, IL', primaryContact: 'Dr. David Chen', status: 'Inactive' },
];
export const MOCK_RESEARCHERS: Researcher[] = [
  { id: 'res-001', name: 'Dr. Olivia Chen', specialty: 'Oncology', centerId: 'ctr-001', email: 'olivia.chen@drc.org' },
  { id: 'res-002', name: 'Dr. Liam Goldberg', specialty: 'Cardiology', centerId: 'ctr-002', email: 'liam.g@wcc.org' },
  { id: 'res-003', name: 'Dr. Ava Nguyen', specialty: 'Neurology', centerId: 'ctr-001', email: 'ava.nguyen@drc.org' },
  { id: 'res-004', name: 'Dr. Noah Patel', specialty: 'Immunology', centerId: 'ctr-003', email: 'noah.p@mmh.org' },
];
export const MOCK_PROJECT_CODES: ProjectCode[] = [
  { id: 'pc-001', code: 'ONC-2024-01', description: 'Phase III Oncology Trial', sponsorId: 'sp-001', status: 'Ongoing' },
  { id: 'pc-002', code: 'CARD-2023-05', description: 'Cardiovascular Device Study', sponsorId: 'sp-004', status: 'Completed' },
  { id: 'pc-003', code: 'NEURO-2024-02', description: 'Alzheimer\'s Research Initiative', sponsorId: 'sp-002', status: 'Ongoing' },
  { id: 'pc-004', code: 'IMM-2023-11', description: 'Autoimmune Disorder Study', sponsorId: 'sp-001', status: 'On Hold' },
];
export const MOCK_WORK_PERFORMED: WorkPerformed[] = [
  { id: 'wp-001', name: 'Initial Patient Screening', description: 'Screening of first 50 patients for ONC-2024-01.', status: 'Completed' },
  { id: 'wp-002', name: 'Data Analysis - Phase 1', description: 'Analysis of initial data from CARD-2023-05.', status: 'Completed' },
  { id: 'wp-003', name: 'Lab Sample Processing', description: 'Processing samples for NEURO-2024-02.', status: 'In Progress' },
  { id: 'wp-004', name: 'Regulatory Submission Prep', description: 'Preparing documents for FDA submission.', status: 'Pending' },
];
export const MOCK_SDC_TRACKING_ENTRIES: SdcTrackingEntry[] = [
    { id: 'sdc-001', sdcPersonnelFirstName: 'Alice', sdcPersonnelLastName: 'Williams', patientCode: 'P001', date: '2024-05-20', sponsorId: 'sp-001', centerId: 'ctr-001', researcherId: 'res-001', projectCodeId: 'pc-001', startTime: '09:00', endTime: '12:30', createdBy: 'user-002' },
    { id: 'sdc-002', sdcPersonnelFirstName: 'Bob', sdcPersonnelLastName: 'Brown', patientCode: 'P002', date: '2024-05-21', sponsorId: 'sp-002', centerId: 'ctr-001', researcherId: 'res-003', projectCodeId: 'pc-003', startTime: '13:00', endTime: '17:00', createdBy: 'user-004' },
    { id: 'sdc-003', sdcPersonnelFirstName: 'Charlie', sdcPersonnelLastName: 'Davis', patientCode: 'P003', date: '2024-05-22', sponsorId: 'sp-004', centerId: 'ctr-002', researcherId: 'res-002', projectCodeId: 'pc-002', startTime: '10:15', endTime: '15:45', createdBy: 'user-002' },
];
export const MOCK_SDC_WORK_PERFORMED_ITEMS: SdcWorkPerformedItem[] = [
    { id: 'sdc-wp-001', sdcTrackingEntryId: 'sdc-001', name: 'Patient Vitals Check', startTime: '09:00', endTime: '09:15', notes: 'Blood pressure and heart rate.' },
    { id: 'sdc-wp-002', sdcTrackingEntryId: 'sdc-001', name: 'Document Review', startTime: '09:15', endTime: '11:00', notes: 'Reviewed patient history.' },
    { id: 'sdc-wp-003', sdcTrackingEntryId: 'sdc-001', name: 'Data Entry', startTime: '11:00', endTime: '12:30', notes: 'Entered vitals into system.' },
    { id: 'sdc-wp-004', sdcTrackingEntryId: 'sdc-002', name: 'Sample Collection', startTime: '13:00', endTime: '14:00', notes: 'Collected blood samples.' },
];