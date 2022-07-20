import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
    name: 'linkify'
})
export class LinkifyPipe implements PipeTransform {

    // http://, https://, ftp://
    private readonly urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;

    // www. sans http:// or https://
    private readonly pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim;

    // Email addresses
    private readonly emailAddressPattern = /[\w.]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim;

    constructor(private _domSanitizer: DomSanitizer) {
    }

    transform(value?: string, args?: any): any {
        if (value == null) {
            return null;
        } else {
            let replacedText = value
                ?.replace(this.urlPattern, '<a href="$&">$&</a>')
                ?.replace(this.pseudoUrlPattern, '$1<a href="http://$2">$2</a>')
                ?.replace(this.emailAddressPattern, '<a href="mailto:$&">$&</a>');
            return this._domSanitizer.bypassSecurityTrustHtml(replacedText);
        }
    }

}
