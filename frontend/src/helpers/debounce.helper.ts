type DebounceFn = (...args: any[]) => void;

export function debounce(fn: DebounceFn, delay: number): DebounceFn {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
