import { HeaderParams } from './von-header-params.model';

export interface GenericParams {
  [key: string]: any;
}

export interface BaseParams {
  url: string;
  urlParams?: GenericParams;
  queryParams?: GenericParams;
  headerParams?: HeaderParams;

  /**
   * @deprecated Use headerParams instead
   */
  header?: HeaderParams;
  /**
   * @deprecated Use queryParams instead
   */
  params?: GenericParams;
}

export type BodyParams<B = GenericParams | FormData> = BaseParams & {
  body?: B;
};
