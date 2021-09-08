import {getRandomPositiveInteger, getRandomPositiveFloat, getRandomArray, getRandomElement, getRandomDate} from '../utils/common.js';
import {arrayMovieInfo, workingGroup, ageRestrictionsArray, countryArray, releaseArray, descriptionTextArray} from './../data.js';
import {generateComment} from './comment.js';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const COMMENT_COUNT = 10;

const getRandomDuration = () => (
  dayjs.duration({
    minutes: `${getRandomPositiveInteger(1, 59) }m`,
    hours: `${getRandomPositiveInteger(1, 3)  }h`,
  }).format('H m')
);

const commentsArray = new Array(COMMENT_COUNT).fill().map(generateComment);
const commentsIdArray = Array.from(commentsArray).map((el) => el.aboutFilm);

const getCountComments = (comments, id) => {
  const result = comments.filter((i) => i === id).length;
  return result;
};

const generateMovie = () => {
  const indexMovieTitle = getRandomPositiveInteger(1, Object.keys(arrayMovieInfo).length);

  const movie = {
    id: nanoid(),
    filmId: arrayMovieInfo[indexMovieTitle].filmId,
    originalName: arrayMovieInfo[indexMovieTitle].original,
    title: arrayMovieInfo[indexMovieTitle].title,
    description: getRandomArray(descriptionTextArray, 5).join('').trim(),
    poster: arrayMovieInfo[indexMovieTitle].poster,
    release: getRandomDate(new Date('1960-02-12T01:57:45.271Z'), new Date('2020-02-12T01:57:45.271Z')).toISOString(),
    rating: getRandomPositiveFloat(1, 10, 1),
    duration: getRandomDuration(),
    genres: getRandomArray(releaseArray, 4),
    directors: getRandomArray(workingGroup, 2),
    writers: getRandomArray(workingGroup, 3),
    actors: getRandomArray(workingGroup, 4),
    country: getRandomElement(countryArray),
    ageRestrictions: getRandomElement(ageRestrictionsArray),
    countComments: getCountComments(commentsIdArray, arrayMovieInfo[indexMovieTitle].filmId),
    isFavorite: Boolean(getRandomPositiveInteger(0, 1)),
    isHistory: Boolean(getRandomPositiveInteger(0, 1)),
    isWatchlist: Boolean(getRandomPositiveInteger(0, 1)),
    isChoosenEmojiForComment: '',
    commentText: '',
  };
  return movie;
};

export { generateMovie, commentsArray};
