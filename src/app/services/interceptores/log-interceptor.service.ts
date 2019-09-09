import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Intercepta las peticiones y las pinta en el log
 */
@Injectable({
  providedIn: 'root'
})
export class LogInterceptorService implements HttpInterceptor {

  /**
   * Intercepta cada petición
   * @param request Request realizado
   * @param next Handler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // console.log(event.body);
          }
          return event;
        }
      )
    );
  }
}
