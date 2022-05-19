import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-text-dialog',
    templateUrl: './text-dialog.html',
    styleUrls: ['./text-dialog.scss']
})
export class TextDialog implements OnInit {
    private header?: string;
    private text: string;

    @ViewChild('content', {static: true})
    content;

    @Output('refresh')
    refreshEmmitter: EventEmitter<any> = new EventEmitter();

    constructor(private modalService: NgbModal) {
    }

    ngOnInit() {
    }

    showWithHeader(header: string, text: string) {
        this.header = header;
        this.text = text;
        this.modalService.open(this.content);
    }

    showWithoutHeader(text: string) {
        this.header = null;
        this.text = text;
        this.modalService.open(this.content);
    }
}
