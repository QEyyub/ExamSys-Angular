import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private apiUrl = 'https://localhost:7292/api/Lessons';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.apiUrl);
  }

  getByCode(code: string): Observable<Lesson> {
    return this.http.get<Lesson>(`${this.apiUrl}/${code}`);
  }

  create(lesson: Lesson, options: any = { responseType: 'text' }): Observable<any> {
    return this.http.post(this.apiUrl, lesson, options);
  }

  update(lesson: Lesson, options: any = { responseType: 'text' }): Observable<any> {
    return this.http.put(this.apiUrl, lesson, options);
  }

  delete(code: string, options: any = { responseType: 'text' }): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${code}`, options);
  }
}
