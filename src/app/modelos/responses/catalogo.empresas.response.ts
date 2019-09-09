import { CabeceroResponse } from './cabecero.response';
import { Empresa } from '../modelos/empresa';
/**
 * Modelo que contiene los datos del catalogo de empresas
 */
export class CatalogoEmpresasResponse {
    /**
     * Atributos del modelo
     * @param cabResponse Cabecero response
     * @param empresas Listado de objetos de empresa
     */
    constructor(
        public cabResponse: CabeceroResponse,
        public empresas: Empresa[]) { }

    /**
     * Crea un objeto del modelo con los valores inicializados
     */
    public static empresaResponse() {
        return new CatalogoEmpresasResponse(CabeceroResponse.cabeceroResponse(), []);
    }
}
