export const trimString = (string) => {
  if (string.length > 15) {
    return `${string.slice(0, 15)}...`;
  }
  return string;
};
