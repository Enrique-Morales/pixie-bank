import { Component, OnInit } from '@angular/core';
import { AtmService } from 'src/app/services/atm.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {

  form: FormGroup;
  error=false;
  finished=false;
  overdraft=false;
  atmResponse={status: "", message: ""};
  note_list;
  amountTyped;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private atm: AtmService) {
      this.form = this.fb.group({
        amount: new FormControl('', Validators.pattern("[0-9]")),
    });
   }

  ngOnInit() {
  }
  withdraw(overdraftAccepted){
    this.amountTyped = this.form.value.amount;
    this.atmResponse = this.atm.withdrawRequest(this.amountTyped);
    console.log(this.atmResponse);

    if(this.atmResponse['status']==="OK" || overdraftAccepted){
      this.note_list = this.atm.withdraw(Number(this.amountTyped));
      this.error=false;
      this.finished=true;
    } else if (this.atmResponse['status']==="Overdraft") {
      this.overdraft=true;
      this.error=true;
    } else {
      this.error=true;
    }

  }
}
