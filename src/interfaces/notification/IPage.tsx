import INotification from "./INotification";

interface IPage {
  totalPages: number,
  totalElements: number,
  last: boolean,
  number: number,
  size: number,
  content: INotification[]
}

export default IPage;
