import INotification from "./INotification";

// interface IPage {
//   totalPages: number,
//   totalElements: number,
//   last: boolean,
//   number: number,
//   size: number,
//   content: INotification[]
// }

interface IPage<T> {
  totalPages: number;
  totalElements: number;
  last: boolean;
  number: number;
  size: number;
  content: T[];
}

export default IPage;
