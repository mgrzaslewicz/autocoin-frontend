import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';

@Directive({
    selector: '[validateCurrencyPairSymbol]',
    providers: [{provide: NG_VALIDATORS, useExisting: CurrencyPairSymbolValidatorDirective, multi: true}]
})
export class CurrencyPairSymbolValidatorDirective implements Validator {

    validate(control: AbstractControl): { [key: string]: any } {
        return currencyPairSymbolValidator()(control);
    }
}

function currencyPairSymbolValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        if (!control.value) {
            return null;
        }
        const isValid = control.value.match(/^[A-Za-z]{2,8}\/[A-Za-z]{2,8}$/);

        if (isValid) {
            return null;
        }

        return {'currencyPairSymbol': true};
    };
}
