import { CabeceroResponse } from './cabecero.response';
import { Empleado } from '../modelos/empleado';
/**
 * Modelo que contiene los datos de la respuesta de un sol empleado
 */
export class EmpleadoResponse extends Empleado {
    /**
     * Atributos del modelo
     * @param cabResponse Cabecero response
     * @param numeroEmpleado Número de empleado
     * @param numeroTelefono Número de teléfono
     * @param nombre Nombre del empleado
     * @param idEmpresa Id de la unidad de negocio
     * @param correo Correo del empleado
     * @param numeroEmpleadoJefe Número de empleado del jefe
     * @param estatus Estatus del empleado
     * @param puesto Puesto del empleado
     * @param ceco Centro de costos
     * @param idSupervisor Id del supervisor
     * @param sexo Sexo del empleado
     * @param idPerfil Tipo de perfil del empleado (1-Geografía, 0-Corporativo)
     * @param usuarioSM Indica si el usuario es o no usuario de socio mas
     */
    constructor(
        public cabResponse: CabeceroResponse,
        public numeroEmpleado: string,
        public numeroTelefono: string,
        public nombre: string,
        public idEmpresa: string,
        public correo: string,
        public numeroEmpleadoJefe: string,
        public estatus: number,
        public puesto: string,
        public ceco: number,
        public idSupervisor: string,
        public sexo: string,
        public idPerfil: number,
        public usuarioSM: boolean,
        ) {
            super(numeroEmpleado, numeroTelefono, nombre, idEmpresa, correo,
                numeroEmpleadoJefe, estatus, puesto, ceco, idSupervisor, sexo, idPerfil, usuarioSM);
         }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static empleado() {
        return new EmpleadoResponse(CabeceroResponse.cabeceroResponse(), '', '', '', '', '', '', 0, '', 0, '', '', 0, false);
    }
}
