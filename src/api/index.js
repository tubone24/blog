import dayjs from 'dayjs';

// Prevent webpack window problem
const isBrowser = () => typeof window !== 'undefined';

const getPageNumber = () => (isBrowser() ? +window.location.pathname.match(/page[/](\d)/)[1] : -1);

const getCurrentPage = () => {
  if (isBrowser() === true) {
    const str = window.location.pathname;
    if (str.indexOf('page') !== -1) {
      // Return the last pathname in number
      return getPageNumber();
    }
  }

  return 0;
};

// const getPath = () => (isBrowser() ? window.location.pathname : '');

const getMaxPages = (amount) => Math.ceil(amount / 10);

// const getPages = (amount) => new Array(amount).fill().map((_, index) => `/page/${index + 1}`);

const overflow = () => getCurrentPage() === getMaxPages();

const parseDate = (date) => dayjs(date).format('YYYY/MM/DD');

export {
  isBrowser,
  getCurrentPage,
  getMaxPages,
  // getPages,
  overflow,
  parseDate,
  // getPath,
  getPageNumber,
};
