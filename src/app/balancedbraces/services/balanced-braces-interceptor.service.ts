import { environment } from './../../../environments/environment';
import { EnvService } from './../../services/env.service';
import { Observable, of, timer } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  })
export class BalancedBracesInterceptorService implements HttpInterceptor {

    private openingBraces = ['(', '{', '['] ;
    private closingBraces = [')', '}', ']'] ;

    private mapOpeningToClosingBrace = {
        '(': ')',
        '{': '}',
        '[': ']'
    };

    constructor(private env: EnvService ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const url: string = request.url.slice(null, request.url.lastIndexOf('/'));
        const method: string = request.method;

        if (url === this.env.balancedBracesURL.replace(/[/]$/g, '') && method === 'GET') {

            const expr: string = request.url.slice(request.url.lastIndexOf('/') + 1);

            // return mock repsonse with 500ms delay
            return timer(environment.mockBackendResponseDelay).pipe(
                map(_ => new HttpResponse({
                status: 200,
                body: {
                    balancedBraces: this.isBalanced(decodeURI(expr))
                }
            })));
          }

        return next.handle(request); // fallback in case url isn't caught
    }

    // protected for unit testing
    protected isBalanced(expr: string): boolean {

        const bracesOpened = [];

        for (let i = 0; i < expr.length; i++) {

            const c = expr.charAt(i);

            if (this.openingBraces.includes(c)) {
                bracesOpened.push(c);
            } else if (this.closingBraces.includes(c) && bracesOpened.length === 0) {
                return false;
            } else if (this.closingBraces.includes(c) && this.mapOpeningToClosingBrace[bracesOpened.pop()] !== c) {
                return false;
            }
        }

        return bracesOpened.length === 0;

    }
}
