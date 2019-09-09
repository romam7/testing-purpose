/**
 * Modelo que contiene los atributos de respuesta cuando los marcajes son obtenidos
 */
export class Marcaje {
    /**
     * Atributos de respuesta de consulta asistencia
     */
    constructor(
        public idConsecutivo: number,
        public numeroEmpleado: string,
        public nombreEmpleado: string,
        public latitud: number,
        public longitud: number,
        public fecha: string,
        public bateria: number,
        public fechaReporte: string,
        public numeroPosicion: string,
        public nombrePosicion: string,
        public tipoMarcaje: string,
        public zonaHorario: string,
        public tipoRegistro: string) { }

    /**
     * Retorna un objeto del modelo con valores inicializados
     */
    public static marcaje() {
        return new Marcaje(0, '', '', 0.0, 0.0, '', 0, '', '', '', '', '', '');
    }
}
