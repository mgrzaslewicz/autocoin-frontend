import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'health-panel',
    templateUrl: './health-panel.component.html',
    styleUrls: ['./health-panel.component.scss']
})
export class HealthPanelComponent implements OnInit {
    @Input() healthy: boolean;
    @Input() icon: string;
    @Input() count: number;
    @Input() label: string;
    @Input() data: number;
    @Output() event: EventEmitter<any> = new EventEmitter();

    constructor() {}

    ngOnInit() {}
}
