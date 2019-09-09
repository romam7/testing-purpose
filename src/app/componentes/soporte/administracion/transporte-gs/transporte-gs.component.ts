import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Subscription } from 'rxjs';
import { ReactivarDesactivarUsuarioComponent } from '../../modales/reactiva-desactiva-usuario/reactiva-desactiva-usuario.component';
import { CambiaEstatusEmpleadoRequest } from 'src/app/modelos/requests/estatus.empleado.request';
import { ConductoresResponse } from 'src/app/modelos/responses/conductores.response';
import { AltaConductorComponent } from '../../modales/alta-conductor/alta-conductor.component';
import { AuthService } from 'src/app/services/auth.service';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;

@Component({
  selector: 'app-transporte-gs',
  templateUrl: './transporte-gs.component.html'
})
export class TransporteGsComponent implements OnInit {
  /**
   * Servirá como helper para que almacene el numeroEmpleado del elemento cuando se de clic
   * en desactivar/reactivar y así pasarlo como parámetro al modal.
   */
  conductorSeleccionado: any;
  /**
   * Texto que indica la carga de información
   */
  cargandoTexto = this.comun.RECURSOS.COMUNES.textoBuscando;
  /**
   * Almacena el empleado editado para proceder con la detección de cambios
   */
  conductorEditado = '';

  /**
   * Setea la configuración que la modal configuracionDesactivar va a recibir (title, text, idModal)
   */
  configuracionDesactivar = {
    title: 'Desactivar conductor',
    text: 'El conductor seleccionado cambiará de estatus Activo a Inactivo. ¿Desea continuar?',
    idModal: 'modalDesactivarEmpleado'
  };
  /**
   * Setea la configuración que la modal modalEditarEmpleado va a recibir (title, idModal)
   */
  configuracionAlta = {
    title: 'Registra un nuevo conductor',
    idModal: 'modalAltaConductor'
  };
  /**
   * Setea la configuración que la modal configuracionDesactivar va a recibir (title, text, idModal)
   */
  configuracionReactivar = {
    title: 'Reactivar conductor',
    text: 'El conductor seleccionado cambiará de estatus Inactivo a Activo. ¿Desea continuar?',
    idModal: 'modalReactivarEmpleado'
  };
  /**
   * ViewChild para la modal de desactivar al empleado
   */
  @ViewChild('desactivarEmpleadoModalViewChild', { static: false }) desactivarEmpleadoModalViewChild: ReactivarDesactivarUsuarioComponent;
  /**
   * ViewChild para la modal de desactivar al empleado
   */
  @ViewChild('reactivarEmpleadoModalViewChild', { static: false }) reactivarEmpleadoModalViewChild: ReactivarDesactivarUsuarioComponent;
  /**
   * ViewChild para la modal de alta conductor
   */
  @ViewChild('altaConductorModalViewChild', { static: false }) altaConductorModalViewChild: AltaConductorComponent;
  /**
   * ViewChild para la modal del customTemplate de cargando
   */
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  /**
   * Toma la subscripción al servicio que se va a consumir
   */
  private suscriptor: Subscription;
  /**
   * Intervalo de tiempo en el que se ejecutara el timeOut
   */
  intervalo: any;
  /**
   * Arreglo de conductores
   */
  listadoConductores: ConductoresResponse = ConductoresResponse.conductores();
  /**
   * Arreglo con los estatus de los conductores
   */
  estatusConductores = [
    {
      idEstatus: 1,
      descripcion: 'Activo'
    },
    {
      idEstatus: 2,
      descripcion: 'Suspendido'
    },
    {
      idEstatus: 3,
      descripcion: 'Inactivo'
    }
  ];
  /**
   * Crea los objetos para el funcionamimiento del componente
   * @param empleadoService Servicio que contiene todas las funciones para obtener información del back
   * @param comun Clase que contiene informcación compartida en todo el proyecto
   * @param header Componente del header que será utilizado para cerrar el toggle despleglado
   */
  constructor(
    private empleadoService: EmpleadoService,
    public comun: DatosComunesService,
    private authService: AuthService) { }

