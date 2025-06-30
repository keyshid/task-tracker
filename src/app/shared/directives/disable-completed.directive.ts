import {
  Directive,
  Input,
  OnChanges,
  Renderer2,
  ElementRef,
  SimpleChanges,
  AfterViewInit
} from '@angular/core';

@Directive({
  selector: '[appDisableCompleted]'
})
export class DisableCompletedDirective implements OnChanges, AfterViewInit {
  @Input('appDisableCompleted') taskStatus: string | undefined;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.updateFieldStates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateFieldStates();
  }

  private updateFieldStates(): void {
    const form: HTMLFormElement = this.el.nativeElement;

    const disable = this.taskStatus === 'Done';

    const inputsToDisable = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      '[formControlName]:not([formControlName="status"])'
    );

    inputsToDisable.forEach(input => {
      if (disable) {
        this.renderer.setAttribute(input, 'disabled', 'true');
        this.renderer.setStyle(input, 'opacity', '0.6');
      } else {
        this.renderer.removeAttribute(input, 'disabled');
        this.renderer.removeStyle(input, 'opacity');
      }
    });
  }
}
