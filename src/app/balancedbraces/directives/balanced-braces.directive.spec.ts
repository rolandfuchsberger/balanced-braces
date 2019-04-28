import { BalancedBracesService } from './../services/balanced-braces.service';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { BalancedBracesDirective } from './balanced-braces.directive';
import { Component, DebugElement, Directive } from '@angular/core';
import { By } from '@angular/platform-browser';
import { getBalancedBracesServiceSpy } from '../services/balanced-braces.service.spy.spec';
import { checkValidationCssClasses } from '../testing/test-util.spec';


@Component({
  template: '<input type="text" appBalancedBraces >'
})
class TestInputElementComponent {}


describe('BalancedBracesDirective', () => {

  let fixture: ComponentFixture<TestInputElementComponent>;
  let inputEl: DebugElement;
  let bbDirective: BalancedBracesDirective;
  let bbServiceSpy: jasmine.SpyObj<BalancedBracesService>;

  beforeEach(async () => {
    bbServiceSpy = getBalancedBracesServiceSpy();

    TestBed.configureTestingModule({
      declarations: [BalancedBracesDirective, TestInputElementComponent],
      providers: [{provide: BalancedBracesService, useValue: bbServiceSpy}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestInputElementComponent);

    inputEl = fixture.debugElement.query(By.css('input'));
    bbDirective = inputEl.injector.get(BalancedBracesDirective);

  });

  it('should create an input element with a directive', () => {
    expect(inputEl).toBeTruthy();
    expect(bbDirective).toBeTruthy();
  });

  it('should set the class to ng-pending right after input is received', () => {

    inputEl.nativeElement.value = 'odd'; // odd length -> false
    inputEl.nativeElement.dispatchEvent(new Event('input'));

    checkValidationCssClasses(inputEl, 'ng-pending');

  });

  it('should set the class to ng-valid when received a balanced expression', fakeAsync(() => {

    inputEl.nativeElement.value = 'even'; // even length -> true
    inputEl.nativeElement.dispatchEvent(new Event('input'));

    // pass the 200ms pause for debouncing
    tick(200);

    checkValidationCssClasses(inputEl, 'ng-valid');

  }));

  it('should set the class to ng-invalid when received an unbalanced expression', fakeAsync(() => {

    inputEl.nativeElement.value = 'odd'; // odd length -> false
    inputEl.nativeElement.dispatchEvent(new Event('input'));

    // pass the 200ms pause for debouncing
    tick(200);
    checkValidationCssClasses(inputEl, 'ng-invalid');

  }));

  it('should debounce messages only after 200ms', fakeAsync(() => {

    inputEl.nativeElement.value = 'even'; // even length -> true
    inputEl.nativeElement.dispatchEvent(new Event('input'));

    // 100ms pause - debouncing should prevent call to the service
    tick(100);

    inputEl.nativeElement.value = 'odd'; // odd length -> false
    inputEl.nativeElement.dispatchEvent(new Event('input'));

    // 200ms pause - debouncing should allow call to the service
    tick(200);

    expect(bbServiceSpy.isBalancedBraces.calls.count())
    .toBe(1, 'No/multiple calls made to service. Debouncing not working!');
  }));

});
