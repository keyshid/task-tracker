import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task } from '../../models/task.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private taskSubject = new BehaviorSubject<Task[]>([]);
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  private cachedTags: string[] = [];
  private isApiFetched = false;

  constructor(private http: HttpClient) { }

  //  TASK OPERATIONS 
  public tasks$ = this.taskSubject.asObservable();

  getTasks(): Observable<Task[]> {
    return this.tasks$.pipe(
      map(tasks => tasks.filter(task => !task.archived))
    );
  }

  getArchivedTasks(): Observable<Task[]> {
    const archived = this.tasks.filter(task => task.archived);
    return of(archived);
  }

  getTaskById(id: number): Observable<Task | undefined> {
    const task = this.tasks.find(task => task.id === id);
    return of(task);
  }

  addTask(task: Task): void {
    task.id = this.generateId();
    this.tasks.push(task);
    this.updateTaskSubject();
  }

  updateTask(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.updateTaskSubject();
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.updateTaskSubject();
  }

  archiveTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.archived = true;
      // task.status = 'Done'; // i'm not sure if we move the task to archive that means the task is done ???
      this.updateTaskSubject();
    }
  }

  restoreTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.archived = false;
      this.updateTaskSubject();
    }
  }

  // TAGS FROM PUBLIC API 

  getTags(): Observable<string[]> {
    if (this.isApiFetched) {
      return of(this.cachedTags);
    }

    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        this.cachedTags = users.slice(0, 10).map(user => user.name);
        this.isApiFetched = true;
        return this.cachedTags;
      }),
      catchError(error => {
        console.error('Error fetching tags:', error);
        return of([]);
      })
    );
  }

  //  HELPERS 

  private updateTaskSubject(): void {
    this.taskSubject.next([...this.tasks]);
  }

  private generateId(): number {
    return this.tasks.length > 0
      ? Math.max(...this.tasks.map(t => t.id)) + 1
      : 1;
  }

  unarchiveTask(id: number): void {
    this.restoreTask(id);
  }
  setTasks(tasks: Task[]): void {
    this.tasks = tasks;
    this.taskSubject.next([...this.tasks]);
  }
}
