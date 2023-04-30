export const numberId = (len: number) => {
  return `${Math.floor(Math.random() * parseInt("9".repeat(len)))}`.padStart(len, "0");
};
