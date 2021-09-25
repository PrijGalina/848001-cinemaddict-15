import AbstractView from './abstract';

const createFilmsContainer = () => (
  '<section class=\'films\'></section>'
);

export default class MoviesContainer extends AbstractView {
  getTemplate() {
    return createFilmsContainer();
  }
}
