import {NgModule} from '@angular/core';
import {TextDialog} from "./text-dialog";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        TextDialog
    ],
    declarations: [TextDialog]
})
export class DialogModule {
}
