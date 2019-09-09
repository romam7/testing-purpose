import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
import { DomSanitizer } from '@angular/platform-browser';
import { FotoRequest } from 'src/app/modelos/requests/foto.request';
import { CatalogoEmpresasResponse } from 'src/app/modelos/responses/catalogo.empresas.response';
import { CertificadoRequest } from 'src/app/modelos/requests/certificado.request';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationStart, NavigationEnd, RouterEvent } from '@angular/router';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;
/**
 * Componente para la pagina del header
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  /**
   * Foto del empleado actualmente logeado
   */
  imagePath: any;
  /**
   * Request para obtener la foto del empleado
   */
  fotoRequest: FotoRequest = FotoRequest.fotoRequest();
  /**
   * Datos para mostrar en el header
   */
  empleadoLogeado = { nombre: '', puesto: '' };
  /**
   * Url de ApiGee que dara el servicio de autenticación con DSI
   */
  // tslint:disable-next-line: max-line-length
  urlApiGee = 'https://internal-apigee-dev-alb01-616642448.us-east-1.elb.amazonaws.com:8080/oauth2/v1/authorize?client_id=GQucApqNaQOsTtrnWEgRquZh2zgAEomz&scope=userinfo.SocioMAS';

  /**
   * Crea los objetos a ocupar en este componente
   * @param empleadoService Objeto del servicio de empleados
   * @param comun Objeto de la clase de datos comunes
   * @param sanitizer Objeto que hace segura la obtención de la foto del empleado
   */
  constructor(
    private empleadoService: EmpleadoService,
    public comun: DatosComunesService,
    private sanitizer: DomSanitizer,
    public authService: AuthService,
    public router: Router) {
    this.cerrarToggle();
  }

  ngOnInit(): void {
    this.router.events.subscribe(routerEvent => {
      if (routerEvent instanceof NavigationStart) {
        if (this.authService.isAuthenticated()) {
          this.authService.parseaDatosLocalStorage();
          this.validaUsarioEnSesion();
        }
      }
      if (routerEvent instanceof NavigationEnd) {
        if (this.authService.isAuthenticated()) {
          if (this.comun.obtenerDatosSesion() && this.empleadoLogeado.nombre === '') {
            const EMPLEADO = JSON.parse(this.comun.obtenerDatosSesion());
            this.empleadoLogeado = { nombre: EMPLEADO.nombre, puesto: EMPLEADO.puesto };
          }
        }
      }
    });
  }

  /**
   * Muestra el menú principal
   */
  showMenuPrincipal() {
    // tslint:disable-next-line: deprecation
    event.stopPropagation();
    $('#effect').toggle('slide');
    this.cerrarToggle();
  }

  /**
   * Muestra el toggle para cerrar sesión
   */
  showLogOut() {
    $('.contConfig').toggle('ver');
  }

  /**
   * Cierra toggle abierto
   */
  public cerrarToggle() {
    $('.contConfig').hide();
  }

  /**
   * Obtiene la información del empleado usando el servio necesario
   */
  obtenerDatosEmpleado() {
    this.empleadoService.obtenerEmpleado(this.comun.asignaValorRequestGenerico(this.comun.obtenerValorEmpleadoSesion())).subscribe(
      response => {
        if (response.cabResponse !== undefined) {
          if (response.cabResponse.codResponse === -1 && response.estatus === 0 && response.numeroEmpleado === null) {
            this.comun.creaAlerta(1, this.comun.RECURSOS.HEADER.msjEmpleadoInactivo, this.comun.RECURSOS.HEADER.headerInactivo);
            this.cerrarSesion();
            return;
          }
          if (response.numeroEmpleado !== undefined && response.numeroEmpleado !== null && response.cabResponse.codResponse === 0) {
            localStorage.setItem(this.comun.empleadoKeyLocal, btoa(JSON.stringify(response)));
            this.empleadoLogeado = { nombre: response.nombre, puesto: response.puesto };
            this.obtenerFoto();
            this.comun.redirigeAListado();
          }
          if (response.cabResponse.codResponse === -1) {
            this.comun.creaAlerta(3, this.comun.RECURSOS.HEADER.msjErrorDatosSesion, '');
          }
          this.comun.validaCertificado(response.cabResponse.codResponse);
        } else {
          this.comun.creaAlerta(3, this.comun.RECURSOS.HEADER.msjErrorDatosSesion, '');
        }
        this.comun.cargandoPrincipal = false;
      },
      error => {
        this.comun.creaAlerta(3, this.comun.RECURSOS.HEADER.msjErrorDatosSesion, '');
        this.comun.cargandoPrincipal = false;
      }
    );
  }

  /**
   * Método para obtener la foto del empleado
   */
  obtenerFoto() {
    if (this.comun.obtenerDatosSesion()) {
      this.comun.asignaCabeceroFoto(this.fotoRequest, JSON.parse(this.comun.obtenerDatosSesion()));
    }
    this.empleadoService.obtenerFotoEmpleado(this.fotoRequest).subscribe(
      fotoResponse => {
        if (fotoResponse.cabResponse !== undefined) {
          if (fotoResponse.cabResponse.codResponse === 0) {
            this.comun.creaFotoLocal(fotoResponse.foto);
            this.imagePath =
              this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.comun.obtieneFotoLocal());
          }
          this.comun.validaCertificado(fotoResponse.cabResponse.codResponse);
        }
      }, error => { }
    );
  }

  /**
   * Obtiene el catálogo de empresas y las guarda en una variable global para evitar llamdas excesivas al servio
   * @returns Retorna objeto de CatalogoEmpresasResponse
   */
  obtenerEmpresas(): CatalogoEmpresasResponse {
    this.empleadoService.obtenerEmpresasPadre(this.comun.asignaValorRequestGenerico('')).subscribe(
      empresas => {
        if (empresas.cabResponse !== undefined) {
          if (empresas.empresas !== undefined && empresas.cabResponse.codResponse === 0) {
            this.comun.empresasPadre = empresas;
          }
          this.comun.validaCertificado(empresas.cabResponse.codResponse);
        }
      },
      error => { }
    );
    return this.comun.empresasPadre;
  }

  /**
   * Valida si existe una sesión actualmente
   */
  validaUsarioEnSesion() {
    this.comun.cargandoPrincipal = true;
    if (this.comun.validaSesionExistente()) {
      if (localStorage.getItem(this.comun.certificadoKeyLocal)) {
        if (this.comun.obtenerDatosSesion()) {
          const EMPLEADO = JSON.parse(this.comun.obtenerDatosSesion());
          this.empleadoLogeado = { nombre: EMPLEADO.nombre, puesto: EMPLEADO.puesto };
          this.comun.cargandoPrincipal = false;
          if (localStorage.getItem(this.comun.fotoKeyLocal)) {
            this.imagePath = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.comun.obtieneFotoLocal());
          } else {
            this.obtenerFoto();
          }
        } else {
          this.obtenerDatosEmpleado();
        }
        this.obtenerEmpresas();
      } else {
        this.obtenerCertificadoPortal();
      }
    } else {
      this.comun.cargandoPrincipal = false;
      this.cerrarSesion();
    }
  }

  /**
   * Método que llama a la función que consume el servicio de login para obtener el certificado
   */
  obtenerCertificadoPortal() {
    if (this.comun.sesion.ip !== '' && this.comun.sesion.hostname !== '' && this.comun) {
      const request: CertificadoRequest = {
        cabRequest: {
          cer: '',
          ip: this.comun.sesion.ip,
          nombrePC: this.comun.sesion.hostname
        },
        tokenDeAcceso: this.comun.sesion.tokenAcceso
      };

      this.empleadoService.obtenerCertificado(request).toPromise().then(
        response => {
          if (response.cabResponse.codResponse !== undefined && response.cabResponse.codResponse === 0) {
            localStorage.setItem(this.comun.certificadoKeyLocal, response.cer);
            this.comun.sesion.certificado = localStorage.getItem(this.comun.certificadoKeyLocal);
            this.comun.redirigeAListado();
          } else {
            this.comun.creaAlerta(3, 'No se pudo generar una sesión correctamente', this.comun.RECURSOS.COMUNES.headerCertificadoInvalido);
          }
        },
        error => this.comun.cargandoPrincipal = false
      ).then(
        () => {
          if (this.comun.sesion.certificado !== '' && this.comun.sesion.certificado !== undefined) {
            this.obtenerDatosEmpleado();
            this.obtenerEmpresas();
          } else {
            this.cerrarSesion();
          }
        }
      ).then(() => this.comun.cargandoPrincipal = false);
    }
  }

  /**
   * Cierra la sesión actual
   */
  cerrarSesion() {
    this.comun.cerrarSesionEmpleado();
    this.cerrarToggle();
  }

  /**
   * Método que crea las variables locales para empezar una sesión
   */
  login() {
    this.cerrarToggle();
    this.authService.login();
    this.authService.parseaDatosLocalStorage();
    this.validaUsarioEnSesion();
  }
}
