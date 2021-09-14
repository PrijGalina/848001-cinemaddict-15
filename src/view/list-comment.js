import SmartView from './smart.js';
import { emojiArray } from '../data.js';
import { render } from '../utils/render.js';

const createNewCommentContainer = (choosenEmoji, comment = '') => {
  const createEmojiSelectionTemplate = () => (
    emojiArray.map((emojiItem) => `
      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emojiItem}" value="${emojiItem}" ${choosenEmoji === emojiItem ? 'checked' : ''}>
      <label class="film-details__emoji-label" for="emoji-${emojiItem}" data-value="${emojiItem}">
        <img src="./images/emoji/${emojiItem}.png" width="30" height="30" alt="emoji">
      </label>
    `).join('')
  );

  const emojiSelectionTemplate = createEmojiSelectionTemplate();
  const emojiSrc = (choosenEmoji) ? `style="background-image: url('/images/emoji/${choosenEmoji}.png'); background-size: contain;"` : '';
  return (`
    <div class="film-details__new-comment">
      <div class="film-details__add-emoji-label" ${emojiSrc}></div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojiSelectionTemplate}
      </div>
    </div>
  `);
};

const commentContainerTemplate = (commentsArray) => `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsArray.length}</span></h3>
      ${createNewCommentContainer()}
    </section>
  </div>`;

export default class CommentList extends SmartView {
  constructor(comments) {
    super();
    this._commentsArray = comments;
    console.log('MoviePopupView', this.MoviePopupView);
    //render();
  }

  getTemplate() {
    return commentContainerTemplate(this._commentsArray);
  }
}
