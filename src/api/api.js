import MoviesModel from '../model/movies';
import CommentsModel from '../model/comments';
import {nanoid} from 'nanoid';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
    this._headers = { 'Authorization': `Basic ${this._authorization}`, 'Content-Type': 'application/json' };
  }

  getMovies() {
    return this._load({ url: 'movies' })
      .then(Api.toJSON)
      .then((movies) =>  MoviesModel.adaptToClient(movies));
  }

  getComments(movie) {
    return this._load({ url: `comments/${movie.id}`})
      .then(Api.toJSON)
      .then((comments) => CommentsModel.adaptToClient(comments));
  }

  updateMovie(movie) {
    return this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(movie)),
      headers: this._headers,
    })
      .then(Api.toJSON)
      .then(MoviesModel.adaptOneMovieToClient);
  }

  addComment(comment, movie) {
    return this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(CommentsModel.adaptToServer(comment)),
      headers: this._headers,
    })
      .then(Api.toJSON)
      .then(CommentsModel.adaptToClient);
  }

  deleteComment(comment) {
    return this._load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = this._headers,
  }) {
    return fetch(
      `${this._endPoint}/${url}`,
      { method, body, headers },
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}


const AUTHORIZATION = nanoid(15);

const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';

export const api = new Api(END_POINT, AUTHORIZATION);
