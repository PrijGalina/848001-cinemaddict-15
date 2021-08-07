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

const getRandomArray = (array, amount) => {
  const numberElements = getRandomPositiveInteger(1, amount);
  const arrayCopy = array;
  /*const randomArray = [];
  for (let i = 1; i <= numberElements; i++) {
    const randomIndex = getRandomPositiveInteger(0, arrayCopy.length-1);
    randomArray.push(arrayCopy[randomIndex]);
    arrayCopy.splice(arrayCopy[randomIndex], 1);
  }*/
  const randomArray = new Array(numberElements).fill().map((el) => {
    const randomIndex = getRandomPositiveInteger(0, arrayCopy.length - 1);
    return arrayCopy[randomIndex];
  });
  return randomArray;
};

const getRandomElement = (array) => {
  const randomIndex = getRandomPositiveInteger(0, array.length-1);
  return array[randomIndex];
};

export {getRandomPositiveInteger, getRandomPositiveFloat, getRandomArray, getRandomElement};
