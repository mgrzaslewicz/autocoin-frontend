import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ExchangeHealthTileComponent} from './exchange-health-tile.component';

@NgModule({
    imports: [CommonModule],
    declarations: [ExchangeHealthTileComponent],
    exports: [ExchangeHealthTileComponent]
})
export class ExchangeHealthTileModule {}
