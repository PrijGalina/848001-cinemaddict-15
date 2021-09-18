import SmartView from './smart';

const commentContainerTemplate = (count) => `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${count}</span></h3>
      <ul class="film-details__comments-list"></ul>
    </section>
  </div>`;

export default class CommentsList extends SmartView {
  constructor(comments) {
    super();
    this._commentsCount = comments.length;
  }

  getTemplate() {
    return commentContainerTemplate(this._commentsCount, this._localComment);
  }
}
