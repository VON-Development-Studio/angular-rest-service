import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { HeaderParams } from './models/von-header-params.model';
import { VonHttpOptionsModel } from './models/von-http-options.model';
import {
  BaseParams,
  BodyParams,
  GenericParams,
} from './models/von-rest-definition.model';

/**
 * Rest service wrapper for API calls. This class needs to be extended in a `@Injectable({ providedIn: 'root' })` service.
 * Parameters needed:
 * @HttpClient
 * @DomSanitizer
 */
export abstract class VonRestService {
  constructor(protected http: HttpClient, protected sanitizer: DomSanitizer) {}

  /**
   * Allows to set the default headers
   * @param headerParams Check HeaderParams interface to verify allowed overrides
   * @returns
   * ```json
   * {
   *   "Content-Type": "application/json",
   *   "Accept": "application/json",
   *   "Access-Control-Allow-Origin": "*"
   * }
   * ```
   */
  protected setHeaders = (headerParams?: HeaderParams): HttpHeaders => {
    return new HttpHeaders({
      'Content-Type': headerParams?.contentType ?? 'application/json',
      Accept: headerParams?.accept ?? 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
  };

  protected setOptions = ({
    headerParams,
    queryParams: params,
  }: {
    headerParams?: HeaderParams;
    queryParams?: GenericParams;
  } = {}): VonHttpOptionsModel => {
    const options: VonHttpOptionsModel = {
      headers: this.setHeaders(headerParams),
      params,
      withCredentials: true,
    };
    if (headerParams?.responseType) {
      options.responseType = headerParams.responseType;
    }
    return options;
  };

  protected setOptionsForFile = ({
    headerParams,
    queryParams,
  }: {
    headerParams?: HeaderParams;
    queryParams?: GenericParams;
  } = {}): VonHttpOptionsModel => {
    const options: VonHttpOptionsModel = {
      ...this.setOptions({
        headerParams,
        queryParams,
      }),
      headers: new HttpHeaders({
        Accept: headerParams?.accept ?? 'application/json',
        'Access-Control-Allow-Origin': '*',
      }),
    };
    if (headerParams?.responseType) {
      options.responseType = headerParams.responseType;
    }
    return options;
  };

  protected setUrlParams = (url: string, params?: GenericParams) => {
    if (params != null) {
      for (const p in params) {
        if (p != null) {
          url = url.replace(`{${p}}`, params[p]);
        }
      }
    }
    return url;
  };

  authenticate = (
    url: string,
    username: string,
    password: string
  ): Observable<any> => {
    const authorization = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({
      authorization: `Basic ${authorization}`,
    });
    return this.http
      .get(url, {
        headers,
        withCredentials: true,
      })
      .pipe(take(1), share());
  };

  get = <R = any>({
    url,
    urlParams,
    queryParams: params,
    headerParams,
    header: oldHeaderParams,
    params: oldParams,
  }: BaseParams): Observable<R> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.get<R>(
      url,
      this.setOptions({
        headerParams: {
          ...headerParams,
          ...oldHeaderParams,
        },
        queryParams: {
          ...params,
          ...oldParams,
        },
      })
    );
  };

  delete = <R = any>({
    url,
    urlParams,
    queryParams: params,
    headerParams,
    header: oldHeaderParams,
    params: oldParams,
  }: BaseParams): Observable<R> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.delete<R>(
      url,
      this.setOptions({
        headerParams: {
          ...headerParams,
          ...oldHeaderParams,
        },
        queryParams: {
          ...params,
          ...oldParams,
        },
      })
    );
  };

  post = <R = any, B = GenericParams | FormData>({
    url,
    body,
    urlParams,
    queryParams: params,
    headerParams,
    header: oldHeaderParams,
    params: oldParams,
  }: BodyParams<B>): Observable<R> => {
    url = this.setUrlParams(url, urlParams);
    const optionsParams = {
      headerParams: {
        ...headerParams,
        ...oldHeaderParams,
      },
      queryParams: {
        ...params,
        ...oldParams,
      },
    };
    let options =
      body && body instanceof FormData
        ? this.setOptionsForFile(optionsParams)
        : this.setOptions(optionsParams);
    return this.http.post<R>(url, body, options);
  };

  put = <R = any, B = GenericParams | FormData>({
    url,
    body,
    urlParams,
    queryParams: params,
    headerParams,
    header: oldHeaderParams,
    params: oldParams,
  }: BodyParams<B>): Observable<R> => {
    url = this.setUrlParams(url, urlParams);
    const optionsParams = {
      headerParams: {
        ...headerParams,
        ...oldHeaderParams,
      },
      queryParams: {
        ...params,
        ...oldParams,
      },
    };
    let options =
      body && body instanceof FormData
        ? this.setOptionsForFile(optionsParams)
        : this.setOptions(optionsParams);
    return this.http.put<R>(url, body, options);
  };

  patch = <R = any, B = GenericParams | FormData>({
    url,
    body,
    urlParams,
    queryParams: params,
    headerParams,
    header: oldHeaderParams,
    params: oldParams,
  }: BodyParams<B>): Observable<R> => {
    url = this.setUrlParams(url, urlParams);
    const optionsParams = {
      headerParams: {
        ...headerParams,
        ...oldHeaderParams,
      },
      queryParams: {
        ...params,
        ...oldParams,
      },
    };
    let options =
      body && body instanceof FormData
        ? this.setOptionsForFile(optionsParams)
        : this.setOptions(optionsParams);
    return this.http.patch<R>(url, body, options);
  };

  file = ({
    url,
    urlParams,
    queryParams: params,
    headerParams,
    header: oldHeaderParams,
    params: oldParams,
  }: BaseParams): Observable<SafeResourceUrl> => {
    url = this.setUrlParams(url, urlParams);
    return this.http
      .get(url, {
        ...this.setOptionsForFile({
          headerParams: {
            ...headerParams,
            ...oldHeaderParams,
          },
          queryParams: {
            ...params,
            ...oldParams,
          },
        }),
        responseType: 'blob' as 'json',
      })
      .pipe(
        map((res: any) => {
          const fileBlob = new Blob([res], { type: params?.['contentType'] });
          const objUrl = URL.createObjectURL(fileBlob);
          const sanitized =
            this.sanitizer.bypassSecurityTrustResourceUrl(objUrl);
          return sanitized;
        })
      );
  };
}
