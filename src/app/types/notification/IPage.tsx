
interface IPage<T> {
  totalPages: number;
  totalElements: number;
  last: boolean;
  number: number;
  size: number;
  content: T[];
}

export default IPage;
