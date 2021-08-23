import AbstractView from './abstract.js';

const createFilmsContainer = () => (
  '<section class="films"></section>'
);

export default class MoviesContainer extends AbstractView {
  getTemplate() {
    return createFilmsContainer();
  }
}
