import AbstractView from './abstract';

const createMovieCounter = () => (
  '<p>130 291 movies inside</p>'
);

export default class MovieCounter extends AbstractView {

  getTemplate() {
    return createMovieCounter();
  }
}
