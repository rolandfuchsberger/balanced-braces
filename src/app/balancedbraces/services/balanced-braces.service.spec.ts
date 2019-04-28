import { EnvService } from './../../services/env.service';
import { TestBed, async, getTestBed } from '@angular/core/testing';

import { BalancedBracesService } from './balanced-braces.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Type } from '@angular/core';


describe('BalancedBracesService', () => {

  //  constructor(private env: EnvService, private http: HttpClient) { }

  const envServiceMock: EnvService = { balancedBracesURL: 'http://mockBBURL'};
  let httpMock: HttpTestingController;
  let service: BalancedBracesService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: EnvService, useValue: envServiceMock },
      ]
    })
    .compileComponents();
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(BalancedBracesService);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a request to balanced braces api', () => {
    const expr = 'asdf';
    let response: any;
    service.isBalancedBraces(expr).subscribe(
      {
        next: v => response = v
      }
    );

    // Test if request is fired properly
    const req = httpMock.expectOne(`${envServiceMock.balancedBracesURL}/${expr}`);
    expect(req.request.method).toBe('GET');

    // Test if repsonse is received
    req.flush({balancedBraces: true});
    expect(response).toBeTruthy();

  });

  it('should return true for blank expressions', () => {
    let response: any;
    service.isBalancedBraces('').subscribe(
      {
        next: v => response = v
      }
    );

    expect(response).toBeTruthy();

    // no request should be fired
    httpMock.verify();
  });

  it('should work with URL ending with /', () => {
    const oldURL = envServiceMock.balancedBracesURL;
    envServiceMock.balancedBracesURL = envServiceMock.balancedBracesURL + '/';
    const expr = 'asdf';
    service.isBalancedBraces(expr).subscribe( );

    // Test if request is fired properly
    const req = httpMock.expectOne(`${oldURL}/${expr}`);
    expect(req.request.method).toBe('GET');

    // clean up for next test
    envServiceMock.balancedBracesURL = oldURL;
  });

  it('should return null on erroronours response from server', () => {
    const expr = 'asdf';

    let response: any; // should get set to null
    service.isBalancedBraces(expr).subscribe(
      {
        next: v => response = v
      }
    );

    // Test if request is fired properly
    const req = httpMock.expectOne(`${envServiceMock.balancedBracesURL}/${expr}`);
    expect(req.request.method).toBe('GET');

    const mockErrorResponse = { status: 400, statusText: 'Bad Request' };
    const data = 'Invalid request parameters';

    // Invalid server response should be set to undefined
    req.flush(data, mockErrorResponse);
    expect(response).toBeNull();
  });

});
