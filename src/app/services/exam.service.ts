import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam } from '../models/exam.model'; 

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private apiUrl = 'https://localhost:7292/api/Exams';

  constructor(private http: HttpClient) { }

  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }

  addExam(exam: Exam): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, exam);
  }

  updateExam(exam: Exam): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${exam.lessonCode}/${exam.studentNumber}`, exam);
  }

  deleteExam(lessonCode: string, studentNumber: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${lessonCode}/${studentNumber}`);
  }
}
