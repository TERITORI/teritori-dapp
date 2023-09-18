export const getMediaDuration = (millis: number | undefined) => {
  if (!millis) {
    return "00:00";
  }

  const totalSec = millis / 1000;

  let hours: string | number = Math.floor(totalSec / 3600);
  let minutes: string | number = Math.floor((totalSec - hours * 3600) / 60);
  let seconds: string | number = Math.floor(
    totalSec - hours * 3600 - minutes * 60
  );

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  const minuteDuration = minutes + ":" + seconds;

  return Number(hours) ? hours + ":" + minuteDuration : minuteDuration;
};
