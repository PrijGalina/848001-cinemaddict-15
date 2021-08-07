import {getRandomPositiveInteger, getRandomPositiveFloat, getRandomArray, getRandomElement} from './utils';
import { arrayMovieInfo, workingGroup, ageRestrictionsArray, durationFilmsArray, countryArray, releaseArray, descriptionTextArray, COUNT_COMMENTS} from './data.js';
import {generateComment} from './comment.js';
import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(objectSupport);
dayjs.extend(advancedFormat);

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
  const Date = dayjs({
    year: year,
    month: month - 1,
    day: day,
  });
  const monthName = Date.format('MMM');
  return [day, monthName, year];
};

const comment = new Array(COUNT_COMMENTS).fill().map(generateComment);
const commentIdArray = Array.from(comment).map((el) => el.aboutFilm);

const getCountComments = (commentArray, id) => {
  const result = commentArray.filter(i => i === id).length;
  return result;
};

const generateMovie = () => {
  const indexMovieTitle = getRandomPositiveInteger(1, Object.keys(arrayMovieInfo).length);
  const dateArray = generateData();
  const movie = {
    filmId: arrayMovieInfo[indexMovieTitle].filmId,
    originalName: arrayMovieInfo[indexMovieTitle].original,
    title: arrayMovieInfo[indexMovieTitle].title,
    description: getRandomArray(descriptionTextArray, 5).join('').trim(),
    poster: arrayMovieInfo[indexMovieTitle].poster,
    release: dateArray[2],
    rating: getRandomPositiveFloat(1, 10, 1),
    duration: getRandomElement(durationFilmsArray),
    genres: getRandomArray(releaseArray, 4),
    directors: getRandomArray(workingGroup, 2),
    writers: getRandomArray(workingGroup, 3),
    actors: getRandomArray(workingGroup, 4),
    country: getRandomElement(countryArray),
    ageRestrictions: getRandomElement(ageRestrictionsArray),
    countComments: getCountComments(commentIdArray, arrayMovieInfo[indexMovieTitle].filmId),
    isFavorite: Boolean(getRandomPositiveInteger(0, 1)),
    isWatched: Boolean(getRandomPositiveInteger(0, 1)),
    isWatchlist: Boolean(getRandomPositiveInteger(0, 1)),
  };
  return movie;
};

export {generateMovie};
