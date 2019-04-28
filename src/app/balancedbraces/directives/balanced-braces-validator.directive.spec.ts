import { AbstractControl } from '@angular/forms';
import { TestBed, async, tick, fakeAsync, flush } from '@angular/core/testing';
import { BalancedBracesService } from './../services/balanced-braces.service';
import { BalancedBracesValidator } from './balanced-braces-validator.directive';
import { getBalancedBracesServiceSpy } from '../services/balanced-braces.service.spy.spec';


describe('BalancedBracesValidator', () => {

  let bbServiceSpy: jasmine.SpyObj<BalancedBracesService>;
  let bbValidator: BalancedBracesValidator;

  // Idea: Create a class derived from AbstactControll to pass it to the BalancedBracesValidator.validate method
  class SpyControl extends AbstractControl {

    setValue(value: any, options?: object): void {
      throw new Error('Method not implemented.');
    }

    patchValue(value: any, options?: object): void {
      throw new Error('Method not implemented.');
    }

    reset(value?: any, options?: object): void {
      throw new Error('Method not implemented.');
    }

    constructor(public value: string) {
      super(null, null);
    }
  }

  beforeEach(() => {
    bbServiceSpy = getBalancedBracesServiceSpy();

    TestBed.configureTestingModule({
      providers: [
        {provide: BalancedBracesService, useValue: bbServiceSpy},
        BalancedBracesValidator
      ]
    });

    bbValidator = TestBed.get(BalancedBracesValidator);
  });


  it('should be created', () => {
    expect(bbValidator).toBeTruthy();
  });



  it('should dispatch the request to the server after 200ms', fakeAsync(() => {

    const value = 'something';

    // instance to pass to the validate method
    const spyControl = new SpyControl(value);

    let response;
    bbValidator.validate(spyControl).subscribe(
      s => response = s
    );


    expect(response).toBeUndefined('should not receive a response immediately');
    tick(100);
    expect(response).toBeUndefined('should not receive a response after 100ms');
    tick(100);

    expect(response).toBeDefined('should receive a null response after 200ms');

    // check if the service has been called with the right arguments
    expect(bbServiceSpy.isBalancedBraces).toHaveBeenCalledWith(value);
    expect(bbServiceSpy.isBalancedBraces).toHaveBeenCalledTimes(1);



  }));

  it('should receive invalid response', fakeAsync(() => {

    let response: any;
    // test for invalid
    const value = 'odd'; // odd lenght -> invalid
    const spyControl = new SpyControl(value);
    bbValidator.validate(spyControl).subscribe(
      s => response = s
    );

    tick(1000);

    expect(response.balancedBraces).toBeTruthy();
  }));

  it('should receive valid response', fakeAsync(() => {

    let response: any;
    // test for invalid
    const value = 'even'; // even lenght -> valid
    const spyControl = new SpyControl(value);
    bbValidator.validate(spyControl).subscribe(
      s => response = s
    );

    tick(1000);

    expect(response).toBeNull();
  }));

});
