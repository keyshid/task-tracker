import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('should return original string if shorter than limit', () => {
    expect(pipe.transform('Short text', 20)).toBe('Short text');
  });

  it('should truncate and add "..." if longer than limit', () => {
    const result = pipe.transform('This is a long description that will be cut.', 10);
    expect(result).toBe('This is a ...');
  });

  it('should return empty string if input is null', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
