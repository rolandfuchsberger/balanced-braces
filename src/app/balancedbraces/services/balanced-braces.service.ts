import { EnvService } from '../../services/env.service';
import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BalancedBracesService {

  constructor(private env: EnvService, private http: HttpClient) { }

  /**
   * isBalancedBraces
   * expr: string Expression to be checked
   */
  public isBalancedBraces(expr: string): Observable<boolean> {
    if (expr === '') {
      // tslint:disable-next-line:deprecation bug: https://github.com/ReactiveX/rxjs/issues/4723
      return of(true);
    }


    // .replace(/[/]$/g, ''): remove trailing '/'
    return this.http.get(this.env.balancedBracesURL.replace(/[/]$/g, '') + '/' +
     encodeURIComponent(expr)).pipe(
      map((resp: any) => resp.balancedBraces),
      // tslint:disable-next-line:deprecation bug: https://github.com/ReactiveX/rxjs/issues/4723
      catchError(err => {console.log(err); return of(null); })
    );
  }

}
