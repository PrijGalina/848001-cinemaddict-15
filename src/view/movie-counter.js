import {createElement} from '../utils.js';

const createMovieCounter = () => (
  '<p>130 291 movies inside</p>'
);

export default class MovieCounter {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMovieCounter();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
