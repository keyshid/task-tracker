import { DueDateFormatPipe } from './due-date-format.pipe';

describe('DueDateFormatPipe', () => {
  const pipe = new DueDateFormatPipe();

  it('should display "No Due Date" when input is null', () => {
    expect(pipe.transform(null)).toBe('No Due Date');
  });

  it('should format future date in MM/DD/YYYY', () => {
    const future = new Date();
    future.setDate(future.getDate() + 1);
    const result = pipe.transform(future);
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('should display "Overdue (...)" for past date', () => {
    const past = new Date();
    past.setDate(past.getDate() - 2);
    const result = pipe.transform(past);
    expect(result).toContain('Overdue');
  });
});
