
const arrayMovieInfo = {
  1: {
    title: 'Popeye the Sailor Meets Sindbad the Sailor',
    original: 'Popeye Meets Sindbad',
    poster: '../../images/posters/popeye-meets-sinbad.png',
    filmId: 0,
  },
  2: {
    title: 'Sagebrush Trail',
    original: 'The trail in the wormwood',
    poster: '../../images/posters/sagebrush-trail.jpg',
    filmId: 1,
  },
  3: {
    title: 'The Dance of Life',
    original: 'The Dance your life',
    poster: '../../images/posters/the-dance-of-life.jpg',
    filmId: 2,
  },
  4: {
    title: 'The Man with the Golden Arm',
    original: 'The man with the golden leg',
    poster: '../../images/posters/the-man-with-the-golden-arm.jpg',
    filmId: 3,
  },
  5: {
    title: 'The Great Flamarion',
    original: 'The Flamarion',
    poster: '../../images/posters/the-great-flamarion.jpg',
    filmId: 4,
  },
  6: {
    title: 'Santa Claus Conquers the Martian',
    original: 'Santa Claus',
    poster: '../../images/posters/santa-claus-conquers-the-martians.jpg',
    filmId: 5,
  },
  7: {
    title: 'Made for Each Other',
    original: 'Made for Each Other',
    poster: '../../images/posters/made-for-each-other.png',
    filmId: 6,
  },
};
const workingGroup = ['Anthony Mann', 'Anne Wigton', 'Heinz Herald', 'Richard Weil', 'Erich von Stroheim', 'Mary Beth Hughes', 'Dan Duryea', 'Anthony von Stroheim', 'Anne Duryea', 'Heinz Beth Hughes', 'Richard Duryea', 'Erich Mann', 'Mary Herald', 'Dan Wigton', 'Anthony Weil'];
const ageRestrictionsArray = ['0+', '6+', '12+', '16+', '18+'];
const countryArray = ['Austria', 'Belgium', 'United Kingdom', 'Germany', 'Greece', 'Ireland', 'Spain', 'Italy', 'Latvia', 'Poland', 'Russia', 'Slovenia', 'France', 'USA', 'Czech Republic', 'Ukraine', 'Sweden'];
const releaseArray = ['Drama', 'Comedy', 'Musical', 'Romance', 'Romantic comedy', 'Detective', 'Crime', 'Action', 'Thriller', 'Horror', 'Animated', 'Cartoon', 'Science fiction', 'Fantasy', 'Documentary', 'Silent movie', 'Western', 'Art-house', 'Short', 'Underground'];
const descriptionText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
let descriptionTextArray = descriptionText.split('. ');
descriptionTextArray.pop();
descriptionTextArray = descriptionTextArray.map((string) => `${string}. `);

const emojiArray = ['smile', 'sleeping', 'puke', 'angry'];

const MOVIE_COUNT = 12;

const SortType = {
  DEFAULT: 'default',
  BY_DATE: 'date',
  BY_RATING: 'rating',
};

export {arrayMovieInfo, MOVIE_COUNT, workingGroup, ageRestrictionsArray, countryArray, releaseArray, descriptionTextArray, emojiArray, SortType};
