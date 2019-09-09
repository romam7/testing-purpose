import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ReactivarDesactivarUsuarioComponent } from '../../modales/reactiva-desactiva-usuario/reactiva-desactiva-usuario.component';
import { CambiaEstatusEmpleadoRequest } from 'src/app/modelos/requests/estatus.empleado.request';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
import { EmpleadosResponse } from 'src/app/modelos/responses/empleados.response';
import { EditarUsuarioComponent } from '../../modales/editar-usuario/editar-usuario.component';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;
/**
 * Componente que tiene como funcionalidad principal listar a los empleados que coincidan con un filtro, además puede:
 *
 * - Mostrar en una tabla los empleados encontrados
 *
 *  - Mostrar modal de edición de información de un empleado elegido
 *
 *  - Mostrar modal de reactivación/desactivación de un empleado
 *
 *  - Mostrar paginación si los empleados filtrados exceden 10 elementos
 *
 * - Mostrar modal para el envío de notificaciones
 */
@Component({
  selector: 'app-listar-empleados',
  templateUrl: './listar-empleados.component.html'
})
export class ListarEmpleadosComponent implements OnInit {
  /**
   * Almacena todos los empleados obtenidos mediante el servicio
   */
  empleadosFiltro: EmpleadosResponse = EmpleadosResponse.empleado();
  /**
   * Servirá como helper para que almacene el numeroEmpleado del elemento cuando se de clic
   * en desactivar/reactivar y así pasarlo como parámetro al modal.
   */
  empleadoSeleccionado: any;
  /**
   * Texto que indica la carga de información
   */
  cargandoTexto = this.comun.RECURSOS.COMUNES.textoBuscando;
  /**
   * Elemento usado para buscar a los empleados que coincidan con este filtro
   */
  nombreEmpleadoFiltro = '';
  /**
   * Almacena el empleado editado para proceder con la detección de cambios
   */
  empleadoEditado = '';

