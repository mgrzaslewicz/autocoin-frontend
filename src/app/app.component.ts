import { Component, OnInit } from '@angular/core';
import { versions } from '../environments/versions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor() {
        console.log(`%c${versions.hash}`, "color: white; font-weight: bold; background: #273c75; padding: 1px 4px; border-radius: 4px");
    }

    ngOnInit() {
    }
}
