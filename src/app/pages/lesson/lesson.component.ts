import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LessonService } from '../../services/lesson.service';
import { Lesson } from '../../models/lesson.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['code', 'name', 'class', 'teacherFirstName', 'teacherLastName', 'actions'];
  dataSource = new MatTableDataSource<Lesson>();

  loading = false;
  error = '';
  success = '';

  selectedLesson: Lesson = this.getEmptyLesson();
  isEditMode = false;
  isModalOpen = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private lessonService: LessonService) { }

  ngOnInit(): void {
    this.loadLessons();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: Lesson, filter: string) => {
      const dataStr = (
        data.code + ' ' +
        data.name + ' ' +
        data.class + ' ' +
        data.teacherFirstName + ' ' +
        data.teacherLastName
      ).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
  }

  loadLessons(): void {
    this.loading = true;
    this.clearMessages();
    this.lessonService.getAll().pipe(
      catchError(err => {
        this.error = 'Dərsləri gətirmək mümkün olmadı.';
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

  getEmptyLesson(): Lesson {
    return {
      code: '',
      name: '',
      class: 1,
      teacherFirstName: '',
      teacherLastName: ''
    };
  }

  openCreateModal(): void {
    this.clearMessages();
    this.selectedLesson = this.getEmptyLesson();
    this.isEditMode = false;
    this.isModalOpen = true;
  }

  openEditModal(lesson: Lesson): void {
    this.clearMessages();
    this.selectedLesson = { ...lesson };
    this.isEditMode = true;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedLesson = this.getEmptyLesson();
    this.isEditMode = false;
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.updateLesson();
    } else {
      this.createLesson();
    }
  }

  createLesson(): void {
  const exists = this.dataSource.data.some(l => l.code === this.selectedLesson.code);
  if (exists) {
    this.error = 'Bu kod ilə dərs artıq mövcuddur.';
    return;
  }

  this.lessonService.create(this.selectedLesson).subscribe({
    next: (res) => {
      alert(res || 'Dərs əlavə edildi');
      this.error = '';
      this.loadLessons();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      this.closeModal();
    },
    error: (err) => {
      this.error = 'Dərs əlavə etmək mümkün olmadı.';
      console.error(err);
    }
  });
}

updateLesson(): void {
  this.lessonService.update(this.selectedLesson).subscribe({
    next: (res) => {
      alert(res || 'Dərs yeniləndi');
      this.error = '';
      this.loadLessons();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      this.closeModal();
    },
    error: (err) => {
      this.error = 'Dərs yeniləmək mümkün olmadı.';
      console.error(err);
    }
  });
}

deleteLesson(code: string): void {
  if (confirm('Dərsi silmək istədiyinizə əminsiniz?')) {
    this.lessonService.delete(code).subscribe({
      next: (res) => {
        alert(res || 'Dərs silindi');
        this.error = '';
        this.loadLessons();
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      },
      error: (err) => {
        this.error = 'Dərsi silmək mümkün olmadı.';
        console.error(err);
      }
    });
  }
}


  private clearMessages(): void {
    this.error = '';
    this.success = '';
  }

  private extractErrorMessage(err: any, defaultMsg: string): string {
    if (err?.error?.message) return err.error.message;
    if (typeof err?.error === 'string') return err.error;
    if (err?.message) return err.message;
    return defaultMsg;
  }
}
