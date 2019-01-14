import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HealthPanelComponent } from './health-panel.component';

@NgModule({
    imports: [CommonModule],
    declarations: [HealthPanelComponent],
    exports: [HealthPanelComponent]
})
export class HealthPanelModule {}
