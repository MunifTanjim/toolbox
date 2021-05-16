import { roundRobin } from './round-robin';

describe('roundRobin', () => {
  test('works as expected', () => {
    const next = roundRobin([1, 2, 3]);
    next();
    next();
    expect(next()).toBe(3);
    expect(next()).toBe(1);
  });
});
