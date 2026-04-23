import DOMPurify from 'dompurify';

export function sanitize(input: string): any {
  if (!input) return '';
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return DOMPurify.sanitize(input);
}
