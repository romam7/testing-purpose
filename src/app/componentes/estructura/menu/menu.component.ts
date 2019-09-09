import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatosComunesService } from 'src/app/services/helpers/comun.datos';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;
/**
 * Componente para la página del menú lateral
 */
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

  /**
   * Arreglo de tabs y sus submenus
   */
  tabs = [
    {
      tag: 'Soporte técnico',
      id: 1,
      enlace: null,
      links: [
        {
          tag: 'Administración de empleados',
          link: null,
          idPadre: 1,
          hijas: [
            {
              tagSub: 'Administra empleados',
              linkSub: 'empleados',
            },
            {
              tagSub: 'Consulta marcajes',
              linkSub: 'empleados/marcajes',
            },
            {
              tagSub: 'Consulta ubicaciones empleado',
              linkSub: 'empleados/posiciones',
            }
          ]
        },
        {
          tag: 'Administración de ubicaciones',
          link: 'ubicaciones',
          idPadre: 1,
          hijas: []
        },
        {
          tag: 'Administración TransporteGS',
          link: 'transporte',
          idPadre: 1,
          hijas: []
        },
        {
          tag: 'Notificaciones',
          link: 'notificacion',
          idPadre: 1,
          hijas: []
        },
        {
          tag: 'Preguntas frecuentes',
          link: 'faq',
          idPadre: 1,
          hijas: []
        }
      ],
    },
    {
      tag: 'Transporte',
      id: 1,
      enlace: '',
      links: [],
    }
  ];

  /**
   * Crea el objeto de la clase común a usar
   * @param comun Objeto de la clase de datos comunes
   */
  constructor(public comun: DatosComunesService, public authService: AuthService) { }

  /**
   * Al iniciar el componente cierra el menú si es que se encuentra abierto
   */
  ngOnInit() {
    this.ocultarMenu();
  }

  /**
   * Evita que se cierre el toggle actalmente abierto
   */
  noOcultar() {
    // tslint:disable-next-line: deprecation
    event.stopPropagation();
  }

  /**
   * Oculta el menú desplegado
   */
  ocultarMenu() {
    $('#effect').toggle(false);
  }
}
