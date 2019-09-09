import { CabeceroRequest } from './cabecero.request';
/**
 * Modelo que contiene los datos dwel request de la foto
 */
export class FotoRequest {
    /**
     * Atributos del modelo
     * @param cabRequest Cabecero request
     * @param numeroEmpleado Número de empleado
     * @param idEmpresa Id de empresa
     */
    constructor(
        public cabRequest: CabeceroRequest,
        public numeroEmpleado: string,
        public idEmpresa: string) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static fotoRequest() {
        return new FotoRequest(CabeceroRequest.cabeceroRequest(), '', '');
    }
}
