export const alignDown = (count: number, stride: number) => {
  const factor = Math.floor(count / stride);
  return factor * stride;
};
