import { AppPage } from './app.po';
import { browser, logging, ElementFinder } from 'protractor';
import { fakeAsync, tick } from '@angular/core/testing';


describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });

  it('should display welcome message', () => {
    expect(page.getTitleText()).toEqual('Welcome to Balanced Braces!');
  });

  it('should add ng-valid / ng-invalid class on \'directive\' input fields given a specific expression',  () => {

    // split up in different tests to avoid timeout / avoid setting timeout limit too high
    testElement(page.getInputDirective(), 'directive' );

  });

  it('should add ng-valid / ng-invalid class on \'interpolation\' input fields given a specific expression', () => {

    // split up in different tests to avoid timeout / avoid setting timeout limit too high
    testElement(page.getInputInterpolation(), 'interpolation' );

  });

  it('should add ng-valid / ng-invalid class on \'ngModel\' input fields given a specific expression', () => {

    // split up in different tests to avoid timeout / avoid setting timeout limit too high
    testElement(page.getInputNgModel(), 'ngModel' );

  });

  it('should add ng-valid / ng-invalid class on \'reactive form\' input fields given a specific expression',  () => {

    // split up in different tests to avoid timeout / avoid setting timeout limit too high
    testElement(page.getInputReactiveForm(), 'reactive form' );

  });

  function testElement(inputElement: ElementFinder, name: string){
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


    shuffle(tests).forEach( t => {
      expect(testInput(inputElement, t.expr, t.want))
      .toBeTruthy(`Error on element ${name} with input: '${t.expr}', expecting: ${t.want}`);
      });
  }

  /*
   * test a specific inputString on a specific inputElement excpecting valid (valid === true) or invalid (valid == false)
  */
  function testInput(inputElement: ElementFinder, inputString: string, valid: boolean) {

    inputElement.clear();
    inputElement.sendKeys(inputString);

    // move clock forward to ignore server response delay of balanced-braces-interceptor service
    //tick(100000);

    // protractor sort of waits until all other async jscript operations are completed
    // key word: protractor control flow
    // e.g.: it will wait until it receives the response from the server
    // thus it is not possible to capture the ng-pending state in tests

    return expect(inputElement.getAttribute('class')
      .then( t => t.split(' '))
      .then( s => s.includes(valid ? 'ng-valid' : 'ng-invalid') ));

  }

  // source: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  function shuffle<T>(array: T[]) {
    let currentIndex = array.length;
    let temporaryValue: T;
    let randomIndex: number;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
});
