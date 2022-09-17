import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { PasswordMatchValidatorDirective } from '../_validators/password-match-validator.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registerForm: FormGroup;
  minDate: NgbDate;
  maxDate: NgbDate;

  private readonly minAge = 18;
  private readonly passwordFieldName = 'password';

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private calendar: NgbCalendar,
    private passwordMatchValidator: PasswordMatchValidatorDirective
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
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator.matchValues(this.passwordFieldName)]]
    })
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
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
