import { Component, HostListener } from '@angular/core';
import { DatosComunesService } from './services/helpers/comun.datos';
import { Subject } from 'rxjs';
import { AuthService } from './services/auth.service';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;
/**
 * Componente principal del cual se genera toda la funcionalidad
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  /**
   * Usuario inactivo
   */
  usuarioInactivo: Subject<any> = new Subject();
  /**
   * Actividad de usuario
   */
  actividadUsuario: any;
  /**
   * Correo de soporte
   */
  correo = 'sociomassoporte@gruposalinas.com.mx';

  /**
   * Crea los objetos para que el componente funcione
   * @param comun Objeto del servicio de datos comunes
   */
  constructor(
    public comun: DatosComunesService, private authService: AuthService) {
    $('.contConfig').hide();
    this.comun.tituloPagina = 'Aprende a usar Socio MAS';
    this.detectaActividad();
    this.usuarioInactivo.subscribe(() => {
      this.comun.cerrarSesionEmpleado();
      clearTimeout(this.actividadUsuario);
    });
  }

  /**
   * Valida si la inactividad ha sido por 10 minutos
   */
  detectaActividad() {
    this.actividadUsuario = setTimeout(() => this.usuarioInactivo.next(undefined), 600000);
  }

  /**
   * Método que detecta si se está interactuando con el sitio, de lo contrario manda validar la sesión
   */
  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.actividadUsuario);
    this.detectaActividad();
  }

  /**
   * Método que esta escuchando los cambios sucedidos en localStorage, en caso de que se detecte que la variable que contiene los datos de
   * sesión ya no existe, entonces cierra la sesión actual.
   * Esta solución se ha implementado ya que aunque se limpiara el localStorage, el empleado en sesión podía seguir interactuando
   * y enviando peticiones ya que los datos del cabecero estaban en el contexto global.
   */
  @HostListener('window:storage')
  public detecttaCambiosLocalStorage() {
    if (!localStorage.getItem(this.comun.datosSesionKeyLocal)) {
      this.comun.cerrarSesionEmpleado();
    }
  }
}
