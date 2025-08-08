import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ExamService } from '../../services/exam.service';
import { Exam } from '../../models/exam.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'lessonCode', 'lessonName', 'class', 'studentNumber',
    'studentName', 'studentSurname', 'examDate', 'actions'
  ];
  dataSource = new MatTableDataSource<Exam>();

  loading = false;
  error = '';

  selectedExam: Exam = this.getEmptyExam();
  isEditMode = false;

  isModalOpen = false; // <-- Modal üçün açar bağlayıcı

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private examService: ExamService) { }

  ngOnInit(): void {
    this.loadExams();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: Exam, filter: string) => {
      const dataStr = (
        data.lessonCode + ' ' +
        data.lessonName + ' ' +
        data.class + ' ' +
        data.studentNumber + ' ' +
        data.studentName + ' ' +
        data.studentSurname
      ).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
  }

  loadExams(): void {
    this.loading = true;
    this.error = '';
    this.examService.getExams().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'İmtahan məlumatlarını gətirmək mümkün olmadı.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  getEmptyExam(): Exam {
    return {
      lessonCode: '',
      lessonName: '',
      class: 1,
      studentNumber: 1,
      studentName: '',
      studentSurname: '',
      examDate: ''
    };
  }

  // Modal açma funksiyası (Yeni əlavə)
  openCreateModal(): void {
    this.selectedExam = this.getEmptyExam();
    this.isEditMode = false;
    this.isModalOpen = true;
  }

  // Modal bağlama funksiyası (Yeni əlavə)
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedExam = this.getEmptyExam();
    this.isEditMode = false;
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.updateExam();
    } else {
      this.addExam();
    }
  }

  addExam(): void {
    this.examService.addExam(this.selectedExam).subscribe({
      next: (newExam) => {
        this.dataSource.data = [...this.dataSource.data, newExam];
        this.closeModal(); // Modal bağlanır əlavə edildikdən sonra
      },
      error: (err) => {
        this.error = 'İmtahan əlavə etmək mümkün olmadı.';
        console.error(err);
      }
    });
  }

  updateExam(): void {
    this.examService.updateExam(this.selectedExam).subscribe({
      next: () => {
        const data = this.dataSource.data;
        const index = data.findIndex(e =>
          e.lessonCode === this.selectedExam.lessonCode &&
          e.studentNumber === this.selectedExam.studentNumber
        );
        if (index !== -1) {
          data[index] = { ...this.selectedExam };
          this.dataSource.data = [...data];
        }
        this.closeModal(); // Modal bağlanır yeniləmədən sonra
      },
      error: (err) => {
        this.error = 'İmtahan yeniləmək mümkün olmadı.';
        console.error(err);
      }
    });
  }

  onEdit(exam: Exam): void {
    this.selectedExam = { ...exam };
    this.isEditMode = true;
    this.isModalOpen = true; // Modal açılır redaktə üçün
  }

  onCancel(): void {
    this.closeModal();
  }

  onDelete(lessonCode: string, studentNumber: number): void {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      this.examService.deleteExam(lessonCode, studentNumber).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(e =>
            !(e.lessonCode === lessonCode && e.studentNumber === studentNumber)
          );
        },
        error: (err) => {
          this.error = 'İmtahan silmək mümkün olmadı.';
          console.error(err);
        }
      });
    }
  }
}
