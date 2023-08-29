
export default interface ITutorItem {
  id: string;
  firstName: string;
  lastName:string;
  profileImage:string;
  slug: string;
  currentOccupation: string;
  aboutTutor: string;
  minPrice: number;
  maxPrice: number;
  averageGrade: number;
  aboutLessons: string;
  completedLessons: number;
  currencyCode: string;
  subjects: string[];
}
