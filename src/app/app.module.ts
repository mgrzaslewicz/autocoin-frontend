import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ServicesModule} from './services/services.module';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {AllowOnlyLoggedInGuard, AllowOnlyNotLoggedInGuard} from './shared';
import 'rxjs/Rx';
import {Oauth2TokenInterceptor} from './services/api/interceptors';
import {AllowOnlyShouldNotChangePasswordGuard} from './shared/guard/allow-only-should-not-change-password.service';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        ServicesModule
    ],
    declarations: [AppComponent],
    providers: [
        AllowOnlyLoggedInGuard,
        AllowOnlyNotLoggedInGuard,
        AllowOnlyShouldNotChangePasswordGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: Oauth2TokenInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
