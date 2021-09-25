import AbstractView from './abstract';

const createNavigationContainer = () => (
  '<nav class=\'main-navigation\'></nav>'
);

export default class NavigationContainer extends AbstractView {

  getTemplate() {
    return createNavigationContainer();
  }
}
