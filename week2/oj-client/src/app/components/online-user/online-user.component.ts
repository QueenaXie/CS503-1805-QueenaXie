import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/
collaboration.service';
import { OnlineUser } from '../../models/onlineUser.model';

declare var any;

@Component({
  selector: 'app-online-user',
  templateUrl: './online-user.component.html',
  styleUrls: ['./online-user.component.css']
})
export class OnlineUserComponent implements OnInit {
    online-user: any;
	sessionId: string;
	userNumber: UserNumber = 0;

  constructor(private collaboration: CollaborationService) { }

  ngOnInit() {
        this.collaboration.initSessionId(sessionId);
        if (null != this.online-user.getSession()){
        	userNumber++ ;
        }

  }

}
