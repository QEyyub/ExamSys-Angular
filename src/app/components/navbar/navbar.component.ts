import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

constructor(private router: Router) {}

  onMenuClick(menuName: string) {
    switch(menuName) {
      case 'Lesson':
        this.router.navigate(['/lessons']);
        break;
      case 'Student':
        this.router.navigate(['/students']);
        break;
      case 'Exam':
        this.router.navigate(['/exams']);
        break;
    }
  }
}
