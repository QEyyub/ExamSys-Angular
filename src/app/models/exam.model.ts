export interface Exam {
  id?: number;
  lessonCode: string;
  studentNumber: number;
  examDate: string;
  grade: number;
  lessonName?: string;
  studentName?: string;
  studentSurname?: string;

  oldLessonCode?: string;
  oldStudentNumber?: number;
}