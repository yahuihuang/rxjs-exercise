import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Course } from '../model/course';
import { createHttpObservable } from './util';
import { map, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private subject = new BehaviorSubject([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable('/api/courses');

    http$
        .pipe(
            tap(() => console.log('HTTP request executed')),
            map(res => Object.values(res['payload']) ),
        )
        .subscribe(
          courses => this.subject.next(courses)
        );
  }

  selectBeginnerCourses() {
    return this.filterByCategory('BEGINNER');
  }

  selectAdvancedCourses() {
    return this.filterByCategory('ADVANCED');
  }

  selectCourseById(courseId: number) {
    return this.courses$
      .pipe(
        map(courses => courses.find(course => course.id === courseId))
      );
  }

  filterByCategory(category: string) {
    return this.courses$
      .pipe(
          map(courses => courses
              .filter(course => course.category === category))
      );
  }

  saveCourse(courseId: number, changes): Observable<any> {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex(course => course.id === courseId);

    // slice 原陣列不會被修改
    const newCourses = courses.slice(0);
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes
    };
    console.log(newCourses);
    this.subject.next(newCourses);

    return fromPromise(fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'Content-type': 'application/json'
      }
    }));
  }
}
