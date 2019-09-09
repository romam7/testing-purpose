/**
 * Modelo que contiene los atributos de los datos de un empleado
 */
export class Empleado {
    /**
     * Atributos del modelo
     * @param numeroEmpleado Número de empleado
     * @param numeroTelefono Número de teléfono
     * @param nombre Nombre del empleado
     * @param idEmpresa Id de la unidad de negocio
     * @param correo Correo del empleado
     * @param numeroEmpleadoJefe Número de empleado del jefe
     * @param estatus Estatus del empleado
     * @param puesto Puesto del empleado
     * @param ceco Centro de costos
     * @param idSupervisor Id del supervisor
     * @param sexo Sexo del empleado
     * @param idPerfil Tipo de perfil del empleado (1-Geografía, 0-Corporativo)
     */
    constructor(
        public numeroEmpleado: string,
        public numeroTelefono: string,
        public nombre: string,
        public idEmpresa: string,
        public correo: string,
        public numeroEmpleadoJefe: string,
        public estatus: number,
        public puesto: string,
        public ceco: number,
        public idSupervisor: string,
        public sexo: string,
        public idPerfil: number,
        public usuarioSM: boolean) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static empleado() {
        return new Empleado('', '', '', '', '', '', 0, '', 0, '', '', 0, false);
    }
}
