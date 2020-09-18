import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
    concat,
    fromEvent,
    interval,
    noop,
    observable,
    Observable,
    of,
    timer,
    merge,
    Subject,
    BehaviorSubject,
    AsyncSubject,
    ReplaySubject
} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    // tslint:disable-next-line: component-selector
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
      // 1.interval
      // const interval$ = interval(1000);
      // const sub = interval$.subscribe(val => {
      //   console.log('interval one - ' + val);
      // });

      // interval$.subscribe(val => {
      //   console.log('interval two - ' + val);
      // });

      // 取消訂閱
      // setTimeout(() => sub.unsubscribe(), 5000);

      // 2.timer
      // const timer$ = timer(5000, 2000);
      // timer$.subscribe(val => {
      //   console.log('timer - ' + val);
      // });

      // 3.fromEvent
      // const event$ = fromEvent(document, 'click');
      // event$.subscribe(
      //   evt => {
      //     console.log('document.click => ', evt);
      //   },
      //   err => {
      //     console.log('error => ' + err);
      //   },
      //   () => {
      //     console.log('Complete !');
      //   }
      // );

      // 4.fetch api

      const http$ = createHttpObservable('/api/courses');
      const courses$ = http$.pipe(
        map(res => Object.values(res['payload']))
      );

      courses$.subscribe(
        courses => {
          console.log('courses: ');
          console.log(courses);
        },
        noop,
        () => {
          console.log('http$ subscribe complete.');
        }
      );

    }
}
