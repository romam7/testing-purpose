import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
import { GenericoRequest } from 'src/app/modelos/requests/generico';
import { UbicacionesEmpleadoResponse } from 'src/app/modelos/responses/ubicaciones.empleado.response';
import { AuthService } from 'src/app/services/auth.service';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;

@Component({
  selector: 'app-posiciones',
  templateUrl: './posiciones.component.html'
})
export class PosicionesComponent implements OnInit {
  /**
   * Arreglo de posicones
   */
  ubicacionesEmpleado: UbicacionesEmpleadoResponse = UbicacionesEmpleadoResponse.ubicaciones();
  /**
   * Intervalo de tiempo en el que se ejecutara el timeOut
   */
  intervalo: any;
  /**
   * Texto que indica la carga de información
   */
  cargandoTexto = this.comun.RECURSOS.COMUNES.textoBuscando;
  /**
   * ViewChild para la modal del customTemplate de cargando
   */
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  /**
   * NgModel que corresponde al input de la fecha de inicio
   */
  fechaInicio = '';
  /**
   * NgModel que corresponde al input de la fecha de fin
   */
  fechaFin = '';
  /**
   * Número de empleado
   */
  numeroEmpleado = '';

  constructor(
    private empleadoService: EmpleadoService,
    public comun: DatosComunesService,
    private authService: AuthService) { }

  ngOnInit() {
    $('.contConfig').hide();
    if (this.authService.isAuthenticated()) {
      this.comun.tituloPagina = this.comun.RECURSOS.EMP_POSICION.tagTitulo;
    } else {
      this.comun.redirigeAPrincipal();
    }
  }

  /**
   * Detecta el cambio en la página
   * @param event Pagina actual
   */
  pageChanged(event: any) {
    this.comun.configPaginacion.currentPage = event;
  }

  /**
   * Limpia los valores de las variables usadas en la carga de empleados
   */
  public cancelarCarga(): void {
    this.ubicacionesEmpleado.ubicaciones = [];
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
    this.comun.loading = false;
  }

  /**
   * Valida la fechas obtenidas
   * @param fechaInicio Fecha de la cual se quiere empezar a consultar las asistencias
   * @param fechaFin Fecha hasta la cual se quiere consultar las asistencias
   */
  public consultarUbicaciones(event) {
    $('.contConfig').hide();
    clearTimeout(this.intervalo);
    this.comun.loadingTemplate = null;
    if (event.key === 'Enter') {
      if (this.numeroEmpleado === '' || this.numeroEmpleado === undefined) {
        return;
      } else {
        this.comun.loading = true;
        let ubicacionRequest: GenericoRequest = GenericoRequest.generico();
        ubicacionRequest = {
          cabRequest: this.comun.asignaValorRequest(ubicacionRequest.cabRequest),
          valor: this.numeroEmpleado
        };

        this.intervalo = setTimeout(() => {
          this.cargandoTexto = this.comun.RECURSOS.COMUNES.demoraEnCarga;
          this.comun.validaCargando(this.customLoadingTemplate);
        }, 10000);

        this.empleadoService.consultaUbicacionesEmpleado(ubicacionRequest).subscribe(
          response => {
            if (response) {
              if (response.cabResponse !== undefined) {
                if (response.cabResponse.codResponse === 0) {
                  this.ubicacionesEmpleado = response;
                }
                if (response.cabResponse.codResponse === -1) {
                  this.comun.creaAlerta(1, this.comun.RECURSOS.EMP_POSICION.msjErrorPosiciones,
                    this.comun.RECURSOS.COMUNES.sinCoincidencias);
                }
                this.comun.validaCertificado(response.cabResponse.codResponse);
              } else {
                this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio,
                  this.comun.RECURSOS.COMUNES.headerErrorServicio);
              }
            } else {
              this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio,
                this.comun.RECURSOS.COMUNES.headerErrorServicio);
            }
            this.comun.loading = false;
          },
          error => {
            this.comun.creaAlerta(3, this.comun.RECURSOS.COMUNES.msjOcurrioErrorServicio,
              this.comun.RECURSOS.COMUNES.headerErrorServicio);
            this.comun.loading = false;
          }
        );
      }
    }
  }

}
