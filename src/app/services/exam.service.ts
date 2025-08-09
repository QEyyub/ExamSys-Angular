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

  create(exam: Exam): Observable<any> {
    return this.http.post(this.apiUrl, exam);
  }

  update(id: number, exam: Exam): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, exam);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
