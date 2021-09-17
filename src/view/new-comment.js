import SmartView from './smart';
import {emojiArray} from '../data';

const TEMPLATE_NEW_COMMENT = {
  id: '',
  autor: '',
  comment: '',
  date: '',
  emotion: '',
  aboutFilm: '',
};

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

export default class NewComment extends SmartView {
  constructor(comment = TEMPLATE_NEW_COMMENT) {
    super();
    this._data = NewComment.parseCommentToData(comment);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._commentTextareaHandler = this._commentTextareaHandler.bind(this);

    //this._setInnerHandlers();
  }

  getTemplate() {
    return createNewCommentContainer();
  }

  reset(comment) {
    this.updateData(
      NewComment.parseTaskToData(comment),
    );
  }

  _setInnerHandlers(){
    const emojis = this.getElement().querySelectorAll('.film-details__emoji-label');
    emojis.forEach((emoji) => {
      emoji.addEventListener('click', this._emojiClickHandler);
    });
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentTextareaHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _emojiClickHandler(e) {
    e.preventDefault();
    this.updateData({
      isChoosenEmoji: e.target.parentElement.dataset.value,
    }, false);
  }

  _commentTextareaHandler(e) {
    e.preventDefault();
    this.updateData({
      comment: e.target.value,
    }, true);
    if(e.target.value !== ''){
      this.setFormSubmitHandler(this._callback.formSubmit);
    }
  }

  _formSubmitHandler(e) {
    e.preventDefault();
    this._callback.formSubmit(NewComment.parseDataToMovie(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    document.addEventListener('keydown', (e) => { //навесить обработчик отправки формы добавления нового комментария
      if((e.code === 'Enter') && e.ctrlKey) {
        //отправка данных в модель
      }
    });
  }

  static parseCommentToData(comment) { // информация в состояние (когда редактируем)
    return Object.assign(
      {},
      comment,
      {
        isChoosenEmoji: comment.emotion,
        isCommentInner: comment.comment,
      },
    );
  }

  static parseDataToComment(data) { // превращает состояние в информацию (когда сохраняем)
    data = Object.assign({}, data);

    if(!data.isChoosenEmoji) {
      data.isChoosenEmoji = '';
    }

    if(!data.isCommentInner) {
      data.isCommentInner = '';
    }

    delete data.isChoosenEmoji;
    delete data.isCommentInner;
    return data;
  }
}
