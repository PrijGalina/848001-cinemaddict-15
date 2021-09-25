import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import updateLocale from 'dayjs/plugin/updateLocale';
dayjs.extend(calendar);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    lastWeek: 'd [days ago]',
    sameElse: 'DD/MM/YYYY h:m',
  },
});

export const sortMovieDate = (movieA, movieB) => dayjs(movieB.release).diff(dayjs(movieA.release));

export const sortMovieRating = (movieA, movieB) => {
  if (movieA.rating < movieB.rating) {return 1;}
  else if (movieA.rating > movieB.rating) {return -1;}
  else {return 0;}
};

export const sortMovieComments = (movieA, movieB) => {
  if (movieA.comments < movieB.comments) {return 1;}
  else if(movieA.comments > movieB.comments) {return -1;}
  else {return 0;}
};


export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const getFormattedDate = (value) => dayjs(value).calendar();