  /**
   * Setea la configuración que la modal configuracionDesactivar va a recibir (title, text, idModal)
   */
  configuracionDesactivar = {
    title: 'Desactivar empleado',
    text: 'El empleado seleccionado cambiará de estatus Activo a Inactivo. ¿Desea continuar?',
    idModal: 'modalDesactivarEmpleado'
  };
  /**
   * Setea la configuración que la modal modalReactivarEmpleado va a recibir (title, text, idModal)
   */
  public configuracionReactivar = {
    title: 'Reactivar empleado',
    text: 'El empleado seleccionado cambiará de estatus Inactivo a Activo. ¿Desea continuar?',
    idModal: 'modalReactivarEmpleado'
  };
  /**
   * Setea la configuración que la modal modalEditarEmpleado va a recibir (title, idModal)
   */
  public configuracionEdicion = {
    title: 'Editar información del empleado',
    idModal: 'modalEditarEmpleado'
  };
  /**
   * ViewChild para la modal de desactivar al empleado
   */
  @ViewChild('desactivarEmpleadoModalViewChild', { static: false }) desactivarEmpleadoModalViewChild: ReactivarDesactivarUsuarioComponent;
  /**
   * ViewChild para la modal de reactivar al empleado
   */
  @ViewChild('reactivarEmpleadoModalViewChild', { static: false }) reactivarEmpleadoModalViewChild: ReactivarDesactivarUsuarioComponent;
  /**
   * ViewChild para la modal de editar información del empleado
   */
  @ViewChild('editarEmpleadoModalViewChild', { static: false }) editarEmpleadoModalViewChild: EditarUsuarioComponent;
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
      this.comun.tituloPagina = this.comun.RECURSOS.LISTAR.tituloListar;
      this.detectaCambiosListado();
    } else {
      this.comun.redirigeAPrincipal();
    }
  }

  /**
   * Detecta los cambios que sufre un elemento de la lista y lo actualiza al momento
   */
  private detectaCambiosListado() {
    this.empleadoService.notificarCambio.subscribe(empleado => {
      this.empleadosFiltro.empleados = this.empleadosFiltro.empleados.map(empleadoOriginal => {
        if (empleado.idEmpleado === empleadoOriginal.numeroEmpleado) {
          empleadoOriginal.ceco = empleado.ceco;
          empleadoOriginal.numeroEmpleado = empleado.idEmpleado;
          empleadoOriginal.idEmpresa = empleado.idEmpresa;
          empleadoOriginal.idSupervisor = empleado.idSupervisor;
          empleadoOriginal.nombre = empleado.nombre;
          empleadoOriginal.numeroTelefono = empleado.numeroTelefono;
          empleadoOriginal.puesto = empleado.puesto;
        }
        return empleadoOriginal;
      });
    });
  }

  /**
   * Detecta el empleado que ha sido editado y asigna valor a variable que se usa para asignar estilos a la fila editada
   */
  detectaEmpleadoEditado(event) {
    this.empleadoEditado = event.empleadoEditado;
  }

  /**
   * Función para activar/desactivar al empleado
   * @param empleado Objeto que contiene la información del empleado
   * @param tipoOperacion 1 es reactivar, 0 desactivar
   */
  activarDesactivarEmpleado(empleado: any, tipoOperacion: number) {
    this.empleadoEditado = '';
    let cambioEstatus: CambiaEstatusEmpleadoRequest = CambiaEstatusEmpleadoRequest.cambiaEstatusEmpleado();
    cambioEstatus = {
      idEmpleado: empleado.numeroEmpleado,
      tipo: tipoOperacion,
      tipoUsuario: 'Empleado',
      cabRequest: this.comun.asignaValorRequest(cambioEstatus.cabRequest)
    };

    this.comun.loading = true;
    this.empleadoService.activarDesactivarEmpleado(cambioEstatus).subscribe(
      response => {
        if (response && response.codResponse !== undefined) {
          if (response.codResponse === 0) {
            this.empleadoSeleccionado.estatus = tipoOperacion;
            this.empleadoService.notificarCambio.emit(this.empleadoSeleccionado);
            const event = { empleadoEditado: empleado.numeroEmpleado };
            if (tipoOperacion === 1) {
              this.comun.creaAlerta(4, this.comun.RECURSOS.LISTAR.msjEmpReactivado, this.comun.RECURSOS.LISTAR.headerEmpReactivado);
            } else {
              this.comun.creaAlerta(2, this.comun.RECURSOS.LISTAR.msjEmpDesactivado, this.comun.RECURSOS.LISTAR.headerEmpDesactivado);
            }
            this.detectaCambiosListado();
            this.detectaEmpleadoEditado(event);
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
      if (EMPLEADO.numeroEmpleado === empleado.numeroEmpleado) {
        this.comun.cerrarSesionEmpleado();
      }
    }
  }

  /**
   * Muestra la modal de acuerdo al su id
   * @param idModal Corresponde al id de la modal que se desea abrir
   * @param empleado Objeto que se usa para la edición de datos, no requerido
   */
  public showModal(idModal: string, empleado?: any) {
    this.empleadoEditado = '';
    $('.contConfig').hide();
    switch (idModal) {
      case 'modalDesactivarEmpleado':
        this.empleadoSeleccionado = empleado;
        this.desactivarEmpleadoModalViewChild.showModal('modalDesactivarEmpleado');
        break;
      case 'modalReactivarEmpleado':
        this.empleadoSeleccionado = empleado;
        this.reactivarEmpleadoModalViewChild.showModal('modalReactivarEmpleado');
        break;
      case 'modalEditarEmpleado':
        this.editarEmpleadoModalViewChild.showModal('modalEditarEmpleado', empleado);
        break;
    }
  }

  /**
   * Método que filtra los empleados por medio de un filtro inicial dado
   * @param event Key presionada (solo se valida si fue Enter)
   */
  buscarEmpleado(event: any) {
    $('.contConfig').hide();
    this.empleadoEditado = '';
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
    if (event.key === 'Enter') {
      this.empleadosFiltro.empleados = [];
      if (this.nombreEmpleadoFiltro !== '' && this.nombreEmpleadoFiltro.length >= 4) {
        this.comun.loading = true;
        this.intervalo = setTimeout(() => {
          this.cargandoTexto = this.comun.RECURSOS.COMUNES.demoraEnCarga;
          this.comun.validaCargando(this.customLoadingTemplate);
        }, 10000);
        this.suscriptor =
          this.empleadoService.filtrarEmpleados(
            this.comun.asignaValorRequestGenerico(this.comun.removerAcentos(this.nombreEmpleadoFiltro.trim()))).subscribe(
              response => {
                if (response.cabResponse !== undefined) {
                  if (response.empleados !== undefined && response.cabResponse.codResponse === 0 && response.empleados.length > 0) {
                    this.empleadosFiltro = response;
                    this.comun.configPaginacion = {
                      itemsPerPage: 10,
                      currentPage: 1,
                      totalItems: response.empleados.length
                    };
                  }
                  if (response.cabResponse.codResponse === -1) {
                    this.comun.creaAlerta(1,
                      this.comun.RECURSOS.LISTAR.msjErrorFiltroEmpleados, this.comun.RECURSOS.COMUNES.sinCoincidencias);
                    this.cancelarCarga();
                  }
                  this.comun.validaCertificado(response.cabResponse.codResponse);
                } else {
                  this.comun.creaAlerta(3, this.comun.RECURSOS.LISTAR.msjErrorFiltroEmpleados,
                    this.comun.RECURSOS.COMUNES.headerErrorServicio);
                }
                this.comun.loading = false;
                clearTimeout(this.intervalo);
                this.comun.loadingTemplate = null;
              },
              error => {
                this.comun.creaAlerta(3, this.comun.RECURSOS.LISTAR.msjErrorFiltroEmpleados,
                  this.comun.RECURSOS.COMUNES.headerErrorServicio);
                this.cancelarCarga();
              }
            );
      }
      this.comun.preventDefault(event);
    }
  }

  /**
   * Detecta el cambio en la página
   * @param event Pagina actual
   */
  pageChanged(event: any) {
    this.empleadoEditado = '';
    this.comun.configPaginacion.currentPage = event;
  }

  /**
   * Método adjunto al evento (input) del cuadro de búsqueda que detecta si el input esta vacio limpia todos los valores
   * @param empleado Valor que contiene el input de búsqueda
   */
  limpiarResultados(empleado: any) {
    this.empleadoEditado = '';
    $('.contConfig').hide();
    if (empleado === '' || empleado.length === 0) {
      this.cancelarCarga();
    }
  }

  /**
   * Limpia los valores de las variables usadas en la carga de empleados
   */
  public cancelarCarga(): void {
    this.empleadoEditado = '';
    this.empleadosFiltro.empleados = [];
    this.comun.cancelarCarga(this.suscriptor);
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
  }
}
