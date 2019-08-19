import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  form: FormGroup;
  loginError=false;
  loading=false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router) {
      this.form = this.fb.group({
        pin: new FormControl,
    });
     }

  ngOnInit() {
  }

  login(){
    this.loading=true;
    let pin = {
      pin: this.form.value.pin
    }
    
    this.authService.login(pin).subscribe(
      data => {
        console.log(data);
        this.authService.setLoggedIn(true);
        this.authService.setBalance(data["currentBalance"]);
        this.router.navigate(['dashboard']);
        this.loading=false;
      },
      error => {
        this.loginError=true;
        this.authService.setLoggedIn(false);
        this.loading=false;
    });
  }

}
