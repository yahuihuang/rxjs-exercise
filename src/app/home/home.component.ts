import {Component, OnInit} from '@angular/core';
import {Course} from '../model/course';
import {noop } from 'rxjs';
import { map } from 'rxjs/operators';
import {createHttpObservable} from '../common/util';
import {Store} from '../common/store.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses: Course[];
    advancedCourses: Course[];

    constructor(private store: Store) {

    }

    ngOnInit() {

      // 5.fetch api
      const http$ = createHttpObservable('/api/courses');
      const courses$ = http$.pipe(
        map(res => Object.values(res['payload']))
      );

      courses$.subscribe(
        courses => {
          console.log('courses: ');
          console.log(courses);

          this.beginnerCourses
                = courses.filter(course => course.category === 'BEGINNER');
          this.advancedCourses
                = courses.filter(course => course.category === 'ADVANCED');
          console.log(this.beginnerCourses);
          console.log(this.advancedCourses);
        },
        noop,
        () => {
          console.log('http$ subscribe complete.');
        }
      );

    }

}
