import { Component, OnInit, Input } from '@angular/core';
import { UserDetails } from 'src/app/user-details';
import { User } from 'src/app/user';

@Component({
  selector: 'app-edit-user-details',
  templateUrl: './edit-user-details.component.html',
  styleUrls: ['./edit-user-details.component.css']
})
export class EditUserDetailsComponent implements OnInit {

  @Input() user: User;
  

  constructor() { }

  ngOnInit() {

    if(this.user.userDetails === null) {
      this.user.userDetails = new UserDetails(null, null, null);
    }
  }

  findHomeAge() {
    if(this.user.userDetails.homeAge === null) {
      return "Enter your home's age";
    } else {
      return this.user.userDetails.homeAge;
    }
  }

}
