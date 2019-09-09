import { CabeceroRequest } from './cabecero.request';
/**
 * Modelo que contiene los datos del request de cambio de estatus
 */
export class CambiaEstatusEmpleadoRequest {
    /**
     * Atributos del modelo
     * @param cabRequest Cabecero request
     * @param idEmpleado Número de empleado
     * @param tipo Tipo de operación
     */
    constructor(
        public cabRequest: CabeceroRequest,
        public idEmpleado: string,
        public tipo: number,
        public tipoUsuario: string
    ) {}

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static cambiaEstatusEmpleado() {
        return new CambiaEstatusEmpleadoRequest(CabeceroRequest.cabeceroRequest(), '', 0, '');
    }
}
