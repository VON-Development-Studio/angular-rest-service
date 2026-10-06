import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { VonErrorRestInterceptorModel } from './models/von-error-rest-interceptor.model';

export abstract class VonRestInterceptorService implements HttpInterceptor {
  protected consoleDebug = false;
  protected errorResponseUnknown = 'Unknown Error';
  protected errorResponseForbidden = 'Forbidden Error';

  constructor(protected router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(map(this.mapEvent), catchError(this.catchError));
  }

  /**
   * Build a custom map response based on the API status code response. In case
   * it is 200 or 204, this method executes `executeBeforePipesOnSuccess`. Otherwise,
   * this method throws an `Error` with a `JSON.stringify` of the status and body.
   *
   * @param event
   * @returns
   */
  protected mapEvent = (event: HttpEvent<any>) => {
    if (event instanceof HttpResponse) {
      if (event.status === 200 || event.status === 204) {
        this.executeBeforePipesOnSuccess();
        return event;
      }

      if (event.status !== 200) {
        const error: VonErrorRestInterceptorModel = {
          status: event.status,
          message: event.statusText,
          body: event.body,
        };
        if (this.consoleDebug) {
          console.error('[ErrorWS]: ', error);
        }

        const err = new Error(JSON.stringify(error));
        throw err;
      }
    }

    return event;
  };

  /**
   * Build a custom error response based on the model `VonErrorRestInterceptorModel`
   * and throws it as an `Error` with `JSON.stringify`. Before throwing the final error
   * this method executes `executeBeforePipesOnError`.
   *
   * @param errorResponse
   * @returns
   */
  protected catchError = (errorResponse: HttpErrorResponse) => {
    if (this.consoleDebug) {
      console.error('[Fatal]: ', errorResponse);
    }

    const error: VonErrorRestInterceptorModel = {
      status: errorResponse.status,
      message: '',
      body: errorResponse.error || {},
    };

    if (errorResponse.status === 0) {
      error.message = this.errorResponseUnknown;
    }

    if (errorResponse.status === 401) {
      error.message = errorResponse.error
        ? errorResponse.error
        : this.errorResponseForbidden;
    }

    const err = new Error(JSON.stringify(error));

    this.executeBeforePipesOnError(err);

    return throwError(() => err);
  };

  protected executeBeforePipesOnSuccess = () => {};

  protected executeBeforePipesOnError = (err: Error) => {};
}
