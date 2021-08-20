import AbstractView from './abstract.js';

const createFilmsContainer = () => (
  '<section class="films"></section>'
);

export default class FilmContainer extends AbstractView {

  getTemplate() {
    return createFilmsContainer();
  }
}
