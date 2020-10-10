import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {noop, Observable, of, throwError, timer } from 'rxjs';
import { map, share, tap, shareReplay, catchError, finalize, delayWhen, retryWhen, delay } from 'rxjs/operators';
import {createHttpObservable} from '../common/util';
import {Store} from '../common/store.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    // become a stream of data
    beginnerCourses$: Observable<Course[]>;
    advancedCourses$: Observable<Course[]>;

    constructor(private store: Store) {

    }

    ngOnInit() {

      // 5.fetch api
      const http$ = createHttpObservable('/api/courses');
      const courses$: Observable<Course[]> = http$
        .pipe(
          catchError(err => {
            console.log('Error occurred: ', err);
            return throwError(err);
          }),
          finalize(() => {
            console.log('Finalize executed.');
          }),
          tap(() => console.log('Http Request execution')),
          map(res => Object.values(res['payload'])),
          shareReplay(),
          retryWhen(errors => errors.pipe(
            delayWhen(() => timer(2000))
          ))
        );

      this.beginnerCourses$
          = courses$.pipe(
              map(courses => courses.filter(course => course.category === 'BEGINNER'))
            );
      this.advancedCourses$
          = courses$.pipe(
              map(courses => courses.filter(course => course.category === 'ADVANCED'))
            );
    }
}
