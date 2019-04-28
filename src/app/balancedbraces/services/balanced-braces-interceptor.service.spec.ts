import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EnvService } from './../../services/env.service';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BalancedBracesInterceptorService } from './balanced-braces-interceptor.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BalancedBracesInterceptorService', () => {
  const envServiceMock: EnvService = { balancedBracesURL: 'http://mockBBURL'};
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: EnvService, useValue: envServiceMock },
        {provide: HTTP_INTERCEPTORS, useClass: BalancedBracesInterceptorService, multi: true}
      ]
    });

    http = TestBed.get(HttpClient);
  });

  it('should be created', () => {
    expect(http).toBeTruthy();
  });

  it('should intercept http requests', fakeAsync( () => {
    let response;
    http.get(`${envServiceMock.balancedBracesURL}/asdf`).subscribe(
      (s: any) => response = s.balancedBraces
    );

    tick();
    expect(response).toBeUndefined('should get result only result after some time');

    tick(5000);
    expect(response).toBeTruthy('should receive truthy response');

  }));

  it('should not intercept other http requests', fakeAsync( () => {
    let somethingHappened;

    http.get(`http://an.yt.hi.ng.e.l.s.e${envServiceMock.balancedBracesURL}/asdf`)
    .subscribe(
      { error: _ => somethingHappened = true,
        next: _ => somethingHappened = true,
        complete: () => somethingHappened = true
      }
    );

    // move time forward to make sure that nothing happens with a time delay
    tick(10000);

    expect(somethingHappened).toBeUndefined('no response should be received');

  }));

});

describe('BalancedBracesInterceptorService.isBalances(expr)', () => {

  class BalancedBracesInterceptorServiceSuit extends BalancedBracesInterceptorService {

    constructor() {
      super(null);
    }

    public isBalanced( expr: string) {
      return super.isBalanced(expr);
    }
  }

  it('should return correct results for isBalanced', () => {

    const tests = [
      {expr: 'asdf(asdf)', want: true},
      {expr: '({}[])', want: true},
      {expr: '[({})]', want: true},
      {expr: '([({////})])', want: true},
      {expr: '', want: true},
      {expr: 'asdflkjadsf', want: true},
      {expr: 'asdf(asdf))', want: false},
      {expr: ')', want: false},
      {expr: '[)', want: false},
      {expr: '(', want: false},
      {expr: '{(})', want: false},
      {expr: '{{asdflkjadsf}', want: false},
    ];
    const suit = new BalancedBracesInterceptorServiceSuit();

    for (const t of tests) {
      expect(suit.isBalanced(t.expr)).toBe(t.want);
    }

  });

});
