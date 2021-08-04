const getRandomPositiveInteger = (numValue, otherNumValue) => {
  // Функция взята из интернета и доработана,
  //Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
  const lower = Math.ceil(Math.min(Math.abs(numValue), Math.abs(otherNumValue)));
  const upper = Math.floor(Math.max(Math.abs(numValue), Math.abs(otherNumValue)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};
const getRandomPositiveFloat = (numValue, otherNumValue, digits = 1) => {
  const lower = Math.min(Math.abs(numValue), Math.abs(otherNumValue));
  const upper = Math.max(Math.abs(numValue), Math.abs(otherNumValue));
  const result = Math.random() * (upper - lower) + lower;
  return result.toFixed(digits);
};
export {getRandomPositiveInteger, getRandomPositiveFloat};
