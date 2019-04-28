import { TestBed, inject } from '@angular/core/testing';

import { EnvService } from './env.service';
import { EnvServiceProvider } from './env.service.provider';

describe('EnvService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnvServiceProvider]
    });
  });

  afterEach(() => {
    // clean up __env from global window var (might get set)
    const w: any = window;
    if (w && w.__env) {
      delete w.__env;
    }
  });

  it('should be created', inject([EnvService], (service: EnvService) => {
    expect(service).toBeTruthy();
  }));

  it('should set balancedBracesURL according to environment var', () => {
    const testString = 'TestASDF';
    const browserWindow: any = window || {};
    browserWindow.__env = {balancedBracesURL: testString};

    const env: EnvService = TestBed.get(EnvService);
    expect(env.balancedBracesURL).toBe(testString);
  });

  it('should ignore additional __env variables', () => {
    const testString = 'TestASDF';
    const browserWindow: any = window || {};
    browserWindow.__env = {test: testString};

    const env: any = TestBed.get(EnvService);
    expect(env.test).toBeUndefined();
  });

  it('should not set balancedBracesURL if environment var doesnt exist', () => {
    const env: EnvService = TestBed.get(EnvService);
    expect(env.balancedBracesURL).toBeFalsy();
  });
});
