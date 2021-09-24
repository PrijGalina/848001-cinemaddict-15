import dayjs from 'dayjs';

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
