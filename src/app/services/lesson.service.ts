import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lesson } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private apiUrl = 'https://localhost:7292/api/Lessons'; // Backend URL-nu özünə uyğun dəyiş

  constructor(private http: HttpClient) { }

  // Bütün dərsləri gətir
  getLessons(): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(this.apiUrl);
  }

  // Yeni dərs əlavə et
  addLesson(lesson: Lesson): Observable<Lesson> {
    return this.http.post<Lesson>(this.apiUrl, lesson);
  }

  // Mövcud dərsi yenilə
  updateLesson(lesson: Lesson): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${lesson.code}`, lesson);
  }

  // Dərsi sil
  deleteLesson(code: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${code}`);
  }
}
