import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../shared/services/task.service';
import { Task } from '../../models/task.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  // This will hold the list of tasks we want to display
  tasks: Task[] = [];
  sortBy: 'priority' | 'dueDate' = 'priority'; // <-- NEW
  loading = false;
  constructor(
    private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }
  // Load tasks when the component initializes
  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  onSortChange(sortBy: string): void {
    const sortedTasks = [...this.tasks]; // clone to avoid mutating directly

    switch (sortBy) {
      case 'priority':
        const priorityOrder = ['Low', 'Medium', 'High'];
        sortedTasks.sort((a, b) =>
          priorityOrder.indexOf(b.priority || '') - priorityOrder.indexOf(a.priority || '')
        );
        break;

      case 'dueDate':
        sortedTasks.sort((a, b) =>
          new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime()
        );
        break;

      case 'status':
        sortedTasks.sort((a, b) =>
          (a.status || '').localeCompare(b.status || '')
        );
        break;
    }

    // Push sorted tasks back into the service
    this.taskService.setTasks(sortedTasks);
  }
  // Remove a tag from a task and update the task
  removeTag(task: Task, tagToRemove: string): void {
    task.tags = task.tags?.filter(tag => tag !== tagToRemove) || [];
    this.taskService.updateTask(task);
  }
  // Delete a task by its ID
  deleteTask(id: number): void {
    this.loading = true;
    this.taskService.deleteTask(id);
    this.snackBar.open('Task deleted successfully!', 'Close', {
      duration: 3000,
    });
    this.loading = false;
  }
  // Archive a task (move it to the archive list)
  archiveTask(id: number): void {
    this.loading = true;
    this.taskService.archiveTask(id);
    this.snackBar.open('Task archived successfully!', 'Close', {
      duration: 3000,
    });
    this.loading = false;
  }
  // Navigate to task detail view
  viewTask(id: number): void {
    this.router.navigate(['/task', id]);
  }
  // Navigate to task edit form
  editTask(id: number): void {
    this.router.navigate(['/edit', id]);
  }
}
