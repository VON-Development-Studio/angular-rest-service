export interface GenericParams {
  [key: string]: any;
}

export type HeaderParams = {
  contentType?: string;
  accept?: string;
} & { params?: GenericParams };

export interface BaseParams {
  url: string;
  urlParams?: GenericParams;
  params?: HeaderParams;
}

export type GetParams = BaseParams;

export type DeleteParams = BaseParams;

export type PostParams<B = any | FormData> = BaseParams & { body: B };

export type PutParams<B = any | FormData> = BaseParams & { body: B };

export type PatchParams<B = any | FormData> = BaseParams & { body: B };
