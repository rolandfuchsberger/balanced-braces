import { BalancedBracesService } from '../services/balanced-braces.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import {  Subject } from 'rxjs';

@Directive({
  selector: '[appBalancedBraces]'
})
export class BalancedBracesDirective implements OnInit {

  valueChanged$ =  new Subject<string>();

  constructor( private bbs: BalancedBracesService, private el: ElementRef) {

    this.valueChanged$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((expr) => this.bbs.isBalancedBraces(expr))
    ).subscribe(
      {next: isBalanced => {
        this.el.nativeElement.classList.remove('ng-pending');
        this.el.nativeElement.classList.add('ng-' + (isBalanced ? 'valid' : 'invalid'));
      }
      }
    );

  }

  ngOnInit(): void {
    this.el.nativeElement.classList.add('ng-valid');
  }

  @HostListener('input',  ['$event.target.value'])
  onValueChange(value: string) {

    this.el.nativeElement.classList.remove('ng-valid');
    this.el.nativeElement.classList.remove('ng-invalid');
    this.el.nativeElement.classList.add('ng-pending');

    this.valueChanged$.next(value);
  }

}
