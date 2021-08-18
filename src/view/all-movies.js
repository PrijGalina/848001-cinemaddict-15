import {createElement} from '../utils.js';

const createAllMoviesSection = () => (
  `<section class="films-list films-list--all">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container"></div>
    <button class="films-list__show-more">Show more</button>
  </section>`
);

export default class AllMovies {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createAllMoviesSection();
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
