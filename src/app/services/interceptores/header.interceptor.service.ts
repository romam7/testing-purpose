import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

/**
 * Servicio que intercepta la peticiones a los servicios y les agrega el header para que el tipo sea JSON
 */
@Injectable({
  providedIn: 'root'
})
export class HeaderInterceptorService implements HttpInterceptor {
  /**
   * Crea el objeto del servicio de autenticacion
   * @param authService Objeto del servicio de autenticacion
   */
  constructor(private authService: AuthService) { }

  /**
   * Intercepta la petición actual
   * @param request Request realizado
   * @param next Handler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated()) {
      const header = request.clone({
        headers: request.headers.set('Content-Type', 'application/json; charset=utf-8')
      });

      return next.handle(header);
    }

    return next.handle(request);
  }
}
