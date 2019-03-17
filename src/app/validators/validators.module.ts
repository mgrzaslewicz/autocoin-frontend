import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CurrencyPairSymbolValidatorDirective} from './currency-pair-symbol-validator.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [CurrencyPairSymbolValidatorDirective],
    exports: [CurrencyPairSymbolValidatorDirective]
})
export class ValidatorsModule {
}
