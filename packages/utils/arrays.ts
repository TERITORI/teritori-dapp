export const findDuplicates = (array: (string | number)[]) => {
  const seen = new Set();
  const duplicates = new Set();

  array.forEach((item) => {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  });

  return Array.from(duplicates);
};
