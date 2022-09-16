export const random = (max: number, min = 0) => Math.random() * (max - min) + min;
export const coinFlip = () => Math.random() >= 0.5;
