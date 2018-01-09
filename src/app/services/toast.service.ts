import { Injectable } from '@angular/core';
import $ from 'jquery';
import 'bootstrap-notify';

@Injectable()
export class ToastService {

  constructor() { }

  success(message: string) {
    $.notify({ message }, { type: 'success', placement: { from: 'bottom' } });
  }

  info(message: string) {
    $.notify({ message }, { type: 'info', placement: { from: 'bottom' } });
  }
  
  warning(message: string) {
    $.notify({ message }, { type: 'warning', placement: { from: 'bottom' } });
  }

  danger(message: string) {
    $.notify({ message }, { type: 'danger', placement: { from: 'bottom' } });
  }

}
