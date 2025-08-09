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

  // ✅ Eklendi: geçerli lesson ve student listeleri
  validLessonCodes: string[] = [];
  validStudentNumbers: number[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private examService: ExamService) { }

  ngOnInit(): void {
    this.loadExams();
    this.loadValidData(); // ✅ Eklendi
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

  openEditModal(exam: Exam): void {
    this.clearMessages();
    this.selectedExam = { ...exam };
    this.isEditMode = true;
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

    if (!this.validLessonCodes.includes(this.selectedExam.lessonCode)) {
      this.error = 'Böyle bir ders kodu bulunamadı.';
      return;
    }
    if (!this.validStudentNumbers.includes(this.selectedExam.studentNumber)) {
      this.error = 'Böyle bir öğrenci numarası bulunamadı.';
      return;
    }

    const payload = {
      lessonCode: this.selectedExam.lessonCode,
      studentNumber: this.selectedExam.studentNumber,
      examDate: this.selectedExam.examDate,
      grade: this.selectedExam.grade
    };

    this.examService.create(payload as Exam).subscribe({
      next: (res) => {
        alert(res || 'İmtahan əlavə edildi');
        this.loadExams();
        this.closeModal();
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = 'İmtahan əlavə etmək mümkün olmadı.';
        }
        console.error(err);
      }
    });
  }

  updateExam(): void {
    this.examService.update(this.selectedExam).subscribe({
      next: (res) => {
        alert(res || 'İmtahan yeniləndi');
        this.loadExams();
        this.closeModal();
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = 'İmtahan yeniləmək mümkün olmadı.';
        }
        console.error(err);
      }
    });
  }

  deleteExam(id: number): void {
    if (confirm('İmtahanı silmək istədiyinizə əminsiniz?')) {
      this.examService.delete(id).subscribe({
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
