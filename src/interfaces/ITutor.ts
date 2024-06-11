import IBooking from '../app/features/my-bookings/interfaces/IBooking';
import ITutorSubjectLevel from './ITutorSubjectLevel';
import IUser from './IUser';

export default interface ITutor {
  userId: string;
  currentOccupation: string;
  yearsOfExperience: string;
  aboutTutor: string;
  aboutLessons: string;
  User: IUser;
  TutorSubjects: ITutorSubjectLevel[];
  minimumPrice: number;
  maximumPrice: number;
  averageGrade: number;
  completedLessons: number;
  Bookings: IBooking[];
  disabled: boolean;
  slug: string;
  numberOfGrades?: number;
  videoUrl?: string;
  idVerified?: boolean;
  verified?: boolean; // did admin verify
  stripeDocumentsUploaded?: boolean;
}
