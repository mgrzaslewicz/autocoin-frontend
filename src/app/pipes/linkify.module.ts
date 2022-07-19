import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LinkifyPipe} from "./llinkify-pipe";

@NgModule({
    imports: [
        CommonModule,
    ],
    exports: [
        LinkifyPipe
    ],
    declarations: [LinkifyPipe]
})
export class LinkifyModule {
}
