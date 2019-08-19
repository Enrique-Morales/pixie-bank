import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service'

@Injectable({
  providedIn: 'root'
})
export class AtmService {


  notesAvailableInATM = [ // This is the currently available notes in the ATM
    {
      value: 5,
      amount: 4
    },
    {
      value: 20,
      amount: 7
    },
    {
      value: 10,
      amount: 15
    }
  ];

  currentUserBalance;

  constructor(private authService: AuthService) { 
    this.notesAvailableInATM.sort(function(a,b){return a.value - b.value}); // Since we are trying to give a mix of notes when possible, we sort the array by note value in an ascending order
    this.currentUserBalance = this.authService.getBalance();
  }
  
  withdrawRequest(amount_requested){// First we check whether the amount is divisible by 5
    if (amount_requested % 5 > 0){
      return {
        status: "Not divisible by 5",
        message: "Please, type an amount divisble by 5"
      }
    }
    if (amount_requested>this.calculateTotalInAtm(this.notesAvailableInATM)){ // Then we check whether the ATM has enough cash
      return {
        status: "Not enough cash in ATM",
        message: "Sorry, this machine doesn't have enough cash to perform this operation"
      }
    }
    if (amount_requested <= this.currentUserBalance){ // Then we check if the user has enough money in their account
      return {
        status: "OK",
        message: ""
      }
    }
    if (this.currentUserBalance - amount_requested < -100){ // If the user hasn't enough money, we check if the overdraft is bigger than 100£
      return {
        status: "Too much overdraft",
        message: "You cannot have an overdraft greater than 100£"
      }
    } else { // If all the above is false, it means that the overdraft is less than 100£
      return {
        status: "Overdraft",
        message: "You are about to slip into your overdraft. Do you want to proceed?"
      }
    }
  }

  withdraw(amount_requested) {
    this.currentUserBalance -= amount_requested;
    this.authService.setBalance(this.currentUserBalance);
    this.currentUserBalance
    let notes_dispatched=[]; // List of notes that will be dispatched
    let dispatchNoteFunction = this.dispatchNote;
    this.notesAvailableInATM.forEach(function(note) {
      if (note.amount >= 1 && amount_requested > 0) {
          amount_requested -= dispatchNoteFunction(notes_dispatched, 1, note); // Since we are trying to give a mix of notes when possible, we will first add one note of each type (lower values first)
      }
    });

    let counter = 1;

    while (amount_requested > 0){ // Through this loop we will fill the remaining amount with the higher value notes first
      if(counter < this.notesAvailableInATM.length){
      let bigger_note_availible = this.notesAvailableInATM[this.notesAvailableInATM.length - counter];
      let required_note_amount = Math.floor(amount_requested / bigger_note_availible.value);
      if (required_note_amount > bigger_note_availible.amount && bigger_note_availible.amount >= 1){ // If the required amount of a note is more than the available amount in the ATM, we will just expend the available amount
        amount_requested -= dispatchNoteFunction(notes_dispatched, bigger_note_availible.amount, bigger_note_availible);
      } else if (bigger_note_availible.amount >= 1) {
        amount_requested -= dispatchNoteFunction(notes_dispatched, required_note_amount, bigger_note_availible);
      }
      counter++;
      } else { // This is in case we have added one 5 note above. We need to add one more note, or subtract it in case there is no more 5 notes available in the ATM machine
        if (this.notesAvailableInATM[0].amount>=1){
          amount_requested -= dispatchNoteFunction(notes_dispatched, 1, (this.notesAvailableInATM[0]));
        } else {
          let note_5 = notes_dispatched.find(note => {return note.value === 5});
          note_5.amount -=1;
          if (note_5.amount == 0){
            notes_dispatched.shift();
          }
          amount_requested += 5;
          counter--;
        }
      }
    }
    
    return notes_dispatched;
      
  }
  
  dispatchNote(notes_dispatched, amount, noteInfo){ // This method adds a certain amount of an specific type of note to the notes dispatched list, and removes that amount from the ATM
      noteInfo.amount -= amount; // Remove the notes from the ATM
      if (notes_dispatched.some(note => note.value === noteInfo.value)) { // Here we try to find the same type of note on the notes dispatched list
        var already_dispathed_note = notes_dispatched.find(note => {return note.value === noteInfo.value});
        already_dispathed_note.amount += amount;
      } else {
      notes_dispatched.push({
        value: noteInfo.value,
        amount: amount
      });    
      }
      return noteInfo.value * amount;
    }
  
  calculateTotalInAtm(notesAvailable){ // This method calculates the amount of availible cash in the ATM
    let total= 0;
    notesAvailable.forEach(function(note){
      total += note.value * note.amount;
    })
    return total;
  };
}
