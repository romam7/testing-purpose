import { CabeceroRequest } from './cabecero.request';

/**
 * Modelo que contiene los datos del certificado request
 */
export class CertificadoRequest {
    /**
     * Atributos del modelo
     * @param tokenDeAcceso Access token otorgado por DSI
     * @param cabRequest Objeto de cabecero request
     */
    constructor(
        public tokenDeAcceso: string,
        public cabRequest: CabeceroRequest,
    ) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static certificado() {
        return new CertificadoRequest('', CabeceroRequest.cabeceroRequest());
    }
}
