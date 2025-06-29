import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appOverdueHighlight]'
})
export class OverdueHighlightDirective implements OnInit {
  @Input('appOverdueHighlight') dueDate!: string | Date | null;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    if (!this.dueDate) return;

    const date = new Date(this.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#ffcccc');
    }
  }
}
