import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HealthRoutingModule} from './health-routing.module';
import {PageHeaderModule} from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HealthComponent} from './health.component';
import {HealthPanelModule} from './health-panel/health-panel.module';

@NgModule({
    imports: [
        CommonModule,
        HealthRoutingModule,
        PageHeaderModule,
        NgbModule,
        HealthPanelModule
    ],
    declarations: [
        HealthComponent
    ]
})
export class HealthModule {
}
