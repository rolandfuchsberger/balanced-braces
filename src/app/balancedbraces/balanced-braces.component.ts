import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BalancedBracesValidator } from './directives/balanced-braces-validator.directive';
import { EnvService } from './../services/env.service';
import { BalancedBracesService } from './services/balanced-braces.service';
import { FormControl, FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-balanced-braces',
  templateUrl: './balanced-braces.component.html',
  styleUrls: ['./balanced-braces.component.css']
})
export class BalancedBracesComponent  {

  expression = new FormControl('');
  expressionValidation = new FormControl('', {asyncValidators: [this.bbvalidator.validate], updateOn: 'change' }  );
  expressionValue = '';
  useMockBackend = environment.useMockBackend;

  isBalanced$ = this.expression.valueChanges.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((expr) => this.bbs.isBalancedBraces(expr))
  );

  constructor(private bbs: BalancedBracesService, public env: EnvService, private bbvalidator: BalancedBracesValidator) {}

}
