import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    const subject = new BehaviorSubject<number>(0);
    // const subject = new Subject();
    // subject.complete();
    const series$ = subject.asObservable();
    series$.subscribe(val => console.log('early sub: ' + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.complete();

    setTimeout(() => {
      series$.subscribe(val => console.log('late sub: ' + val));
      subject.next(4);
    }, 3000);
  }
}
