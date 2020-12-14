# Angular Rest Service

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.3.

## Installing

1. Add NPM package into your project:

  ```node
  npm install @von-development-studio/angular-rest-service --save
  ```

2. Create your rest service file _**RestService**_

  ```typescript
  ...
  import { VonRestService } from '@von-development-studio/angular-rest-service';
  ...

  @Injectable({
    providedIn: 'root'
  })
  export class RestService extends VonRestService {
    constructor(
      protected http: HttpClient,
      protected sanitizer: DomSanitizer
    ) {
      super(http, sanitizer);
    }
  }
  ```

2. Create your rest interceptor service file _**RestInterceptorService**_

  ```typescript
  ...
  import { VonRestInterceptorService } from '@von-development-studio/angular-rest-service';
  ...

  @Injectable({
    providedIn: 'root'
  })
  export class RestInterceptorService extends VonRestInterceptorService {
    constructor(
      protected router: Router
    ) {
      super(router);
    }
  }
  ```

<hr>

###### _[By Von Development Studio](https://www.von-development-studio.com/)_
