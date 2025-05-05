// Path: apps/frontend/shell/src/app/services/api.service.test.ts

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { ConfigService } from '../config.service';

describe('ApiService (thin-slice)', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const fakeUrl = 'https://test.example.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: ConfigService, useValue: { apiUrl: fakeUrl } },
      ],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should instantiate and call GET /health', () => {
    const mockResp = { status: 'UP' };

    service.getHealth().subscribe(resp => expect(resp).toEqual(mockResp));

    const req = httpMock.expectOne(`${fakeUrl}/health`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResp);
  });

  it('should throw if apiUrl is missing', () => {
    // simulate missing env
    (service as any).config.apiUrl = null;
    expect(() => service.getHealth()).toThrow('API URL is undefined or null');
  });
});
