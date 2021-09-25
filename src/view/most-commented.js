import AbstractView from './abstract';

const createMostCommentedSection = () => (
  `<section class='films-list films-list--extra films-list--commented'>
    <h2 class='films-list__title'>Most commented</h2>
    <div class='films-list__container'></div>
  </section>`
);

export default class MostCommented extends AbstractView {

  getTemplate() {
    return createMostCommentedSection();
  }
}
