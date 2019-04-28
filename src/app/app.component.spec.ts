import { By } from '@angular/platform-browser';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';


@Component({
  selector: 'app-balanced-braces',
  template: `<div class='app-balanced-braces-rendered' > </div> `
})
class AppBalancedBracesStubComponent { }

let fixture: ComponentFixture<AppComponent> ;
let app ;

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        AppBalancedBracesStubComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render title in a h1 tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(app.title);
  });

  it('should render app-balanced-braces', () => {
    expect(fixture.debugElement.query(By.css('.app-balanced-braces-rendered')))
    .toBeTruthy('should find app-balanced-braces-rendered element');
  });
});