  /**
   * Al iniciar el componente se valida si existe alguna sesión existente para proceder con asignación de título, de lo contrario
   * se redigirge al home.
   */
  ngOnInit() {
    $('.contConfig').hide();
    if (this.authService.isAuthenticated()) {
      this.comun.tituloPagina = this.comun.RECURSOS.TRANSPORTE.tagTitulo;
      this.detectaCambiosListado();
      this.cargarConductores();
    } else {
      this.comun.redirigeAPrincipal();
    }
  }

  /**
   * Detecta los cambios que sufre un elemento de la lista y lo actualiza al momento
   */
  private detectaCambiosListado() {
    this.empleadoService.notificarCambio.subscribe(conductor => {
      this.listadoConductores.conductores = this.listadoConductores.conductores.map(coductorOriginal => {
        if (conductor.numeroEmpleado === coductorOriginal.numeroEmpleado) {
          coductorOriginal.numeroEmpleado = conductor.numeroEmpleado;
          coductorOriginal.noLicencia = conductor.noLicencia;
          coductorOriginal.vigencia = conductor.vigencia;
          coductorOriginal.estatusConductor = conductor.estatusConductor;
          coductorOriginal.fechaRegistro = conductor.fechaRegistro;
        }
        return coductorOriginal;
      });
    });
  }

  /**
   * Detecta el empleado que ha sido editado y asigna valor a variable que se usa para asignar estilos a la fila editada
   */
  detectaConductorEditado(event) {
    this.cargarConductores();
    this.conductorEditado = event.conductorEditado;
  }

  /**
   * Función para desactivar al conductor
   * @param conductor Objeto que contiene la información del conductor
   * @param tipoOperacion 1 es reactivar, 3 desactivar
   */
  desactivarConductor(conductor: any, tipoOperacion: number) {
    this.conductorEditado = '';
    let cambioEstatus: CambiaEstatusEmpleadoRequest = CambiaEstatusEmpleadoRequest.cambiaEstatusEmpleado();
    cambioEstatus = {
      idEmpleado: conductor.numeroEmpleado,
      tipo: tipoOperacion,
      tipoUsuario: 'Conductor',
      cabRequest: this.comun.asignaValorRequest(cambioEstatus.cabRequest)
    };
    this.comun.loading = true;
    this.empleadoService.activarDesactivarEmpleado(cambioEstatus).subscribe(
      response => {
        if (response && response.codResponse !== undefined) {
          if (response.codResponse === 0) {
            this.conductorSeleccionado.estatus = tipoOperacion;
            this.empleadoService.notificarCambio.emit(this.conductorSeleccionado);
            const event = { conductorEditado: conductor.numeroEmpleado };
            if (tipoOperacion === 1) {
              this.comun.creaAlerta(4, this.comun.RECURSOS.LISTAR.msjEmpReactivado, this.comun.RECURSOS.LISTAR.headerEmpReactivado);
            } else {
              this.comun.creaAlerta(2, this.comun.RECURSOS.LISTAR.msjEmpDesactivado, this.comun.RECURSOS.LISTAR.headerEmpDesactivado);
            }
            this.detectaCambiosListado();
            this.detectaConductorEditado(event);
          }
          if (response.codResponse === -1) {
            this.comun.creaAlerta(3, this.comun.RECURSOS.LISTAR.msjErrorCambioEstatus, this.comun.RECURSOS.LISTAR.headerErrorServicio);
          }
          this.comun.validaCertificado(response.codResponse);
        } else {
          this.comun.creaAlerta(3, this.comun.RECURSOS.LISTAR.msjErrorCambioEstatus, this.comun.RECURSOS.LISTAR.headerErrorServicio);
        }
        this.comun.loading = false;
      },
      error => {
        this.comun.loading = false;
        this.comun.creaAlerta(3, this.comun.RECURSOS.LISTAR.msjErrorCambioEstatus, this.comun.RECURSOS.LISTAR.headerErrorServicio);
      }
    );

    // Si el empleado desactivado es el mismo que se encuentra en sesión entonces le cierra la sesión
    if (this.comun.obtenerDatosSesion()) {
      const EMPLEADO = JSON.parse(this.comun.obtenerDatosSesion());
      if (EMPLEADO.numeroEmpleado === conductor.numeroEmpleado) {
        this.comun.cerrarSesionEmpleado();
      }
    }
  }

