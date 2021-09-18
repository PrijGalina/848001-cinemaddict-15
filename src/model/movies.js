import AbstractObserver from '../utils/abstract-observer';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(movies) {
    this._movies = movies.slice();
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._Movies.findIndex((Movie) => Movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting Movie');
    }

    this._Movies = [
      ...this._Movies.slice(0, index),
      update,
      ...this._Movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addMovie(updateType, update) {
    this._Movies = [
      update,
      ...this._Movies,
    ];

    this._notify(updateType, update);
  }

  deleteMovie(updateType, update) {
    const index = this._Movies.findIndex((Movie) => Movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting Movie');
    }

    this._Movies = [
      ...this._Movies.slice(0, index),
      ...this._Movies.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
