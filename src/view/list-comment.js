import SmartView from './smart';
import NewCommentView from './new-comment';
import {render} from '../utils/render';
import {RenderPosition} from '../data';

const commentContainerTemplate = (commentsArray) => `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsArray.length}</span></h3>
      <ul class="film-details__comments-list"></ul>
    </section>
  </div>`;

export default class CommentsList extends SmartView {
  constructor(comments) {
    super();
    this._commentsArray = comments;
    this.renderNewCommentBlock();
  }

  getTemplate() {
    return commentContainerTemplate(this._commentsArray);
  }

  renderNewCommentBlock() {
    const newCommentView = new NewCommentView();
    const container = document.querySelector('.film-details__comments-wrap');
    render(container, newCommentView, RenderPosition.BEFOREEND);
  }
}
