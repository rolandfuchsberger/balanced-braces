import { BalancedBracesService } from '../services/balanced-braces.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import { Directive, Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, AsyncValidator, NG_ASYNC_VALIDATORS } from '@angular/forms';


@Injectable({ providedIn: 'root' })
@Directive({
  selector: '[appBalancedBracesVal]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: BalancedBracesValidator, multi: true}]
})
export class BalancedBracesValidator implements AsyncValidator {
  // see https://www.concretepage.com/angular-2/angular-custom-async-validator-example

  constructor(private bbs: BalancedBracesService) {}

  // implement as property to avoid binding - e.g. balancedBracesValidatorInstance.validate.bind(balancedBracesValidatorInstance);
  validate = (ctrl: AbstractControl): Observable<ValidationErrors | null> => {

    // timer: see https://stackoverflow.com/questions/36919011/how-to-add-debounce-time-to-an-async-validator-in-angular-2
    return timer(200).pipe(
      switchMap(_ => this.bbs.isBalancedBraces(ctrl.value)),
      map(isBalanced => isBalanced ? null : {balancedBraces : true})
    );
}
}
