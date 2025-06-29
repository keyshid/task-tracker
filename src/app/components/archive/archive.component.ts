import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../shared/services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss']
})
export class ArchiveComponent implements OnInit {
  archivedTasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.tasks$.subscribe(tasks => {
      this.archivedTasks = tasks.filter(task => task.archived);
    });
  }

  unarchiveTask(id: number): void {
    this.taskService.unarchiveTask(id);
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id);
  }
}
