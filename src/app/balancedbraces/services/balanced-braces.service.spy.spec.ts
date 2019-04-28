import { BalancedBracesService } from './balanced-braces.service';
import { of } from 'rxjs';

export function getBalancedBracesServiceSpy() {
  const spy = jasmine.createSpyObj<BalancedBracesService>(['isBalancedBraces']);
  // tslint:disable-next-line:deprecation bug: https://github.com/ReactiveX/rxjs/issues/4723
  spy.isBalancedBraces.and.callFake(expr => of(expr.length % 2 === 0));
  return spy;
}

