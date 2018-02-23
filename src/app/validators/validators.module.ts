import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrenyPairSymbolValidatorDirective } from './curreny-pair-symbol-validator.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ CurrenyPairSymbolValidatorDirective ],
  exports: [ CurrenyPairSymbolValidatorDirective ]
})
export class ValidatorsModule { }
