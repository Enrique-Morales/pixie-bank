import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exit',
  templateUrl: './exit.component.html',
  styleUrls: ['./exit.component.scss']
})
export class ExitComponent implements OnInit {

  constructor( 
    private authService: AuthService, 
    private router: Router) {}

  ngOnInit() {
    this.authService.logout();
    let r= this.router;
    setTimeout(function(){
      r.navigate(['']);
    }, 5000); 
  }

}
