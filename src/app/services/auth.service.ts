import { Injectable } from '@angular/core';
import { DatosComunesService } from './helpers/comun.datos';
/**
 * Para hacer uso de JQuery
 */
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public comun: DatosComunesService) { }

  /**
   * Valida si la variable local con los datos de sesión existen, de lo contrario llama al método que la crea
   */
  login() {
    $('.contConfig').hide();
    if (!localStorage.getItem(this.comun.datosSesionKeyLocal)) {
      this.guardaDatosLocal();
    }
  }

  /**
   * Método que crea la variable local con datos en base64
   */
  guardaDatosLocal() {
    localStorage.setItem(
      this.comun.datosSesionKeyLocal,
      // tslint:disable-next-line: max-line-length
      'eyJOdW1lcm9FbXBsZWFkbyI6IjI5MjgyMSIsIklQIjoiMTAuNTEuMTQ1LjMwIiwiSG9zdE5hbWUiOiJCQVoxNTM5NTM3IiwiVG9rZW5BY2Nlc28iOiJleUpoYkdjaU9pSkJNVEk0UzFjaUxDSmxibU1pT2lKQk1USTRSME5OSWl3aWRIbHdJam9pU2xkVUlpd2llbWx3SWpvaVJFVkdJaXdpYTJsa0lqb2libUZ0TFRJaWZRLnlhTjVtdFcwelNaUV93emNTTzNUQ0lCWmNJMzAtaWZWLnFfMTRsWVBGSWlaelJReWsuU1BwUmxGU2FLX0U2OThtaFpTLUx1TEtLNDUweWJpVThVWmFJZTNodkNrV2F2NmZUcXRUWXZpdDVuWXp4ek01QXlkazNiYWdpSlMxMU1xMzBMbTh5QzJnTm1USVNueWNoaFlGNHgweWVneFdfM29ESDdKZUNWN1N2cFh2MnIySW9Lcy1iZENVLU5lYXFuVC0tbm1mc05MMEZxTzJYbGJGRC1SLVp0bW5ER3FQeE5PdXl0T3AtRkNydWtnMVdIMXNSc0pKTlJnWW5YaEs1Wk0xblNyQlRtbDRPMDRENE9xTUVPZXVMZ0FyN2NKa1hJc2JsdEpmYjZtUzNCVGRTSnFsbWpacXF1aVA4OEc1NVNpRXFWTHJJVHpPSFNRSVJHb3JfbndIYWFhMG9rWUMySHJiN0JLT1ZXWU9XbXRTZGY3ZndDWFhWRUJiUW9LVFgzZnN5Uy1sc3ZRcDdRbmd3NXZNUU85TFZLeFctOVloUV9WZFdsRlNSNS1sSENYM09hZ05BMEZJNDdfbkUwdmM3SXZiNkRXRlZZNVA1elNQN25zRlpVVndCR21DN2xxNDQ4SXNzc2NmeExmSEVyVGxaZXdOa245RU16MnluNFJZTlJkZjBIRzhEeDJLZFNKemRjOHJ6QXNwQjVVNmlRNlk2azh0ZmpoVWZvZFlPY1hXbmdvWXNGNjdLZnlmTVd0NGVHNjhZZ2drOFJYdzdRcjBsTkY2V1I5NHpqc1RkT3Z1U24tem5fbGltREYtQUxsZ25ueUNXUWQ3MDZ3cGNBQ1hzTGp5UnJNS1N0dVlUX0tKclMwTWtvbHN0VUVhVkNfTHBhbXRjWTdDSGZfUEN2N2tZbUNYWXVjTVl1X0lJbk1HMXVmX3FQd21HWEtYbXhKakszRjNfLWNrblktSVlDcHF5TGFEcDlvN0xtWENOR1BXMXU4TWcxQTI1ZmhjTFhDQjY1QkZ6bHVVVGFTY1RqTjlRTUozbU8zem5HclhUTnh1NDdLU0RhZEdoLXJ3R2pXeS1zVm5DLVlyelNLcGtBT1hGN1R0cXNpUHdaYVROcGZ1RjdKd1ljY0F2Ql9nVV9XYnpQOU9pVWsxMUM5QWFyMXNNME9FYlJGNms5ZG1ycHFKeEh6RGhTNUc3aUlWaDN3WXphRV95TFp5R0hrdGVzejFuTWJWTy0xbHhNM19ybkJJYlR2Ml85dzJqNHdaaDl6aENkZm81SVBweHVYaTdrSDBuX1hOdGJtRWdaaE11S2hLMHdMN3ZjUFhZZHkwVFA3bkpBYlFZZDN5c3VwQmRiN3gyT2o0S0RJSFBMU1M2bDhOZGFDTk03Q3J0RkdKQnEzSFRtVDdleDgxSm1rNkpJeGJwYm1PcmZYSDU1SlFkS29UNHRuY2hkQzIwQmVOb2ZZZFBlT1dsN0hHc3NqSHZ4b1BMZUtVZ3BNQUJkTXR6NG1YbjJCdERxSndnZjB6b2VXeTl5MzhIS0NndnZHSWF5SlFadzJvVGpqRG1LRGV6RlRaNEc3ZFFlN0tFSkE2UEE5cDE1eE16LXdSWnpwS1YySmRPdG9nOHNseHF6REc5VVptZlh3ZENRYmxUcnRnUVZkYTJRSS1UUEZmM09Rc3BGbXhtbzY0Y3JhVXZFd3dTX1JqZWwyWTNRQnEwbGNaV0V2dTM3WVdUVGZWa1N1OU84REVFenl4ZnhhM0FfcEM4QnRGLWdySFRTcjNweUdOMXI0WnJSeFcyaHV4bnlEUGVWc1lfbHZGZHVSdG1zLV85OEZJSnlPUDhZdUhITm5TYW55SEE5MURUMWlWUndFZlNILVoyRDJ6cUJoSE94UEJZQjVOSGlwZ1lrSzJ2MEstaW5kSUM0NnpsN2FqTGNQN0RzY3Y0TjUweVJGSXAwSmZaRUZRamtpQVE1ZG9GMXhoc0tLUl9mRXpqRlp0Qmozc1Q3WG0tRzdaRUVkd0tKN2phOWRhaTc2engyN3RrNlhjY2IxelpLdkxuUDN6RzUxdm9ZSkZGOVlmQ1FQUUNDOTVENS13Mm9lYkhDRl9Gd0QzQXMtV1RScTRoNmt3OGEzUDNCTUlYanNXdlBxVXR4bEJtVVl2X01LdVExWEtNY21LZUZTY0NTZndtMXZkWFFjbmdCc0htd2cuMmtBX0dlaFYzR0x4VG1BQW1oMUpFUSJ9'
    );
  }

  /**
   * Si la variable del local de datos existe entonces parsea sus datos para asignarlos a las respectivas variables
   */
  parseaDatosLocalStorage() {
    if (localStorage.getItem(this.comun.datosSesionKeyLocal)) {
      const datos = JSON.parse(atob(localStorage.getItem(this.comun.datosSesionKeyLocal)));
      if (datos !== null) {
        this.comun.sesion.empleado = datos[this.comun.empleadoKey];
        this.comun.sesion.ip = datos[this.comun.ipKey];
        this.comun.sesion.hostname = datos[this.comun.hostKey];
        this.comun.sesion.tokenAcceso = datos[this.comun.tokenKey];
      } else {
        this.comun.creaAlerta(1, 'Los datos de sesión no existen o son corruptos.', 'Sesión inválida');
      }
    }
  }

  /**
   * Determina si existe un usuario autenticado validando si existe la variable local de datos
   */
  isAuthenticated(): boolean {
    const datos = localStorage.getItem(this.comun.datosSesionKeyLocal);
    if (datos) {
      return true;
    }
    return false;
  }
}
