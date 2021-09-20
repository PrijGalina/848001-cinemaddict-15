import {getRandomArray, getRandomElement, getRandomPositiveInteger, getRandomDate} from '../utils/common';
import {workingGroup, descriptionTextArray} from './../data';
import {emojiArray} from './../const';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';

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

const getCurrentDate = () => {
  const currentDate = dayjs().toISOString();
  const randomCommentDate = dayjs(currentDate).calendar();
  return randomCommentDate;
};

const generateComment = () => {
  const emojiIndex = getRandomElement(emojiArray);
  const comment = {
    id: getRandomPositiveInteger(1,100),
    autor: getRandomElement(workingGroup),
    comment: getRandomArray(descriptionTextArray, 2).join('').trim(),
    date: getCommentDate(),
    emotion: emojiIndex,
    aboutFilm: getRandomPositiveInteger(0,6),
  };
  return comment;
};

export { generateComment, getCurrentDate};

