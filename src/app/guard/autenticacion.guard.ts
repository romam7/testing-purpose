import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { DatosComunesService } from '../services/helpers/comun.datos';
import { AuthService } from '../services/auth.service';

/**
 * Guarda para evitar el acceso a páginas no autorizadas
 */
@Injectable({
  providedIn: 'root'
})
export class AutenticacionGuard implements CanActivate {

  /**
   * Crea un objeto del servicio de datos comunes
   * @param comun Objeto del servico de datos comunes
   */
  constructor(private comun: DatosComunesService, private authService: AuthService) { }

  /**
   * Determina si se tiene autorización para acceder a un componente ruta
   * @param next RutaActiva
   * @param state Estado
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.comun.cerrarSesionEmpleado();
      this.comun.creaAlerta(1, 'Debes estar autenticado para poder acceder a este recurso.', 'Autenticación necesaria.');
      this.comun.redirigeAPrincipal();
      return false;
    }
  }
}
