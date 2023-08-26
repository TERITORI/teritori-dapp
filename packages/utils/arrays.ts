export const nextItemInArray = (array: any[], currentIndex: number) => {
  if (currentIndex === array.length - 1) {
    return array[0];
  } else {
    return array[currentIndex + 1];
  }
};
export const previousItemInArray = (array: any[], currentIndex: number) => {
  if (currentIndex === 0) {
    return array[array.length - 1];
  } else {
    return array[currentIndex - 1];
  }
};
