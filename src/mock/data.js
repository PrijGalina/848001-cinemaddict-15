
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
const durationFilmsArray = ['1h 18m', '2h 08m', '3h 08m', '1h 44m', '1h 20m', '2h 20m', '1h 55m', '2h 12m', '2h 42m', '3h 03m', '2h 35m', '1h 10m', '55m', '1h 05m', '1h 49m', '2h 52m', '2h 12m', '3h 18m', '3h 55m', '2h 30m', '1h 50m', '1h 08m', '1h 47m', '2h 22m'];
const countryArray = ['Austria', 'Belgium', 'United Kingdom', 'Germany', 'Greece', 'Ireland', 'Spain', 'Italy', 'Latvia', 'Poland', 'Russia', 'Slovenia', 'France', 'USA', 'Czech Republic', 'Ukraine', 'Sweden'];
const releaseArray = ['Drama', 'Comedy', 'Musical', 'Romance', 'Romantic comedy', 'Detective / Crime', 'Action', 'Thriller', 'Horror', 'Animated film', 'Cartoon', 'Science fiction', 'Fantasy', 'Documentary', 'Silent movie', 'Western', 'Art-house film', 'Short film', 'Underground film'];
const descriptionText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';
let descriptionTextArray = descriptionText.split('. ');
descriptionTextArray.pop();
descriptionTextArray = descriptionTextArray.map((string) => `${string}. `);
const emojiArray = ['sleeping', 'smile', 'puke', 'angry'];
const COUNT_MOVIES = 20;
const COUNT_COMMENTS = 10;
export {arrayMovieInfo, workingGroup, ageRestrictionsArray, durationFilmsArray, countryArray, releaseArray, descriptionTextArray, emojiArray, COUNT_MOVIES, COUNT_COMMENTS};
