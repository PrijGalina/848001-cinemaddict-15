import dayjs from 'dayjs';

export const getRandomPositiveInteger = (numValue, otherNumValue) => {
  const lower = Math.ceil(Math.min(Math.abs(numValue), Math.abs(otherNumValue)));
  const upper = Math.floor(Math.max(Math.abs(numValue), Math.abs(otherNumValue)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

export const getRandomPositiveFloat = (numValue, otherNumValue, digits = 1) => {
  const lower = Math.min(Math.abs(numValue), Math.abs(otherNumValue));
  const upper = Math.max(Math.abs(numValue), Math.abs(otherNumValue));
  const result = Math.random() * (upper - lower) + lower;
  return result.toFixed(digits);
};

export const getRandomArray = (array, amount) => {
  const numberElements = getRandomPositiveInteger(1, amount);
  const randomArray = new Array(numberElements).fill().map(() => {
    const randomIndex = getRandomPositiveInteger(0, array.length - 1);
    return array[randomIndex];
  });
  return randomArray;
};

export const getRandomElement = (array) => {
  const randomIndex = getRandomPositiveInteger(0, array.length-1);
  return array[randomIndex];
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const deleteItem = (items, deleteElement) => {
  const index = items.findIndex((item) => item.id === deleteElement._comments.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    ...items.slice(index + 1),
  ];
};

export const sortMovieDate = (movieA, movieB) => dayjs(movieB.release).diff(dayjs(movieA.release));

export const sortMovieRating = (movieA, movieB) => {
  if (movieA.rating < movieB.rating) {return 1;}
  else if(movieA.rating > movieB.rating) {return -1;}
  else {return 0;}
};

export const sortMovieComments = (movieA, movieB) => {
  if (movieA.comments < movieB.comments) {return 1;}
  else if(movieA.comments > movieB.comments) {return -1;}
  else {return 0;}
};

export const getRandomDate = (from, to) => {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};
