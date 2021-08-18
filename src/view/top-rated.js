
import {createElement} from '../utils.js';

const createTopRatedSection = () => (
  `<section class="films-list films-list--extra films-list--rated">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class TopRated {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTopRatedSection();
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
