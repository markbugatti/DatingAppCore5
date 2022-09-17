import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() maxDate: Date;

  model: NgbDate;
  startDate: NgbDate;

  private readonly minAge = 18;

  constructor(@Self() public ngControl: NgControl, private  calendar: NgbCalendar) {
    this.ngControl.valueAccessor = this;
    this.setStartDate();
  }
  
  private setStartDate() {
    this.startDate = this.calendar.getToday();
    this.startDate = this.calendar.getPrev(this.calendar.getToday(), 'y', this.minAge)
  }

  writeValue(obj: any): void { }
  
  registerOnChange(fn: any): void { }
  
  registerOnTouched(fn: any): void { }

  onChangeEvent(event: any){
    //console.log('input error: ' + this.ngControl.control.errors);
  }
}
