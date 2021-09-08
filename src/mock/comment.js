import {getRandomArray, getRandomElement, getRandomPositiveInteger, getRandomDate} from '../utils/common.js';
import {workingGroup, descriptionTextArray, emojiArray, arrayMovieInfo} from './../data.js';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.extend(calendar);
import updateLocale from 'dayjs/plugin/updateLocale';
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    lastWeek: 'd [days ago]',
    sameElse: 'DD/MM/YYYY h:m',
  },
});

const getCommentDate = () => {
  const randomDate = getRandomDate(new Date('2021-08-28T01:57:45.271Z'), new Date('2021-09-07T01:57:45.271Z')).toISOString();
  const randomCommentDate = dayjs(randomDate).calendar();
  return randomCommentDate;
};

const generateComment = () => {
  const emojiIndex = getRandomElement(emojiArray);
  const filmId = getRandomPositiveInteger(0, Object.keys(arrayMovieInfo).length);
  const comment = {
    emoji: emojiIndex,
    text: getRandomArray(descriptionTextArray, 2).join('').trim(),
    date: getCommentDate(),
    autor: getRandomElement(workingGroup),
    aboutFilm: filmId,
  };
  return comment;
};

export {generateComment};

