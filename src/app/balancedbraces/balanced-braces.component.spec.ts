import { BalancedBracesDirective } from './directives/balanced-braces.directive';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { BalancedBracesValidator } from './directives/balanced-braces-validator.directive';
import { FormsModule, ReactiveFormsModule, AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Component, DebugElement, Directive, HostListener } from '@angular/core';
import { BalancedBracesComponent } from './balanced-braces.component';
import { EnvService } from '../services/env.service';
import { BalancedBracesService } from './services/balanced-braces.service';
import { getBalancedBracesServiceSpy } from './services/balanced-braces.service.spy.spec';
import { checkValidationCssClasses } from './testing/test-util.spec';


describe('BalancedBracesComponent', () => {
  let component: BalancedBracesComponent;
  let fixture: ComponentFixture<BalancedBracesComponent>;
  let bbValidator: BalancedBracesValidator;
  const envServiceMock: EnvService = { balancedBracesURL: 'http://mockBBURL'};
  let bbService: jasmine.SpyObj<BalancedBracesService>;
  let inputReactiveForm: DebugElement;
  let inputNgModel: DebugElement;
  let inputDirective: DebugElement;
  let inputInterpolation: DebugElement;

  // TEST STRATEGY on BalancedBracesValidator: test with original BalancedBracesValidator component
  // and overwrite validate property with stub method
  // this test strategy ensures that the selectors and providers are all set correctly on the real BalancedBracesValidator
  // and that it can work together with the form (instead of only veryfying this with some stub)
  // overwriting the validate method allows abstracting from the BalancedBracesValidator implementation
  // Alternativ would be creating a stub with same selectors and providers

  // create spy
  function getValidateSpy() {
      return jasmine.createSpy().and.callFake( (ctrl: AbstractControl): Observable<ValidationErrors | null> => {
      // only return a validation error for strings with odd length
      // tslint:disable-next-line:deprecation bug: https://github.com/ReactiveX/rxjs/issues/4723
      return of(ctrl.value && ctrl.value.length && ctrl.value.length % 2 === 1 ? {balancedBraces: true} : null );
    });
  }

  beforeEach(async(() => {

    bbService = getBalancedBracesServiceSpy();

    // replace validate with spy (see comment above)
    bbValidator  = new BalancedBracesValidator(null);
    bbValidator.validate = getValidateSpy();

    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ BalancedBracesComponent, BalancedBracesDirective, BalancedBracesValidator ],
      providers: [
        {provide: BalancedBracesValidator, useValue: bbValidator},
        {provide: EnvService, useValue: envServiceMock},
        {provide: BalancedBracesService, useValue: bbService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalancedBracesComponent);

    // disable BalancedBracesValidator.validate to not interfere with other tests
    for ( const c of fixture.debugElement.queryAll(By.directive(BalancedBracesValidator))) {
      // tslint:disable-next-line:deprecation bug: https://github.com/ReactiveX/rxjs/issues/4723
      c.injector.get(BalancedBracesValidator).validate = (_) => of(null);
    }

    // disable BalancedBracesDirective.onValueChange to not interfere with other tests
    for ( const c of fixture.debugElement.queryAll(By.directive(BalancedBracesDirective))) {
      c.injector.get(BalancedBracesDirective).onValueChange = (_) => {};
    }

    component = fixture.componentInstance;
    fixture.detectChanges(); // initial binding

    // set variables for input elements
    inputReactiveForm = fixture.debugElement.query(By.css('.reactiveForm'));
    inputNgModel = fixture.debugElement.query(By.css('.ngModel'));
    inputDirective = fixture.debugElement.query(By.css('.directive'));
    inputInterpolation = fixture.debugElement.query(By.css('.interpolation'));
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should find all input elements', () => {
    expect(inputReactiveForm).toBeTruthy();
    expect(inputNgModel).toBeTruthy();
    expect(inputDirective).toBeTruthy();
    expect(inputInterpolation).toBeTruthy();
  });

  it('should call BalancedBracesValidator on reactive form input', () => {
    testValidatorInputElements(inputReactiveForm, bbValidator.validate as jasmine.Spy);
  });

  it('should call BalancedBracesValidator on ngModel input', () => {
    // set spy
    const spy = getValidateSpy();
    inputNgModel.injector.get(BalancedBracesValidator).validate = spy;
    testValidatorInputElements(inputNgModel, spy);
  });

  function testValidatorInputElements(inputEl: DebugElement, validateSpy: jasmine.Spy) {

    const initCallCount = validateSpy.calls.count();

    // empty form should be valid
    checkValidationCssClasses(inputEl, 'ng-valid');

    const testString = 'odd'; // odd length -> invalid
    inputEl.nativeElement.value = testString;
    inputEl.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    checkValidationCssClasses(inputEl, 'ng-invalid');

    expect(validateSpy.calls.count() - initCallCount).toBe(1, 'should have called validate once');
  }

  it('should call BalancedBracesStubDirective on directive input', () => {

    // should be sufficient to only check if the directive receives onValueChange events
    // the rest is tested in the BalancedBracesDirective unit test.
    const bbDir = inputDirective.injector.get(BalancedBracesDirective);
    const spy = spyOn(bbDir, 'onValueChange');

    const testString = 'odd'; // odd length -> invalid
    inputDirective.nativeElement.value = testString;
    inputDirective.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(testString);

  });

  it('should set ng-valid / ng-invalid on interpolation input', fakeAsync(() => {

    // should start as valid
    checkValidationCssClasses(inputInterpolation, 'ng-valid');

    // should change to ng-invalid
    inputInterpolation.nativeElement.value = 'oddLength'; // odd length -> invalid
    inputInterpolation.nativeElement.dispatchEvent(new Event('input'));
    tick(200);
    fixture.detectChanges(); // update data binding
    checkValidationCssClasses(inputInterpolation, 'ng-invalid');

    // should change to ng-valid
    inputInterpolation.nativeElement.value = 'evenLength'; // even length -> valid
    inputInterpolation.nativeElement.dispatchEvent(new Event('input'));
    tick(200);
    fixture.detectChanges(); // update data binding
    checkValidationCssClasses(inputInterpolation, 'ng-valid');

  }));

  it('should debounce with 200ms on interpolation input', fakeAsync( () => {

    expect(bbService.isBalancedBraces).toHaveBeenCalledTimes(0);

    // should not trigger any change
    inputInterpolation.nativeElement.value = 'odd'; // odd length -> invalid
    inputInterpolation.nativeElement.dispatchEvent(new Event('input'));
    tick(100);
    fixture.detectChanges(); // update data binding

    expect(bbService.isBalancedBraces).toHaveBeenCalledTimes(0);

    // should not trigger any change
    inputInterpolation.nativeElement.value = 'even';  // even length -> valid
    inputInterpolation.nativeElement.dispatchEvent(new Event('input'));
    tick(100);
    fixture.detectChanges(); // update data binding

    expect(bbService.isBalancedBraces).toHaveBeenCalledTimes(0);

    // should trigger changes
    inputInterpolation.nativeElement.value = 'odd_2'; // odd length -> invalid
    inputInterpolation.nativeElement.dispatchEvent(new Event('input'));
    tick(200);
    fixture.detectChanges(); // update data binding
    checkValidationCssClasses(inputInterpolation, 'ng-invalid');

    // this is called twice as it appears in two interpolations
    expect(bbService.isBalancedBraces).toHaveBeenCalledTimes(2);
    expect(bbService.isBalancedBraces).toHaveBeenCalledWith('odd_2');

  }));
});
