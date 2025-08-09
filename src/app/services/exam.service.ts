import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam } from '../models/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private apiUrl = 'https://localhost:7292/api/Exams';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }

  getById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/${id}`);
  }

  create(exam: Exam, options: any = { responseType: 'text' }): Observable<any> {
    return this.http.post(this.apiUrl, exam, options);
  }

  update(exam: Exam, options: any = { responseType: 'text' }): Observable<any> {
    return this.http.put(this.apiUrl, exam, options);
  }

  delete(id: number, options: any = { responseType: 'text' }): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, options);
  }

  getLessonCodes(): Observable<string[]> {
    return this.http.get<string[]>('https://localhost:7292/api/Lessons/codes');
  }

  getStudentNumbers(): Observable<number[]> {
    return this.http.get<number[]>('https://localhost:7292/api/Students/name');
  }
}
