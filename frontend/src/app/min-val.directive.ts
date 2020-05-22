import { Directive, Input } from '@angular/core';
import { Validator, NG_VALIDATORS, AbstractControl, ValidatorFn } from '@angular/forms';


export function minValValidator(minNumber: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const meetsMinimum = minNumber <= control.value;
    return !meetsMinimum ? {'Value must be greater than ': {value: control.value}} : null;
  };
}

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {'forbiddenName': {value: control.value}} : null;
  };
}


@Directive({
  selector: '[appMinVal]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinValDirective, multi: true}]
})
export class MinValDirective implements Validator {
  @Input('appMinVal') minVal: number;

  validate(control: AbstractControl): {[key: string]: any} | null {
    return this.minVal ? minValValidator(this.minVal) (control) : null;
  }

}

