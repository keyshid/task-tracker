import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DisableCompletedDirective } from './disable-completed.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div [appDisableCompleted]="taskStatus">Test</div>`
})
class TestComponent {
  taskStatus = 'To Do';
}

describe('DisableCompletedDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, DisableCompletedDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
  });

  it('should apply styles if status is "Done"', () => {
    fixture.componentInstance.taskStatus = 'Done';
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.directive(DisableCompletedDirective)).nativeElement;
    expect(div.style.pointerEvents).toBe('none');
    expect(div.style.opacity).toBe('0.6');
  });

  it('should not apply styles if status is not "Done"', () => {
    fixture.componentInstance.taskStatus = 'In Progress';
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.directive(DisableCompletedDirective)).nativeElement;
    expect(div.style.pointerEvents).toBe('');
    expect(div.style.opacity).toBe('');
  });
});
