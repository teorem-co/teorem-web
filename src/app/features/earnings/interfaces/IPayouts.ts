import IEarningDetails from './IEarningDetails';

interface IPayouts {
  month: string;
  details: IEarningDetails[];
  hasInvoices: boolean;
}

export default IPayouts;