  /**
   * Muestra la modal de acuerdo al su id
   * @param idModal Corresponde al id de la modal que se desea abrir
   * @param conductor Objeto que se usa para la edición de datos, no requerido
   */
  public showModal(idModal: string, conductor?: any) {
    this.conductorEditado = '';
    $('.contConfig').hide();
    switch (idModal) {
      case 'modalDesactivarEmpleado':
        this.conductorSeleccionado = conductor;
        this.desactivarEmpleadoModalViewChild.showModal('modalDesactivarEmpleado');
        break;
      case 'modalReactivarEmpleado':
        this.conductorSeleccionado = conductor;
        this.reactivarEmpleadoModalViewChild.showModal('modalReactivarEmpleado');
        break;
      case 'modalAltaConductor':
        this.altaConductorModalViewChild.showModal('modalAltaConductor');
        break;
    }
  }

  /**
   * Método que filtra los empleados por medio de un filtro inicial dado
   * @param event Key presionada (solo se valida si fue Enter)
   */
  cargarConductores() {
    $('.contConfig').hide();
    this.conductorEditado = '';
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
    this.comun.loading = true;
    this.intervalo = setTimeout(() => {
      this.cargandoTexto = this.comun.RECURSOS.COMUNES.demoraEnCarga;
      this.comun.validaCargando(this.customLoadingTemplate);
    }, 10000);
    this.suscriptor =
      this.empleadoService.obtenerTodosConductores(
        this.comun.asignaValorRequestGenerico('')).subscribe(
          response => {
            if (response.cabResponse !== undefined) {
              if (response.conductores !== undefined && response.cabResponse.codResponse === 0 && response.conductores.length > 0) {
                this.listadoConductores = response;
                this.comun.configPaginacion = {
                  itemsPerPage: 15,
                  currentPage: 1,
                  totalItems: response.conductores.length
                };
              }
              if (response.cabResponse.codResponse === -1) {
                this.comun.creaAlerta(1,
                  this.comun.RECURSOS.TRANSPORTE.msErrorConductores, this.comun.RECURSOS.COMUNES.sinCoincidencias);
                this.cancelarCarga();
              }
              this.comun.validaCertificado(response.cabResponse.codResponse);
            } else {
              this.comun.creaAlerta(3, this.comun.RECURSOS.TRANSPORTE.msErrorConductores, this.comun.RECURSOS.COMUNES.headerErrorServicio);
              this.listadoConductores = ConductoresResponse.conductores();
            }
            this.comun.loading = false;
            clearTimeout(this.intervalo);
            this.comun.loadingTemplate = null;
          },
          error => {
            this.comun.creaAlerta(3, this.comun.RECURSOS.TRANSPORTE.msErrorConductores, this.comun.RECURSOS.COMUNES.headerErrorServicio);
            this.cancelarCarga();
          }
        );
  }

  /**
   * Detecta el cambio en la página
   * @param event Pagina actual
   */
  pageChanged(event: any) {
    this.conductorEditado = '';
    this.comun.configPaginacion.currentPage = event;
  }

  /**
   * Limpia los valores de las variables usadas en la carga de empleados
   */
  public cancelarCarga(): void {
    this.conductorEditado = '';
    this.listadoConductores.conductores = [];
    this.comun.cancelarCarga(this.suscriptor);
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
  }

}
