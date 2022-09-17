import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AgeValidatorDirective } from '../_validators/date-validator.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter(); 
  model: any = {};
  registerForm: FormGroup;
  maxDate: NgbDate;

  private readonly minAge = 18;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private calendar: NgbCalendar,
    private dateValidator: AgeValidatorDirective
    ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = this.calendar.getPrev(this.calendar.getToday(), 'y', this.minAge);
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required, this.dateValidator.AgeValidator()],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value 
        ? null : {isMatching: true};
    }
  }

  register() {
    console.log(this.registerForm.value);
    // this.accountService.register(this.model).subscribe(res => {
    //   console.log(res);
    //   this.cancel();
    // }, res => {
    //   console.log(res);
    //   this.toastr.error(res.error)
    // })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
