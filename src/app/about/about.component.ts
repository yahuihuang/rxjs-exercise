import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {

  ngOnInit() {
    const subject = new Subject();
    // subject.complete();
    const series$ = subject.asObservable();
    series$.subscribe(console.log);

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.complete();
  }
}
