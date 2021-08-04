import {getRandomPositiveInteger, getRandomPositiveFloat} from './utils';
import {arrayMovieTitles, workingGroup, ageRestrictionsArray, durationFilmsArray, countryArray, releaseArray, descriptionTextArray} from './data';
import dayjs from 'dayjs';

const getRandomArray = (array, amount) => {
  const numberElements = getRandomPositiveInteger(1, amount);
  const randomArray = [];
  for (let i = 1; i <= numberElements; i++) {
    const randomIndex = getRandomPositiveInteger(0, array.length-1);
    randomArray.push(array[randomIndex]);
    array.splice(array[randomIndex], 1);
  }
  return randomArray;
};

const getRandomElement = (array) => {
  const randomIndex = getRandomPositiveInteger(0, array.length-1);
  return array[randomIndex];
};

const generateData = () => {
  const minYearsGap = 1900;
  const maxYearsGap = dayjs().toDate().getFullYear();
  const year = getRandomPositiveInteger(minYearsGap, maxYearsGap);
  const minMonth = 1;
  const maxMonth = 12;
  const month = getRandomPositiveInteger(minMonth, maxMonth);
  const isLeap = (((year % 4 === 0) && (year % 100 !== 0))||((year % 4 === 0) && (year % 100 === 0) && (year % 400 === 0))); // високостный год?
  const thirtyOneDays = [1, 3, 5, 7, 8, 10, 12];
  let maxDay = 0;
  const minDay = 1;
  if (month === 2){
    maxDay = (isLeap) ? 29 : 28;
  }
  else if(thirtyOneDays.includes(month)) {
    maxDay = 31;
  }
  else {
    maxDay = 30;
  }
  const day = getRandomPositiveInteger(minDay, maxDay);
  console.log('year', year);
  console.log('month',month);
  console.log('day', day);

};

generateData();

const generateMovie = () => {
  const indexMovieTitle = getRandomPositiveInteger(1, Object.keys(arrayMovieTitles).length);
  const movie = {
    originalName: arrayMovieTitles[indexMovieTitle].original,
    title: arrayMovieTitles[indexMovieTitle].title,
    description: getRandomArray(descriptionTextArray, 5).join('').trim(),
    poster: arrayMovieTitles[indexMovieTitle].poster,
    release: '',
    rating: getRandomPositiveFloat(1, 10, 1),
    duration: getRandomElement(durationFilmsArray),
    genres: getRandomArray(releaseArray, 4),
    directors: getRandomArray(workingGroup, 2),
    writers: getRandomArray(workingGroup, 3),
    actors: getRandomArray(workingGroup, 6),
    country: getRandomElement(countryArray),
    ageRestrictions: getRandomElement(ageRestrictionsArray),
    comments: '',
  };
  return movie;
};

const randomMovie = generateMovie();

console.log(randomMovie);

export {generateMovie};

