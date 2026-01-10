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
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(map(this.mapEvent), catchError(this.catchError));
  }

  protected mapEvent = (event: HttpEvent<any>) => {
    if (event instanceof HttpResponse) {
      if (event.status === 200 || event.status === 204) {
        this.executeBeforePipesOnSuccess();
        // TODO: Remove this call
        this.postHttpRequest();
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
        throw error;
      }
    }
    return event;
  };

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

    this.execute403Redirect();
    // TODO: Remove all this section.
    if (this.redirectOn403) {
      if (
        errorResponse.status === 403 ||
        (errorResponse.url && errorResponse.url.indexOf(this.urlWhoAmI) > -1)
      ) {
        this.router.navigate(this.redirect403Url);
      }
    }
    this.execute403Redirect();

    this.executeBeforePipesOnError();
    // TODO: Remove this call
    this.postHttpRequest();
    return throwError(error);
  };

  /**
   * Execute custom implementation before any other pipe from the subscription.
   */
  protected executeBeforePipesOnSuccess = () => {};

  /**
   * Execute custom implementation before any other pipe from the subscription.
   */
  protected executeBeforePipesOnError = () => {};

  /**
   * Execute custom implementation to redirect to 403 page based on a specific condition.
   */
  protected execute403Redirect = () => {};

  // ****
  // ****
  // ****
  // TODO: Remove all below this line
  // ****

  /**
   * @deprecated Use the new custom method execute403Redirect() to trigger redirect to 403. This property is marked to be removed.
   * TODO: Remove this property
   */
  protected urlWhoAmI = 'api/who-am-i';
  /**
   * @deprecated Use the new custom method execute403Redirect() to trigger redirect to 403. This property is marked to be removed.
   * TODO: Remove this property
   */
  protected redirectOn403 = true;
  /**
   * @deprecated Use the new custom method execute403Redirect() to trigger redirect to 403. This property is marked to be removed.
   * TODO: Remove this property
   */
  protected redirect403Url = ['403'];
  /**
   * @deprecated Use either executeBeforePipesOnSuccess() or executeBeforePipesOnError() base on your case. This method is marked to be removed.
   */
  protected postHttpRequest = () => {};
}
