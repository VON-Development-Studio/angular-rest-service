import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VonRestService } from '../../src/lib/von-rest.service';
import { VonHttpOptionsModel } from './models/von-http-options.model';

@Injectable()
class VonRestServiceHelper extends VonRestService {
  constructor(override http: HttpClient, override sanitizer: DomSanitizer) {
    super(http, sanitizer);
  }
}

describe('Von Rest Service', () => {
  let service: VonRestService;
  let httpTestingController: HttpTestingController;
  const restResponse = { status: 200 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        VonRestServiceHelper,
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustResourceUrl: (url: string): SafeResourceUrl =>
              url,
          },
        },
      ],
    });
    service = TestBed.inject(VonRestServiceHelper);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should set header with default content type', async () => {
    const defaultContentType = 'application/json';

    const header = service['setHeaders']();

    expect(header.get('Content-Type')).toBe(defaultContentType);
    expect(header.get('Accept')).toBe(defaultContentType);
  });

  it('should set header with custom content type', async () => {
    const accept = 'custom/text';

    const header = service['setHeaders']({ accept });

    expect(header.get('Content-Type')).toBe('application/json');
    expect(header.get('Accept')).toBe(accept);
  });

  it('should set empty options', async () => {
    const expectedOptions: VonHttpOptionsModel = {
      withCredentials: true,
    };

    const options = service['setOptions']();

    expect(options.params).toEqual(expectedOptions.params);
    expect(options.withCredentials).toBeTruthy();
  });

  it('should set options', async () => {
    const expectedOptions: VonHttpOptionsModel = {
      params: {
        test: 'test 01',
      },
      withCredentials: true,
    };

    const options = service['setOptions']({
      queryParams: { test: 'test 01' },
    });

    expect(options.params).toEqual(expectedOptions.params);
    expect(options.withCredentials).toBeTruthy();
  });

  it('should set empty file options', async () => {
    const expectedOptions: VonHttpOptionsModel = {
      withCredentials: true,
    };

    const options = service['setOptionsForFile']();

    expect(options.params).toEqual(expectedOptions.params);
    expect(options.withCredentials).toBeTruthy();
  });

  it('should set file options', async () => {
    const options = service['setOptionsForFile']({
      headerParams: {
        accept: 'application/pdf',
        responseType: 'blob' as 'json',
      },
      queryParams: {
        test: 'test 01',
      },
    });

    expect((options.headers as any).get('Accept')).toBe('application/pdf');
    expect(options.responseType!).toBe('blob');
  });

  it('should set default url params', async () => {
    const expectedUrl = '/test/without/Params';

    const url = service['setUrlParams']('/test/without/Params');

    expect(url).toEqual(expectedUrl);
  });

  it('should replace variables in url', async () => {
    const expectedUrl = '/test/with/1';

    const urlParam = '/test/with/{id}';
    const param = {
      id: 1,
    };
    const url = service['setUrlParams'](urlParam, param);

    expect(url).toEqual(expectedUrl);
  });

  it('should call authenticate method', async () => {
    const url = '/api/test/auth';
    const username = 'test';
    const password = 'test';

    const rest = service['authenticate'](url, username, password);

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'AUTHENTICATE',
      });
    });

    const req = httpTestingController.expectOne('/api/test/auth');
    expect(req.request.method).toEqual('GET');
    req.flush({ status: 200, method: 'AUTHENTICATE' });
  });

  it('should call get method', async () => {
    const url = '/api/test/get';

    const rest = service['get']({ url });

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'GET',
      });
    });

    const req = httpTestingController.expectOne('/api/test/get');
    expect(req.request.method).toEqual('GET');
    req.flush({ status: 200, method: 'GET' });
  });

  it('should call delete method', async () => {
    const url = '/api/test/delete';

    const rest = service['delete']({ url });

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'DELETE',
      });
    });

    const req = httpTestingController.expectOne('/api/test/delete');
    expect(req.request.method).toEqual('DELETE');
    req.flush({ status: 200, method: 'DELETE' });
  });

  it('should call post method', async () => {
    const url = '/api/test/post';

    const rest = service['post']({ url });

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'POST',
      });
    });

    const req = httpTestingController.expectOne('/api/test/post');
    expect(req.request.method).toEqual('POST');
    req.flush({ status: 200, method: 'POST' });
  });

  it('should call put method', async () => {
    const url = '/api/test/put';

    const rest = service['put']({ url });

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'PUT',
      });
    });

    const req = httpTestingController.expectOne('/api/test/put');
    expect(req.request.method).toEqual('PUT');
    req.flush({ status: 200, method: 'PUT' });
  });

  it('should call patch method', async () => {
    const url = '/api/test/patch';

    const rest = service['patch']({ url });

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'PATCH',
      });
    });

    const req = httpTestingController.expectOne('/api/test/patch');
    expect(req.request.method).toEqual('PATCH');
    req.flush({ status: 200, method: 'PATCH' });
  });

  it('should call file method', async () => {
    const url = '/api/test/file';

    const rest = service['file']({ url });

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'GET',
      });
    });

    const req = httpTestingController.expectOne('/api/test/file');
    expect(req.request.method).toEqual('GET');
    req.flush({ status: 200, method: 'GET' });
  });
});
