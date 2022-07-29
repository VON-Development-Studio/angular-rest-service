import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, share, take } from 'rxjs/operators';
import { VonHttpOptionsModel } from './model/von-http-options.model';

export abstract class VonRestService {

  constructor(
    protected http: HttpClient,
    protected sanitizer: DomSanitizer
  ) { }

  private setHeaders = (contentType: string = 'application/json'): HttpHeaders => {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: contentType,
      'Access-Control-Allow-Origin': '*'
    });
  }

  private setOptions = (params?: { [key: string]: any }): VonHttpOptionsModel => {
    return {
      headers: this.setHeaders(),
      params,
      withCredentials: true
    };
  }

  private setUrlParams = (url: string, params?: { [key: string]: any }) => {
    if (params != null) {
      for (const p in params) {
        if (p != null) {
          url = url.replace(`{${p}}`, params[p]);
        }
      }
    }
    return url;
  }

  authenticate = (url: string, username: string, password: string): Observable<any> => {
    const authorization = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({
      authorization: `Basic ${authorization}`,
    });
    return this.http.get(url, {
      headers,
      withCredentials: true
    }).pipe(
      take(1),
      share()
    );
  }

  logout = (url: string): Observable<any> => {
    return this.http.delete<string>(url, this.setOptions()).pipe(
      take(1),
      share()
    );
  }

  get = <T = any>(url: string, urlParams?: any, queryParams?: any): Observable<T> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.get<T>(url, this.setOptions(queryParams));
  }

  delete = <T = any>(url: string, urlParams?: any, queryParams?: any): Observable<T> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.delete<T>(url, this.setOptions(queryParams));
  }

  post = <T = any>(url: string, body: any, urlParams?: any, queryParams?: any): Observable<T> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.post<T>(url, body, this.setOptions(queryParams));
  }

  put = <T = any>(url: string, body: any, urlParams?: any, queryParams?: any): Observable<T> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.put<T>(url, body, this.setOptions(queryParams));
  }

  patch = <T = any>(url: string, body: any, urlParams?: any, queryParams?: any): Observable<T> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.patch<T>(url, body, this.setOptions(queryParams));
  }

  private setFileOptions = (contentType: string, queryParams?: { [key: string]: any }): VonHttpOptionsModel => {
    return {
      ...this.setOptions(queryParams),
      headers: this.setHeaders(contentType),
      responseType: 'blob' as 'json'
    };
  }

  getFile = (contentType: string, url: string, urlParams?: any, queryParams?: any): Observable<SafeResourceUrl> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.get(url, this.setFileOptions(contentType, queryParams)).pipe(
      map((res: any) => {
        const fileBlob = new Blob([res], { type: contentType });
        const objUrl = URL.createObjectURL(fileBlob);
        const sanitized = this.sanitizer.bypassSecurityTrustResourceUrl(objUrl);
        return sanitized;
      })
    );
  }

  postFile = (contentType: string, url: string, body: any, urlParams?: any, queryParams?: any): Observable<any> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.post(url, body, this.setFileOptions(contentType, queryParams));
  }

  putFile = (contentType: string, url: string, body: any, urlParams?: any, queryParams?: any): Observable<any> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.put(url, body, this.setFileOptions(contentType, queryParams));
  }

  patchFile = (contentType: string, url: string, body: any, urlParams?: any, queryParams?: any): Observable<any> => {
    url = this.setUrlParams(url, urlParams);
    return this.http.patch(url, body, this.setFileOptions(contentType, queryParams));
  }

}
