import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dueDateFormat'
})
export class DueDateFormatPipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return 'No Due Date';
    }

    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove time part

    const formatted = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;

    return date < today ? `Overdue (${formatted})` : formatted;
  }
}
