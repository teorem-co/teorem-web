import IBooking from "../../my-bookings/interfaces/IBooking";

interface InvoiceDetails {
  month: string;
  students: number;
  bookings: IBooking[]
}

export default InvoiceDetails;
