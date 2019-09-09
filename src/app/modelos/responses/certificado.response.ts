import { CabeceroResponse } from './cabecero.response';
/**
 * Modelo que contiene los datos de la respuesta del certificado
 */
export class CertificadoResponse {
    /**
     * Atributos del modelo
     * @param cabResponse Cabecero response
     * @param cer Certificado generado por el proyecto de Autenticación
     */
    constructor(
        public cabResponse: CabeceroResponse,
        public cer: string) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static certificadoResponse() {
        return new CertificadoResponse(CabeceroResponse.cabeceroResponse(), '');
    }
}