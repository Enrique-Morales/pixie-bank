import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  currentBalance;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.currentBalance = this.auth.getBalance();
  }

}
