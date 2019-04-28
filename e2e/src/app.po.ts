import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

  getInputReactiveForm() {
    return element(by.css('.reactiveForm'));
  }

  getInputNgModel() {
    return element(by.css('.ngModel'));
  }

  getInputDirective() {
    return element(by.css('.directive'));
  }

  getInputInterpolation() {
    return element(by.css('.interpolation'));
  }

}
