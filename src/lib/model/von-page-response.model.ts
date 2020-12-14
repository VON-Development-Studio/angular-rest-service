export interface VonPageResponseModel<T> {
  content: T[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  numberOfElements: number;
  number: number;
}
