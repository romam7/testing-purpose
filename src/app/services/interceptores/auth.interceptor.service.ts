import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { catchError} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { DatosComunesService } from '../helpers/comun.datos';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private comun: DatosComunesService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(e => {
        if (e.status === 401) {
          if (this.authService.isAuthenticated()) {
            this.comun.cerrarSesionEmpleado();
          }
          this.comun.redirigeAPrincipal();
        }

        if (e.status === 403) {
          this.comun.creaAlerta(1, 'No tienes permiso para acceder a este apartado.', 'Acceso denegado');
          this.comun.redirigeAPrincipal();
        }
        return throwError(e);
      })
    );
  }
}
