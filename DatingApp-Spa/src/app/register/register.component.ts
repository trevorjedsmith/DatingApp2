import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/_services/auth.service';
import { AlertifyService } from 'src/_services/Alertify.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() valuesFromHome: any;
  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;

  constructor(private authService: AuthService, private alertifyService: AlertifyService, private router: Router) { }

  ngOnInit() {

    this.registerForm = new FormGroup({
      gender: new FormControl('male', [Validators.required]),
      knownAs: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl(null, [Validators.required]),
      city: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(8)])
    }, this.passwordMatchValidator);
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }

  register() {

    if (this.registerForm.valid) {

    this.user = Object.assign({}, this.registerForm.value);

    this.authService.register(this.registerForm.value).subscribe(returnObject => {
      this.alertifyService.success('User has been registered successfully');
      }, error => {
      this.alertifyService.error(`There has been an error registering this user: ${error.error}`);
      }, () => {
      this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
      });
      });
  console.log(this.registerForm.value);
  }
}

  cancel() {
    this.cancelRegister.emit(false);
  }

}
