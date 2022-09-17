import { Directive, Injectable } from '@angular/core';
import { AbstractControl, ControlContainer, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NgbCalendar, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
@Directive({
  selector: '[app-date-validator]'
})
export class AgeValidatorDirective {
  minDate: NgbDate;

  private readonly minAge = 18;

  constructor(private calendar: NgbCalendar) { }
  
  public AgeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      var forbidden = this.isAgeForbidden(control.value as NgbDate);
      return forbidden ? { forbiddenAge: true } : null; 
    };
  }

  private isAgeForbidden(date: NgbDate): boolean {
    this.minDate = this.calendar.getPrev(this.calendar.getToday(), 'y', this.minAge);
    
    if(date.year > this.minDate.year)
      return true;
    if(date.month > this.minDate.month)
      return true;
    if(date.day > this.minDate.day)
      return true;  

    return false;
  }
}


