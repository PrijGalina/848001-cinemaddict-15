import {getRandomPositiveInteger, getRandomPositiveFloat, getRandomArray, getRandomElement, getRandomDate} from '../utils/common';
import {arrayMovieInfo, workingGroup, ageRestrictionsArray, countryArray, genreArray, descriptionTextArray} from './../data';
import {comments} from '../main.js';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';

const generateMovie = () => {
  const indexMovieTitle = getRandomPositiveInteger(1, Object.keys(arrayMovieInfo).length);
  const commentsIdArray = comments.filter((commentElement) => commentElement.aboutFilm === arrayMovieInfo[indexMovieTitle].filmId);
  const movie = {
    id: nanoid(),
    filmId: arrayMovieInfo[indexMovieTitle].filmId,
    comments: commentsIdArray,
    film_info: {
      title: arrayMovieInfo[indexMovieTitle].title,
      alternative_title: arrayMovieInfo[indexMovieTitle].original,
      total_rating: getRandomPositiveFloat(1, 10, 1),
      poster: arrayMovieInfo[indexMovieTitle].poster,
      age_rating: getRandomElement(ageRestrictionsArray),
      director: getRandomArray(workingGroup, 2),
      writers: getRandomArray(workingGroup, 3),
      actors: getRandomArray(workingGroup, 4),
      release: {
        date: getRandomDate(new Date('1960-02-12T01:57:45.271Z'), new Date('2020-02-12T01:57:45.271Z')).toISOString(),
        release_country: getRandomElement(countryArray),
      },
      runtime: getRandomPositiveInteger(55, 210),
      genre: getRandomArray(genreArray, 4),
      description: getRandomArray(descriptionTextArray, 5).join('').trim(),
    },
    user_details: {
      watchlist: Boolean(getRandomPositiveInteger(0, 1)),
      already_watched: Boolean(getRandomPositiveInteger(0, 1)),
      watching_date: getRandomDate(new Date('2020-02-12T01:57:45.271Z'), dayjs().toDate()).toISOString(),
      favorite: Boolean(getRandomPositiveInteger(0, 1)),
    }
  };
  return movie;
};

export {generateMovie};
