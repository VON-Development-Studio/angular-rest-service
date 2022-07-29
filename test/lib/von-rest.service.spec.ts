import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { of } from 'rxjs';
import { VonHttpOptionsModel } from '../../src/lib/model/von-http-options.model';
import { VonRestService } from '../../src/lib/von-rest.service';

@Injectable()
class VonRestServiceHelper extends VonRestService {
  constructor(protected http: HttpClient, protected sanitizer: DomSanitizer) {
    super(http, sanitizer);
  }
}

describe('Von Rest Service', () => {
  let service: VonRestService;
  const restResponse = { status: 200 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        VonRestServiceHelper,
        {
          provide: HttpClient, useValue: {
            get: () => of({ status: 200, method: 'GET' }),
            delete: () => of({ status: 200, method: 'DELETE' }),
            post: () => of({ status: 200, method: 'POST' }),
            put: () => of({ status: 200, method: 'PUT' }),
            patch: () => of({ status: 200, method: 'PATCH' }),
          }
        },
        {
          provide: DomSanitizer, useValue: {
            bypassSecurityTrustResourceUrl: (url: string): SafeResourceUrl => (url)
          }
        }
      ]
    });
    service = TestBed.inject(VonRestServiceHelper);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should set header with default content type', async () => {
    const expectedContentType = 'application/json';

    const header = service['setHeaders']();

    expect(header.get('Content-Type')).toBe('application/json');
    expect(header.get('Accept')).toBe(expectedContentType);
  });

  it('should set header with custom content type', async () => {
    const contentType = 'custom/text';

    const header = service['setHeaders'](contentType);

    expect(header.get('Accept')).toBe(contentType);
  });

  it('should set empty options', async () => {
    const expectedOptions: VonHttpOptionsModel = {
      withCredentials: true
    };

    const options = service['setOptions']();

    expect(options.params).toEqual(expectedOptions.params);
    expect(options.withCredentials).toBeTruthy();
  });

  it('should set options', async () => {
    const expectedOptions: VonHttpOptionsModel = {
      params: {
        test: 'test 01'
      },
      withCredentials: true
    };

    const options = service['setOptions']({
      test: 'test 01'
    });

    expect(options.params).toEqual(expectedOptions.params);
    expect(options.withCredentials).toBeTruthy();
  });

  it('should set default url params', async () => {
    const expectedUrl = '/test/without/Params';

    const url = service['setUrlParams']('/test/without/Params');

    expect(url).toEqual(expectedUrl);
  });

  it('should replace variables in url', async () => {
    const urlParam = '/test/with/{id}';
    const param = {
      id: 1
    };
    const expectedUrl = '/test/with/1';

    const url = service['setUrlParams'](urlParam, param);

    expect(url).toEqual(expectedUrl);
  });

  it('should call authenticate method', async () => {
    const url = '/api/test';
    const username = 'test';
    const password = 'test';

    const rest = service.authenticate(url, username, password);

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'GET'
      });
    });
  });

  it('should call logout method', async () => {
    const url = '/api/test';

    const rest = service.logout(url);

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'DELETE'
      });
    });
  });

  it('should call get method', async () => {
    const url = '/api/test';

    const rest = service.get(url);

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'GET'
      });
    });
  });

  it('should call post method', async () => {
    const url = '/api/test';

    const rest = service.post(url, {});

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'POST'
      });
    });
  });

  it('should call put method', async () => {
    const url = '/api/test';

    const rest = service.put(url, {});

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'PUT'
      });
    });
  });

  it('should call patch method', async () => {
    const url = '/api/test';

    const rest = service.patch(url, {});

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'PATCH'
      });
    });
  });

  it('should set file options', async () => {
    const options = service['setFileOptions']('application/pdf', {
      test: 'test 01'
    });

    expect((options.headers as any).get('Accept')).toBe('application/pdf');
    expect(options.responseType!).toBe('blob');
  });

  it('should call get file method', async () => {
    const url = '/api/test';

    const rest = service.getFile('application/pdf', url);

    rest.subscribe(() => {
      expect(true).toBeTruthy();
    });
  });

  it('should call post file method', async () => {
    const url = '/api/test';

    const rest = service.postFile('application/pdf', url, {});

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'POST'
      });
    });
  });

  it('should call put file method', async () => {
    const url = '/api/test';

    const rest = service.putFile('application/pdf', url, {});

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'PUT'
      });
    });
  });

  it('should call patch file method', async () => {
    const url = '/api/test';

    const rest = service.patchFile('application/pdf', url, {});

    rest.subscribe((response: any) => {
      expect(response).toEqual({
        ...restResponse,
        method: 'PATCH'
      });
    });
  });

});
