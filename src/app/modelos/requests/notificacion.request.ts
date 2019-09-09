import { CabeceroRequest } from './cabecero.request';
/**
 * Modelo que contiene los atributos del request de notificación
 */
export class NotificacionRequest {
    /**
     * Cabecero request
     */
    public cabRequest: CabeceroRequest = CabeceroRequest.cabeceroRequest();
    /**
     * Lista de empleados como destinatarios
     */
    public lstEmpleados: string[] = [];
    /**
     * Titulo de la notificacion
     */
    public titulo: string;
    /**
     * Mensaje de la notificación
     */
    public cuerpoMensaje: string;
    /**
     * Click action
     */
    public clickAction = 'ActionInfo';
    /**
     * Sonido
     */
    public sound = 'Default';
}
