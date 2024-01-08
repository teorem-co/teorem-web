import IBookingDetails from "./IBookingDetails";

interface InvoiceDetails {
  month: string;
  numOfStudents: number;
  revenue: number;
  teoremCut: number;
  total: number;
  bookings: IBookingDetails[]
}

export default InvoiceDetails;
