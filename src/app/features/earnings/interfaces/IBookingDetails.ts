import ISubject from "../../../../interfaces/ISubject";

interface IBookingDetails {
  id: string,
  subject: ISubject,
  startTime: Date,
  fullName: string,
  revenue: number,
  teoremCut: number,
  total: number
}

export default IBookingDetails;
