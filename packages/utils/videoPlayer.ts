//nDuration: seconds
export const paddingZero = (n: number): string => {
  if (n < 10) return `0${n}`;
  return `${n}`;
};
export const durationToString = (nDuration: number): string => {
  const hour = Math.floor(nDuration / 3600);
  const min = Math.floor((nDuration - hour * 3600) / 60);
  const sec = Math.floor(nDuration - hour * 3600 - min * 60);
  return `${paddingZero(hour)}:${paddingZero(min)}:${paddingZero(sec)}`;
};

export const lastViewDate = (lastViewTimestamp: number): string => {
  console.log("---lastViewTimestamp:", lastViewTimestamp);
  if (lastViewTimestamp === 0) return "";
  const now = Math.floor(new Date().getTime() / 1000);
  const interval = now - lastViewTimestamp;
  if (interval < 0) return "";
  if (interval < 60) {
    return `${interval} seconds ago`;
  }
  if (interval < 3600) {
    return `${Math.floor(interval / 60)} minutes ago`;
  }
  if (interval < 86400) {
    return `${Math.floor(interval / 3600)} hours ago`;
  }
  return `${Math.floor(interval / 86400)} days ago`;
};
