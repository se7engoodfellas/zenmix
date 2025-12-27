export const formatSecondsToMinutes = (time) => {
  const min = Math.floor(time / 60);
    const sec = time % 60;

    const formattedMin = String(min).padStart(2, '0');
    const formattedSec = String(sec).padStart(2, '0');

    return `${formattedMin}:${formattedSec}`;
}