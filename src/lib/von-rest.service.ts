import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { VonHttpOptionsModel } from './model/von-http-options.model';
import {
  DeleteParams,
  GenericParams,
  GetParams,
  HeaderParams,
  PostParams,
  PutParams,
} from './model/von-rest-definition.type';

export abstract class VonRestService {
  constructor(protected http: HttpClient, protected sanitizer: DomSanitizer) {}

  protected setHeaders = (headerParams?: HeaderParams): HttpHeaders => {
    return new HttpHeaders({
      'Content-Type': headerParams?.contentType ?? 'application/json',
      Accept: headerParams?.accept ?? 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
  };

  protected setOptions = (headerParams?: HeaderParams): VonHttpOptionsModel => {
    return {
      headers: this.setHeaders(headerParams),
      params: headerParams?.params,
      withCredentials: true,
    };
  };

  protected setOptionsForFile = (
    headerParams?: HeaderParams
  ): VonHttpOptionsModel => {
    return {
      ...this.setOptions(headerParams?.params),
      headers: new HttpHeaders({
        Accept: headerParams?.accept ?? 'application/json',
        'Access-Control-Allow-Origin': '*',
      }),
    };
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

  protected authenticate = (
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

  protected get = <R = any>({
    url,
    urlParams,
    params,
  }: GetParams): Observable<R> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.get<R>(url, this.setOptions(params));
  };

  protected file = ({
    url,
    urlParams,
    params,
  }: GetParams): Observable<SafeResourceUrl> => {
    url = this.setUrlParams(url, urlParams);
    return this.http
      .get(url, {
        ...this.setOptionsForFile(params),
        responseType: 'blob' as 'json',
      })
      .pipe(
        map((res: any) => {
          const fileBlob = new Blob([res], { type: params?.contentType });
          const objUrl = URL.createObjectURL(fileBlob);
          const sanitized =
            this.sanitizer.bypassSecurityTrustResourceUrl(objUrl);
          return sanitized;
        })
      );
  };

  protected delete = <R = any>({
    url,
    urlParams,
    params,
  }: DeleteParams): Observable<R> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.delete<R>(url, this.setOptions(params));
  };

  protected post = <R = any, B = any | FormData>({
    url,
    body,
    urlParams,
    params,
  }: PostParams<B>): Observable<R> => {
    url = this.setUrlParams(url, urlParams);
    let options =
      body instanceof FormData
        ? this.setOptionsForFile(params)
        : this.setOptions(params);
    return this.http.post<R>(url, body, options);
  };

  protected put = <R = any, B = any | FormData>({
    url,
    body,
    urlParams,
    params,
  }: PutParams<B>): Observable<R> => {
    url = this.setUrlParams(url, urlParams);
    let options =
      body instanceof FormData
        ? this.setOptionsForFile(params)
        : this.setOptions(params);
    return this.http.put<R>(url, body, options);
  };

  protected patch = <R = any, B = any | FormData>({
    url,
    body,
    urlParams,
    params,
  }: PutParams<B>): Observable<R> => {
    url = this.setUrlParams(url, urlParams);
    let options =
      body instanceof FormData
        ? this.setOptionsForFile(params)
        : this.setOptions(params);
    return this.http.patch<R>(url, body, options);
  };
}
