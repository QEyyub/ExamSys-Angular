import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exam } from '../models/exam.model'; // model yolunu öz layihənə uyğun düzəlt

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private apiUrl = 'https://localhost:7292/api/Exams'; // Backend API url - özünə uyğun dəyiş

  constructor(private http: HttpClient) { }

  // Bütün imtahanları gətir
  getExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(this.apiUrl);
  }

  // Yeni imtahan əlavə et
  addExam(exam: Exam): Observable<Exam> {
    return this.http.post<Exam>(this.apiUrl, exam);
  }

  // İmtahan yenilə
  updateExam(exam: Exam): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${exam.lessonCode}/${exam.studentNumber}`, exam);
  }

  // İmtahanı sil
  deleteExam(lessonCode: string, studentNumber: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${lessonCode}/${studentNumber}`);
  }
}
