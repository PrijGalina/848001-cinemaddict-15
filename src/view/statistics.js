import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart.js';
import {durationWatchedMovies, getGenreStat, getFavoriteGenre} from '../utils/statistic';
import {filterStatsType, FilterType} from '../const';
import {filterStats, filter} from '../utils/filter';

const renderGenreChart = (container, movies) =>  {
  const genreStat = getGenreStat(movies);
  const labelArray = Object.keys(genreStat).map((key) => {
    if (genreStat[key] !== 0){
      return key;
    }
  });
  const dataArray = Object.keys(genreStat).map((key) => {
    if (genreStat[key] !== 0) {
      return genreStat[key];
    }
  });

  const chart = new Chart(container, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labelArray,
      datasets: [{
        data: dataArray,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        barThickness: 24,
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return chart;
};

const createStatisticsTemplate = (data, filters, current) => {
  const movies = data;
  const currentFilter = current;
  const currentFilterInfo = filters.filter((filter) => {
    if (filter.type === currentFilter) {
      return filter;
    }
  });
  const durationArray = durationWatchedMovies(currentFilterInfo[0].duration);

  const genreStat = getGenreStat(movies);
  const favoriteGenre = getFavoriteGenre(genreStat);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${filterStatsType.ALL_TIME}" ${(currentFilter === filterStatsType.ALL_TIME) ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${filterStatsType.TODAY}" ${(currentFilter === filterStatsType.TODAY) ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${filterStatsType.WEEK}" ${(currentFilter === filterStatsType.WEEK) ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${filterStatsType.MONTH}" ${(currentFilter === filterStatsType.MONTH) ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${filterStatsType.YEAR}" ${(currentFilter === filterStatsType.YEAR) ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${data.length}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        ${(movies.length > 0) ? `<p class="statistic__item-text">${durationArray[0]} <span class="statistic__item-description">h</span> ${durationArray[1]} <span class="statistic__item-description">m</span></p>` : '<p class="statistic__item-text">0</p>'}
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        ${(movies.length > 0) ? `<p class="statistic__item-text">${favoriteGenre}</p>`: ''}
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`;
};

export default class Statistics extends SmartView {
  constructor(moviesModel, filters, currentFilter) {
    super();
    this._moviesModel = moviesModel;
    this._movies = this._moviesModel._movies;
    this._filters = filters;
    this._currentFilter = currentFilter;
    this._filtredMovie = this._getMovies();
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._createStatisticBlock = null;
    this._setCharts();
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatisticsTemplate(this._filtredMovie, this._filters, this._currentFilter);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _filterTypeChangeHandler(e) {
    this._callback.sortChange(e.target.id);
    this.removeDataCharts(chart);
  }

  setFilterChangeStatistic(callback) {
    this._callback.sortChange = callback;
    this.getElement().querySelectorAll('.statistic__filters-input').forEach((sortItem) => {
      sortItem.addEventListener('change', this._filterTypeChangeHandler);
    });
  }

  _getMovies() {
    const watchedMovie = filter[FilterType.WATCHLIST](this._movies);
    const filterType = this._currentFilter;
    const filtredMovies = filterStats[filterType](watchedMovie);
    return filtredMovies;
  }

  _setCharts() {
    if (this._createStatisticBlock !== null) {
      this._createStatisticBlock = null;
    }

    const BAR_HEIGHT = 50;
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    statisticCtx.height = BAR_HEIGHT * this._filtredMovie.length;

    this._genreCart = renderGenreChart(statisticCtx, this._filtredMovie);
  }

  removeDataCharts(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }
}
