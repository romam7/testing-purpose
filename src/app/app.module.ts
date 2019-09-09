import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es-MX';

import { ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AgmCoreModule } from '@agm/core';

// tslint:disable-next-line: max-line-length
import { ReactivarDesactivarUsuarioComponent } from './componentes/soporte/modales/reactiva-desactiva-usuario/reactiva-desactiva-usuario.component';
import { NotificacionesComponent } from './componentes/soporte/notificaciones/notificaciones.component';
import { ListarEmpleadosComponent } from './componentes/soporte/administracion/empleados/listar-empleados.component';
import { PreguntasFrequentesComponent } from './componentes/soporte/preguntas-frequentes/preguntas-frequentes.component';
import { HomeComponent } from './componentes/estructura/home/home.component';
import { HeaderComponent } from './componentes/estructura/header/header.component';
import { MenuComponent } from './componentes/estructura/menu/menu.component';
import { UbicacionesComponent } from './componentes/soporte/administracion/ubicaciones/ubicaciones.component';
import { TransporteGsComponent } from './componentes/soporte/administracion/transporte-gs/transporte-gs.component';
import { AltaConductorComponent } from './componentes/soporte/modales/alta-conductor/alta-conductor.component';
import { AltaPosicionValidaComponent } from './componentes/soporte/modales/alta-posicion-valida/alta-posicion-valida.component';
import { EditarUsuarioComponent } from './componentes/soporte/modales/editar-usuario/editar-usuario.component';
import { HeaderInterceptorService } from './services/interceptores/header.interceptor.service';
import { MarcajesComponent } from './componentes/soporte/administracion/empleados/marcajes/marcajes.component';
import { PosicionesComponent } from './componentes/soporte/administracion/empleados/posiciones/posiciones.component';
import { MostrarMapaComponent } from './componentes/soporte/modales/mostrar-mapa/mostrar-mapa.component';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';

import { FormatoFechaPipe } from './pipes/formato-fecha.pipe';
import { SoloNumerosDirective } from './directivas/solo-numeros.directive';
import { SoloTextoDirective } from './directivas/solo-texto.directive';

import { DatosComunesService } from './services/helpers/comun.datos';
import { EmpleadoService } from './services/empleado.service';
import { LogInterceptorService } from './services/interceptores/log-interceptor.service';
import { AuthInterceptorService } from './services/interceptores/auth.interceptor.service';

registerLocaleData(localeES, 'es');

@NgModule({
  declarations: [
    /** COMPONENTES */
    AppComponent,
    HomeComponent,
    FormatoFechaPipe,
    HeaderComponent,
    MenuComponent,
    ListarEmpleadosComponent,
    PreguntasFrequentesComponent,
    ReactivarDesactivarUsuarioComponent,
    NotificacionesComponent,
    EditarUsuarioComponent,
    UbicacionesComponent,
    TransporteGsComponent,
    AltaConductorComponent,
    AltaPosicionValidaComponent,
    MarcajesComponent,
    PosicionesComponent,
    MostrarMapaComponent,
    /** DIRECTIVAS */
    SoloNumerosDirective,
    SoloTextoDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      preventDuplicates: true,
    }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxPaginationModule,
    NgxLoadingModule.forRoot({
        primaryColour: '#ffcd00',
        secondaryColour: '#a4a4a4',
        tertiaryColour: '#67656f',
        backdropBorderRadius: '3px'
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB8NHRyTRI8eq7y2vSLKd-XOdokBZib0sw'
    })
  ],
  providers: [
    EmpleadoService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LogInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'es' },
    DatosComunesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
