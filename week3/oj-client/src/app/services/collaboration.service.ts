import { Injectable } from '@angular/core';

declare var io: any;

@Injectable({
  providedIn: 'root'
})
export class CollaborationService {
	collaborationSocket: any;

  constructor() { }

  init(editor: any, sessionId: string): void {
  	// establish socket connection
  	this.collaborationSocket = io(window.location.origin, { query: 'sessionId=' + sessionId});

  	// when receive change from the server, apply to local browser session
  	this.collaborationSocket.on('change', (delta: string) => {
  		console.log('collaboration: editor changes ' + delta);
  		delta = JSON.parse(delta);
  		editor.lastAppliedChange = delta;
  		editor.getSession().getDocument().applyDeltas([delta]);
  	});
  }

  // send to server (which will forward to other participants)
  change(delta: string): void {
  	console.log('send message' + delta);
  	this.collaborationSocket.emit('change', delta);
  }

  // restore buffer from redis cache
  restoreBuffer(): void {
    this.collaborationSocket.emit("restoreBuffer");
  }
}
