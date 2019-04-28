import { BalancedBracesComponent } from './balanced-braces.component';
import { BalancedBracesService } from './services/balanced-braces.service';
import { BalancedBracesValidator } from './directives/balanced-braces-validator.directive';
import { BalancedBracesDirective } from './directives/balanced-braces.directive';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { BalancedBracesInterceptorService } from './services/balanced-braces-interceptor.service';
import { Provider } from '@angular/compiler/src/core';

const providers: Provider[] = [BalancedBracesValidator,
  BalancedBracesService
  ];


// source: https://github.com/GetDaStick/backendless-example/

// use mock backend if env variable is set
if (environment.useMockBackend) {
  providers.push({
      provide: HTTP_INTERCEPTORS,
      useClass: BalancedBracesInterceptorService,
      multi: true
  });
  console.log('interceptor added: ' + JSON.stringify(providers));
}


@NgModule({
  declarations: [BalancedBracesDirective, BalancedBracesValidator, BalancedBracesComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  exports: [BalancedBracesComponent],
  providers: [ providers ]
})
export class BalancedbracesModule { }
