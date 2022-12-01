export interface GenericParams {
  [key: string]: any | undefined | null;
}

export type HeaderParams = {
  contentType?: string;
  accept?: string;
  responseType?: 'json';
};

export interface BaseParams {
  url: string;
  urlParams?: GenericParams;
  params?: GenericParams;
  header?: HeaderParams;
}

export type GetParams = BaseParams;

export type DeleteParams = BaseParams;

export type PostParams<B = any | FormData> = BaseParams & { body?: B };

export type PutParams<B = any | FormData> = BaseParams & { body?: B };

export type PatchParams<B = any | FormData> = BaseParams & { body?: B };
