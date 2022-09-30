import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { NgbDate, NgbCalendar, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { PasswordMatchValidatorDirective } from '../_validators/password-match-validator.directive';
import { Router } from '@angular/router';

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
  validationErrors: string[] = [];


  private readonly minAge = 18;
  private readonly passwordFieldName = 'password';

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private calendar: NgbCalendar,
    private passwordMatchValidator: PasswordMatchValidatorDirective,
    private router: Router
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
    var dateAdapter = new NgbDateNativeAdapter();
    this.registerForm.value.dateOfBirth = dateAdapter.toModel(this.registerForm.value.dateOfBirth);

    this.accountService.register(this.registerForm.value).subscribe(res => {
      this.router.navigateByUrl('/members');
    }, errors => {
      this.validationErrors = errors;
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
