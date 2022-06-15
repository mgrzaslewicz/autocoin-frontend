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
    private isCloseButtonVisible: boolean;
    private isYesButtonVisible: boolean;
    private isNoButtonVisible: boolean;

    @ViewChild('content')
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
        this.isCloseButtonVisible = true;
        this.isYesButtonVisible = false;
        this.isNoButtonVisible = false;
        this.modalService.open(this.content);
    }

    showWithoutHeader(text: string) {
        this.header = null;
        this.text = text;
        this.isCloseButtonVisible = true;
        this.isYesButtonVisible = false;
        this.isNoButtonVisible = false;
        this.modalService.open(this.content);
    }

    showYesNoConfirmation(header: string, text: string, yesCallback: () => void) {
      this.header = header;
      this.text = text;
        this.isCloseButtonVisible = false;
        this.isYesButtonVisible = true;
        this.isNoButtonVisible = true;
        this.modalService.open(this.content).result.then(result => {
            if (result === 'yes') {
                yesCallback();
            }
        }, reason => {
        });

    }
}
