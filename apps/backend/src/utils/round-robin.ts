export const roundRobin = <T>(items: T[]): (() => T) => {
  let index = -1;

  if (!Array.isArray(items)) {
    throw new Error('items must be in array');
  }

  if (!items.length) {
    throw new Error('no items found');
  }

  return () => {
    index = index + 1;

    if (index >= items.length) {
      index = 0;
    }

    return items[index];
  };
};
