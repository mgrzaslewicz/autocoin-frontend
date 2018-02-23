import { Directive } from '@angular/core';
import { Validator, ValidatorFn, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[validateCurrencyPairSymbol]',
  providers: [{provide: NG_VALIDATORS, useExisting: CurrenyPairSymbolValidatorDirective, multi: true}]
})
export class CurrenyPairSymbolValidatorDirective implements Validator {

  validate(control: AbstractControl): {[key: string]: any} {
    return currencyPairSymbolValidator()(control);
  }
}

function currencyPairSymbolValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    if (! control.value) {
      return null
    }

    let isValid = control.value.match(/^[A-Z]{2,5}\/[A-Z]{2,5}$/);

    if (isValid) {
      return null;
    }
    
    return { 'currencyPairSymbol': true };
  };
}