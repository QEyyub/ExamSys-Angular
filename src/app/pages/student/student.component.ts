import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['number', 'name', 'surname', 'class', 'actions'];
  dataSource = new MatTableDataSource<Student>();

  loading = false;
  error = '';

  selectedStudent: Student = this.getEmptyStudent();
  isEditMode = false;
  showForm = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      const dataStr = (data.number + ' ' + data.name + ' ' + data.surname + ' ' + data.class).toLowerCase();
      return dataStr.indexOf(filter) !== -1;
    };
  }

  loadStudents(): void {
    this.loading = true;
    this.error = '';
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Şagird məlumatlarını gətirmək mümkün olmadı.';
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

  getEmptyStudent(): Student {
    return {
      number: 0,
      name: '',
      surname: '',
      class: 1
    };
  }

  onAddNew(): void {
    this.selectedStudent = this.getEmptyStudent();
    this.isEditMode = false;
    this.showForm = true;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  onEdit(student: Student): void {
    this.selectedStudent = { ...student };
    this.isEditMode = true;
    this.showForm = true;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  onCancel(): void {
    this.selectedStudent = this.getEmptyStudent();
    this.isEditMode = false;
    this.showForm = false;
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.updateStudent();
    } else {
      this.addStudent();
    }
  }

  addStudent(): void {
    this.studentService.addStudent(this.selectedStudent).subscribe({
      next: (newStudent) => {
        this.dataSource.data = [...this.dataSource.data, newStudent];
        this.onCancel();
      },
      error: (err) => {
        this.error = 'Şagird əlavə etmək mümkün olmadı.';
        console.error(err);
      }
    });
  }

  updateStudent(): void {
    this.studentService.updateStudent(this.selectedStudent).subscribe({
      next: () => {
        const data = this.dataSource.data;
        const index = data.findIndex(s => s.number === this.selectedStudent.number);
        if (index !== -1) {
          data[index] = { ...this.selectedStudent };
          this.dataSource.data = [...data];
        }
        this.onCancel();
      },
      error: (err) => {
        this.error = 'Şagird yeniləmək mümkün olmadı.';
        console.error(err);
      }
    });
  }

  onDelete(number: number): void {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      this.studentService.deleteStudent(number).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(s => s.number !== number);
        },
        error: (err) => {
          this.error = 'Şagird silmək mümkün olmadı.';
          console.error(err);
        }
      });
    }
  }
}
