import AbstractView from './abstract';

const createAllMoviesSection = () => (
  `<section class="films-list films-list--all">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    <div class="films-list__container"></div>
  </section>`
);

export default class AllMovies extends AbstractView {
  getTemplate() {
    return createAllMoviesSection();
  }
}
