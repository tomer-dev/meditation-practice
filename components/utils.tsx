export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function parseDuration(duration: string): number {
  return duration.length && typeof +duration === "number" && +duration > 0
    ? +duration
    : 0;
}

export function formatDuration(duration: number) {
  if (duration < 0) {
    return;
  }

  return new Date(duration).toISOString().substr(11, 8);
}
