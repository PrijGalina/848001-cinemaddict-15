import AbstractObserver from '../utils/abstract-observer';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType,movies) {
    this._movies = movies.slice();
    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting Movie');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient (movies = []) {
    return movies.map((m = {}) => ({
      id: m.id,
      filmId: m.id,
      comments: m.comments,
      description: m.film_info.description,
      poster: m.film_info.poster,
      ageRestrictions: m.film_info.age_rating,
      originalName: m.film_info.title,
      title: m.film_info.alternative_title,
      rating: m.film_info.total_rating,
      duration: m.film_info.runtime,
      genres: m.film_info.genre,
      director: m.film_info.director,
      writers: m.film_info.writers,
      actors: m.film_info.actors,
      release: m.film_info.release.date,
      country: m.film_info.release.release_country,
      watchingDate: m.user_details.watching_date,
      isWatchlist: m.user_details.watchlist,
      isHistory: m.user_details.already_watched,
      isFavorite: m.user_details.favorite,
    }));
  }

  static adaptOneMovieToClient(movie) {
    return {
      id: movie.id,
      filmId: movie.id,
      comments: movie.comments,
      description: movie.film_info.description,
      poster: movie.film_info.poster,
      ageRestrictions: movie.film_info.age_rating,
      originalName: movie.film_info.title,
      title: movie.film_info.alternative_title,
      rating: movie.film_info.total_rating,
      duration: movie.film_info.runtime,
      genres: movie.film_info.genre,
      director: movie.film_info.director,
      writers: movie.film_info.writers,
      actors: movie.film_info.actors,
      release: movie.film_info.release.date,
      country: movie.film_info.release.release_country,
      watchingDate: movie.user_details.watching_date,
      isWatchlist: movie.user_details.watchlist,
      isHistory: movie.user_details.already_watched,
      isFavorite: movie.user_details.favorite,
    };
  }

  static adaptToServer(m = {}) {
    return {
      ['id']: m.id,
      ['comments']: m.comments,
      ['film_info']: {
        ['description']: m.description,
        ['poster']: m.poster,
        ['age_rating']: m.ageRestrictions,
        ['title']: m.originalName,
        ['alternative_title']: m.title,
        ['total_rating']: m.rating,
        ['runtime']: m.duration,
        ['genre']: m.genres,
        ['director']: m.director,
        ['writers']: m.writers,
        ['actors']: m.actors,
        ['release']: {
          ['date']: m.release,
          ['release_country']: m.country,
        },
      },
      ['user_details']: {
        ['watchlist']: m.isWatchlist,
        ['already_watched']: m.isHistory,
        ['watching_date']: m.watchingDate,
        ['favorite']: m.isFavorite,
      },
    };
  }
}
