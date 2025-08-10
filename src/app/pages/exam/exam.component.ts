import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../models/exam.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['lessonCode', 'studentNumber', 'examDate', 'grade', 'actions'];
  dataSource = new MatTableDataSource<Exam>();

  loading = false;
  error = '';
  success = '';

  selectedExam: Exam = this.getEmptyExam();
  isEditMode = false;
  isModalOpen = false;

  validLessonCodes: string[] = [];
  validStudentNumbers: number[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private examService: ExamService) { }

  ngOnInit(): void {
    this.loadExams();
    this.loadValidData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: Exam, filter: string) => {
      const dataStr = (
        data.lessonCode + ' ' +
        data.studentNumber + ' ' +
        data.examDate + ' ' +
        data.grade
      ).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
  }

  loadValidData(): void {
    this.examService.getLessonCodes().subscribe({
      next: (codes) => this.validLessonCodes = codes,
      error: (err) => console.error('Ders kodları yüklenemedi', err)
    });

    this.examService.getStudentNumbers().subscribe({
      next: (nums) => this.validStudentNumbers = nums,
      error: (err) => console.error('Öğrenci numaraları yüklenemedi', err)
    });
  }

  loadExams(): void {
    this.loading = true;
    this.clearMessages();
    this.examService.getAll().pipe(
      catchError(err => {
        this.error = 'İmtahanları gətirmək mümkün olmadı.';
        console.error(err);
        this.loading = false;
        return of([]);
      })
    ).subscribe(data => {
      this.dataSource.data = data;
      this.loading = false;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEmptyExam(): Exam {
    return {
      id: 0,
      lessonCode: '',
      studentNumber: 0,
      examDate: '',
      grade: 0
    };
  }

  openCreateModal(): void {
    this.clearMessages();
    this.selectedExam = this.getEmptyExam();
    this.isEditMode = false;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedExam = this.getEmptyExam();
    this.isEditMode = false;
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.updateExam();
    } else {
      this.createExam();
    }
  }

createExam(): void {
  this.clearMessages();

const payload = {
  lessonCode: this.selectedExam.lessonCode,
  studentNumber: this.selectedExam.studentNumber,
  examDate: this.selectedExam.examDate.split('T')[0], 
  grade: this.selectedExam.grade
};


this.examService.create(payload as Exam).subscribe({
  next: (res) => {
    console.log('Full Response:', res);
    alert(res.body || 'İmtahan əlavə edildi');
    this.loadExams();
    this.closeModal();
  },
  error: (err) => {
    console.error('Error Response:', err);
    this.error = err.error?.message || 'İmtahan əlavə etmək mümkün olmadı.';
  }
});

}

openEditModal(exam: Exam): void {
  this.clearMessages();
  this.selectedExam = {
    id: exam.id,
    lessonCode: exam.lessonCode,
    studentNumber: exam.studentNumber,
    examDate: exam.examDate ? exam.examDate.split('T')[0] : '',
    grade: exam.grade,
    oldLessonCode: exam.lessonCode,     // ✅ artıq modeldə var
    oldStudentNumber: exam.studentNumber
  };
  this.isEditMode = true;
  this.isModalOpen = true;
}

updateExam(): void {
  if (!this.selectedExam.oldLessonCode || this.selectedExam.oldStudentNumber === undefined) {
    this.error = 'Köhnə dəyərlər tapılmadı, yeniləmə mümkün deyil.';
    return;
  }

  const payload: Exam = {
    ...this.selectedExam,
    examDate: this.selectedExam.examDate.split('T')[0] 
  };

  this.examService.update(
    this.selectedExam.oldLessonCode,
    this.selectedExam.oldStudentNumber,
    payload
  ).subscribe({
    next: (message) => {
      alert(message);
      this.loadExams();
      this.closeModal();
    },
    error: (err) => {
      console.error(err);
      this.error = err.error || 'İmtahan yeniləmək mümkün olmadı.';
    }
  });
}

deleteExam(lessonCode: string, studentNumber: number): void {
  if (confirm('İmtahanı silmək istədiyinizə əminsiniz?')) {
    this.examService.delete(lessonCode, studentNumber).subscribe({
      next: (res) => {
        alert(res || 'İmtahan silindi');
        this.loadExams();
      },
      error: (err) => {
        this.error = 'İmtahanı silmək mümkün olmadı.';
        console.error(err);
      }
    });
  }
}
  private clearMessages(): void {
    this.error = '';
    this.success = '';
  }
}
