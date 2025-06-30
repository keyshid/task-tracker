import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Task } from '../../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test description',
    dueDate: new Date('2025-12-01'),
    priority: 'High',
    status: 'To Do',
    tags: ['angular'],
    archived: false,
    category: 'Work'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a task', () => {
    service.addTask({ ...mockTask });
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Test Task');
    });
  });

  it('should delete a task', () => {
    service.addTask({ ...mockTask });
    service.deleteTask(1);
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(0);
    });
  });

  it('should archive and unarchive a task', () => {
    service.addTask({ ...mockTask });
    service.archiveTask(1);
    service.getArchivedTasks().subscribe(archived => {
      expect(archived.length).toBe(1);
    });
    service.unarchiveTask(1);
    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(1);
    });
  });

  it('should fetch tags from API', () => {
    const mockResponse = [
      { name: 'Tag1' },
      { name: 'Tag2' },
      { name: 'Tag3' }
    ];

    service.getTags().subscribe(tags => {
      expect(tags.length).toBe(3);
      expect(tags).toContain('Tag1');
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return cached tags if already fetched', () => {
    const mockResponse = [{ name: 'CachedTag' }];

    service.getTags().subscribe();
    httpMock.expectOne('https://jsonplaceholder.typicode.com/users').flush(mockResponse);

    service.getTags().subscribe(tags => {
      expect(tags).toEqual(['CachedTag']);
    });
  });

  it('should handle error when fetching tags', () => {
    service.getTags().subscribe(tags => {
      expect(tags).toEqual([]);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    req.error(new ErrorEvent('Network error'));
  });
});
