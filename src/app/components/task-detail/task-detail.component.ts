import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../shared/services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  // This holds the selected task based on route ID
  task: Task | undefined;

  constructor(
    private route: ActivatedRoute, // Used to grab the task ID from the URL
    private taskService: TaskService // Service to fetch task data
  ) { }

  ngOnInit(): void {
    // Get the ID from the URL
    const taskIdParam = this.route.snapshot.paramMap.get('id');
    if (taskIdParam !== null) {
      const taskId = Number(taskIdParam);
      // Fetch the task by its ID and store it in the component
      this.taskService.getTaskById(taskId).subscribe((task: Task | undefined) => {
        this.task = task;
      });
    }
  }
}
