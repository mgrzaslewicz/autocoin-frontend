import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SafeUrlPipe} from './safe-url-pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        SafeUrlPipe
    ],
    declarations: [SafeUrlPipe]
})
export class SharedPipesModule {
}
