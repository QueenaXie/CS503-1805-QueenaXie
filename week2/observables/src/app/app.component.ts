import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  ngOnInit() {
  	let promise = new Promise( resolve => {
  		console.log('promise execution');
  		setTimeout( () => {
  			resolve('promise resolved');
  		}, 3000);
  	});

  	promise.then( (value: string) => console.log(value));

  	let stream$ = new Observable(observer => {
  		console.log('observable execution');
 
  		observer.next(1);
  		observer.next(2);
  		observer.next(3);
  	});

  	let sub = stream$.subscribe(value => console.log(value));

  	let sub2 = stream$.subscribe(value => console.log(value));

  	let subject = new Subject();

  	let suba = subject.subscribe( v => {console.log('suba: ' + v)});

  	let subb = subject.subscribe( v => {console.log('subb: ' + v)});

  	subject.next(1);
  	subject.next(2);

  	let subc = subject.subscribe(v => {console.log('subc: ' + v)});
  	subject.next(3);
  }
}
