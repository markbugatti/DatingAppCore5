import { Directive, Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
@Directive({
  selector: '[appPasswordMatchValidator]'
})
export class PasswordMatchValidatorDirective {
  constructor() { }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value 
        ? null : {isMatching: true};
    }
  }
}
