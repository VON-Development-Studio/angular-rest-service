import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VonErrorRestInterceptorModel } from './model/von-error-rest-interceptor.model';

export abstract class VonRestInterceptorService implements HttpInterceptor {

  protected consoleDebug = false;
  protected errorResponseUnknown = 'Unknown Error';
  protected errorResponseForbidden = 'Forbidden Error';
  protected urlWhoAmI = 'api/who-am-i';

  constructor(
    protected router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(

      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === 200 || event.status === 204) {
            return event;
          }
          if (event.status !== 200) {
            const error: VonErrorRestInterceptorModel = {
              status: event.status,
              message: event.statusText
            };
            if (this.consoleDebug) {
              console.error('[ErrorWS]: ', error);
            }
            throw error;
          }
        }
        return event;
      }),

      catchError((errorResponse: HttpErrorResponse) => {
        if (this.consoleDebug) {
          console.error('[Fatal]: ', errorResponse);
        }
        const error: VonErrorRestInterceptorModel = {
          status: errorResponse.status,
          message: ''
        };
        if (errorResponse.status === 0) {
          error.message = this.errorResponseUnknown;
        }
        if (errorResponse.status === 401) {
          error.message = errorResponse.error ? errorResponse.error : this.errorResponseForbidden;
        }
        if (errorResponse.status === 403 || (errorResponse.url && errorResponse.url.indexOf(this.urlWhoAmI) > -1)) {
          this.router.navigate(['403']);
        }
        return throwError(error);
      })
    );
  }

}
