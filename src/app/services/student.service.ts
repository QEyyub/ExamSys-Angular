import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = 'https://localhost:7292/api/Students'; // API endpoint

  constructor(private http: HttpClient) {}

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getByNumber(number: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${number}`);
  }

  create(student: Student, options: any = { responseType: 'text' }): Observable<any> {
    return this.http.post(this.apiUrl, student, options);
  }

  update(student: Student, options: any = { responseType: 'text' }): Observable<any> {
    return this.http.put(this.apiUrl, student, options);
  }

  delete(number: number, options: any = { responseType: 'text' }): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${number}`, options);
  }
}
