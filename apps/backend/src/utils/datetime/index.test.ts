import { toSeconds } from '.';

describe('toSeconds', () => {
  test('milliseconds to seconds', () => {
    const milliseconds = 1000;
    expect(toSeconds(milliseconds)).toMatchInlineSnapshot(`1`);
  });

  test('time string to seconds', () => {
    expect(toSeconds('1m')).toMatchInlineSnapshot(`60`);
    expect(toSeconds('1h')).toMatchInlineSnapshot(`3600`);
  });
});
