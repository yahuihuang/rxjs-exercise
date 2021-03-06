import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay, debounce, throttle, throttleTime
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, interval} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {Store} from '../common/store.service';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: number;

    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;

    @ViewChild('searchInput', { static: true }) input: ElementRef;
    constructor(private route: ActivatedRoute, private store: Store) {
    }

    ngOnInit() {
        this.courseId = this.route.snapshot.params['id'];
        console.log('courseId: ' + this.courseId);
        // this.course$ = this.store.selectCourseById(this.courseId);
        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);
        // this.lessons$ = createHttpObservable(`/api/lessons?courseId=${courseId}&pageSize=100`)
        //                   .pipe(
        //                     map(res => res['payload'])
        //                   );
    }

    ngAfterViewInit() {
        // const searchLessons$ =  fromEvent<any>(this.input.nativeElement, 'keyup')
        //     .pipe(
        //         map(event => event.target.value),
        //         debounceTime(400),  // delay in 400ms
        //         distinctUntilChanged(),
        //         // concatMap(search => this.loadLessons(search))
        //         switchMap(search => this.loadLessons(search))
        //     );

        // const initialLessons$ = this.loadLessons();

        // this.lessons$ = concat(initialLessons$, searchLessons$);

        fromEvent<any>(this.input.nativeElement, 'keyup')
          .pipe(
            map(event => event.target.value),
            // throttle(() => interval(500)),
            throttleTime(500),
            // startWith(''),
            // debounceTime(400),
            // distinctUntilChanged(),
            // switchMap(search => this.loadLessons(search))
          )
          .subscribe(console.log);
    }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(
            `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe(
                map(res => res['payload'])
            );
    }


}











