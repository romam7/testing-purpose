import { CabeceroRequest } from './cabecero.request';
/**
 * Modelo que contiene los datos del request del conductor
 */
export class ConductorRequest {
    /**
     * Atributos del modelo
     * @param cabRequest Cabecero request
     * @param idEmpleado Número de empleado
     * @param noLicencia Número de licencua
     * @param vigencia Año de vigencia
     * @param estatusConductor Estatus actual del conductor
     */
    constructor(
        public cabRequest: CabeceroRequest,
        public idEmpleado: string,
        public noLicencia: string,
        public vigencia: number,
        public estatusConductor: number) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static conductor() {
        return new ConductorRequest(CabeceroRequest.cabeceroRequest(), '', '', 0, 0);
    }
}
