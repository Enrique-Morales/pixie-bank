import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, } from '@angular/common/http';
import { Observable } from 'rxjs';
interface PinInterface {
  pin: String
}

interface ResponseInterface {
  error: String,
  currentBalance: Number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  private loggedInStatus = JSON.parse(localStorage.getItem("loggedIn") || 'false');

  httpOptions;
  pin: PinInterface;
  
  constructor(private http: HttpClient) {
    this.httpOptions = new HttpHeaders({
      'Content-Type': 'application/json'
    }) 
  }

  login(pin: PinInterface): Observable<HttpEvent<ResponseInterface>> {
      return this.http.post<ResponseInterface>("https://frontend-challenge.screencloud-michael.now.sh/api/pin/", pin, this.httpOptions);
  }

  setLoggedIn(value: boolean){
    this.loggedInStatus=value;
    localStorage.setItem("loggedIn",  value ? "true" : "false");
  }

  isLoggedIn(){
    return JSON.parse(localStorage.getItem("loggedIn") || this.loggedInStatus)
  }          

  logout() {
      this.loggedInStatus=false;
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("currentBalance");
  }

  setBalance(value: Number) {
    localStorage.setItem("currentBalance",  value ? value.toString() : "0");
  }
  
  getBalance() {
    return Number(localStorage.getItem("currentBalance"));
  }

  
}
