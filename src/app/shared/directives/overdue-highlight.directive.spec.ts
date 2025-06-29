import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { OverdueHighlightDirective } from './overdue-highlight.directive';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div [appOverdueHighlight]="dueDate">Test</div>`
})
class TestComponent {
  dueDate: string | Date = new Date();
}

describe('OverdueHighlightDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, OverdueHighlightDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
  });

  it('should apply red background if due date is past', () => {
    fixture.componentInstance.dueDate = new Date(Date.now() - 86400000); // 1 day ago
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.directive(OverdueHighlightDirective));
    expect(divEl.nativeElement.style.backgroundColor).toBe('rgb(255, 204, 204)');
  });

  it('should not apply background if due date is future', () => {
    fixture.componentInstance.dueDate = new Date(Date.now() + 86400000); // 1 day ahead
    fixture.detectChanges();
    const divEl = fixture.debugElement.query(By.directive(OverdueHighlightDirective));
    expect(divEl.nativeElement.style.backgroundColor).toBe('');
  });
});
