import { CabeceroRequest } from './cabecero.request';
/**
 * Modelo que contiene los datos del request de empleado
 */
export class EmpleadoRequest {
    /**
     * Atributos del modelo
     * @param cabRequest Cabecero request
     * @param idEmpleado Número de empleado
     * @param nombre Nombre del empleado
     * @param puesto Puesto
     * @param idEmpresa Id de unidad de negocio
     * @param ceco Centro de costos
     * @param idSupervisor Id supervisor
     * @param numeroTelefono Número de teléfono
     */
    constructor(
        public cabRequest: CabeceroRequest,
        public idEmpleado: string,
        public nombre: string,
        public puesto: string,
        public idEmpresa: string,
        public ceco: number,
        public idSupervisor: string,
        public numeroTelefono: string,
        public idPerfil: number) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static empleado() {
        return new EmpleadoRequest(CabeceroRequest.cabeceroRequest(), '', '', '', '', 0, '', '', 0);
    }
}
