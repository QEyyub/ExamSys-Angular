import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['number', 'firstName', 'lastName', 'class', 'actions'];
  dataSource = new MatTableDataSource<Student>();

  loading = false;
  error = '';
  success = '';

  selectedStudent: Student = this.getEmptyStudent();
  isEditMode = false;
  isModalOpen = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      const dataStr = (
        data.number + ' ' +
        data.firstName + ' ' +
        data.lastName + ' ' +
        data.class
      ).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
  }

  loadStudents(): void {
    this.loading = true;
    this.clearMessages();
    this.studentService.getAll().pipe(
      catchError(err => {
        this.error = 'Şagirdləri gətirmək mümkün olmadı.';
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

  getEmptyStudent(): Student {
    return {
      number: 0,
      firstName: '',
      lastName: '',
      class: 1
    };
  }

  openCreateModal(): void {
    this.clearMessages();
    this.selectedStudent = this.getEmptyStudent();
    this.isEditMode = false;
    this.isModalOpen = true;
  }

  openEditModal(student: Student): void {
    this.clearMessages();
    this.selectedStudent = { ...student };
    this.isEditMode = true;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedStudent = this.getEmptyStudent();
    this.isEditMode = false;
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.updateStudent();
    } else {
      this.createStudent();
    }
  }

  createStudent(): void {
  if (this.selectedStudent.number && 
      this.dataSource.data.some(s => s.number === this.selectedStudent.number)) {
    this.error = 'Bu nömrə ilə şagird artıq mövcuddur.';
    return;
  }

  const payload = { ...this.selectedStudent };
  delete payload.number;

  this.studentService.create(payload as Student).subscribe({
    next: (res) => {
      alert(res || 'Şagird əlavə edildi');
      this.loadStudents();
      this.closeModal();
    },
    error: (err) => {
      this.error = 'Şagird əlavə etmək mümkün olmadı.';
      console.error(err);
    }
  });
}


  updateStudent(): void {
    this.studentService.update(this.selectedStudent).subscribe({
      next: (res) => {
        alert(res || 'Şagird yeniləndi');
        this.loadStudents();
        this.closeModal();
      },
      error: (err) => {
        this.error = 'Şagird yeniləmək mümkün olmadı.';
        console.error(err);
      }
    });
  }

  deleteStudent(number: number): void {
    if (confirm('Şagirdi silmək istədiyinizə əminsiniz?')) {
      this.studentService.delete(number).subscribe({
        next: (res) => {
          alert(res || 'Şagird silindi');
          this.loadStudents();
        },
        error: (err) => {
          this.error = 'Şagirdi silmək mümkün olmadı.';
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
