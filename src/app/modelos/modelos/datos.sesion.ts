/**
 * Modelo que contiene los datos de la sesión
 */
export class DatosSesion {
    /**
     * Atributos que se envian en el header de cada request
     * @param empleado Número de empleado
     * @param certificado Certificado generado desde el back
     * @param ip Ip del equipo del que se hace la petición
     * @param hostname Nombre del equipo del que se hace la petición
     * @param tokenAcceso Token de acceso generado por DSI para poder obtener el certificado
     */
    constructor(
        public empleado: string,
        public certificado: string,
        public ip: string,
        public hostname: string,
        public tokenAcceso: string
    ) {}

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static sesion() {
        return new DatosSesion('', '', '', '', '');
    }
}
