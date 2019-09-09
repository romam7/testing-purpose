/**
 * Modelo que contiene los datos del cabecero request
 */
export class CabeceroRequest {
    /**
     * Atributos del modelo
     * @param cer Certificado
     * @param ip Ip desde donde la petición es hecha
     * @param nombrePC Nombre de la PC
     */
    constructor(
        public cer: string,
        public ip: string,
        public nombrePC: string
    ) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static cabeceroRequest() {
        return new CabeceroRequest('', '', '');
    }
}
