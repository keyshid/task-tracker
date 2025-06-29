import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appDisableCompleted]'
})
export class DisableCompletedDirective implements OnChanges {
  @Input('appDisableCompleted') taskStatus: string | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.taskStatus === 'Done') {
      this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.6');
      this.renderer.setStyle(this.el.nativeElement, 'filter', 'grayscale(0.4)');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'pointer-events');
      this.renderer.removeStyle(this.el.nativeElement, 'opacity');
      this.renderer.removeStyle(this.el.nativeElement, 'filter');
    }
  }
}
