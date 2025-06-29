import { Component, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { TaskService } from '../../shared/services/task.service';
import { Task } from '../../models/task.model';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  // Define separator keys for tag input (comma and enter)
  separatorKeysCodes: number[] = [ENTER, COMMA];
  // Form group for the task form
  taskForm!: FormGroup;
  // Tag-related variables
  allTags: string[] = [];
  filteredTagOptions: Observable<string[]> = of([]);
  tagCtrl = new FormControl('');
  tagLimitReached = false;
  tagLoadError = false;
  loading = false;
  // Edit mode control
  isEditMode = false;
  editingTaskId: number | null = null;

  readonly maxTags = 5;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initializeForm();  // Setup the form
    this.loadTags();  // Load tag suggestions
    this.checkEditMode(); // Determine if we're editing an existing task
  }
  // Create form with validators
  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(200)]],
      status: ['', Validators.required],
      dueDate: ['', this.pastDateValidator()],
      category: ['', Validators.required],
      priority: [''],
      tags: [[], [this.validateTags.bind(this)]]
    });
  }
  // Load all possible tags for autocomplete
  private loadTags(): void {
    this.taskService.getTags().subscribe({
      next: tags => {
        this.allTags = tags;
        this.filteredTagOptions = this.tagCtrl.valueChanges.pipe(
          startWith(''),
          map(value => this.filterTags(value || ''))
        );
      },
      error: _ => {
        this.tagLoadError = true;
        this.allTags = [];
      }
    });
  }
  // If we're editing, load the task data and patch the form
  private checkEditMode(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.editingTaskId = +idParam;
      this.taskService.getTaskById(this.editingTaskId).subscribe(task => {
        if (task) {
          this.taskForm.patchValue(task);
        }
      });
    }
  }
  // Handle form submit
  onSubmit(): void {
    if (this.taskForm.valid) {

      this.isEditMode ? this.updateTask() : this.createTask();
    }
  }
  // Add a new task
  private createTask(): void {
    this.loading = true;
    const newTask: Task = this.taskForm.value;
    this.taskService.addTask(newTask);
    this.snackBar.open('Task created successfully!', 'Close', {
      duration: 3000,
    });
    this.resetFormAndRedirect();
    this.loading = false;
  }
  // Update an existing task
  private updateTask(): void {
    if (this.editingTaskId !== null) {
      this.loading = true;
      const updatedTask: Task = { id: this.editingTaskId, ...this.taskForm.value };
      this.taskService.updateTask(updatedTask);
      this.snackBar.open('Task updated successfully!', 'Close', {
        duration: 3000,
      });
      this.resetFormAndRedirect();
      this.loading = false;
    }
  }
  // Reset form and return to list view
  private resetFormAndRedirect(): void {
    this.taskForm.reset();
    Object.keys(this.taskForm.controls).forEach(key => {
      this.taskForm.get(key)?.setErrors(null);
    });
    this.taskForm.markAsPristine();
    this.taskForm.markAsUntouched();
    this.router.navigate(['/']);
  }
  // Filter tags based on input text
  private filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }
  // Add a new tag to the list
  addTag(tag: string): void {
    if (!tag?.trim()) return;
    const currentTags = this.taskForm.value.tags || [];
    if (currentTags.length >= this.maxTags) {
      this.tagLimitReached = true;
      return;
    }
    if (!currentTags.includes(tag)) {
      currentTags.push(tag);
      this.taskForm.patchValue({ tags: currentTags });
      this.tagCtrl.setValue('');
      this.tagLimitReached = false;
    }
  }
  // Remove a tag
  removeTag(tag: string): void {
    const currentTags = this.taskForm.value.tags || [];
    const updatedTags = currentTags.filter((t: string) => t !== tag);
    this.taskForm.patchValue({ tags: updatedTags });
    this.tagLimitReached = false;
  }
  // Validate max number of tags
  validateTags(control: FormControl) {
    const tags = control.value;
    return tags && tags.length > this.maxTags ? { tooManyTags: true } : null;
  }
  // Custom validator to disallow past dates
  pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate && selectedDate < today ? { pastDate: true } : null;
    };
  }
}
