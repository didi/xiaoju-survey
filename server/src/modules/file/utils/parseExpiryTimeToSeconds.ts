export const parseExpiryTimeToSeconds = (expiryTime: string): number => {
  const units: { [key: string]: number } = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
  };

  const unit = expiryTime.charAt(expiryTime.length - 1);
  const time = parseInt(expiryTime.slice(0, -1));
  return units[unit] * time;
};
