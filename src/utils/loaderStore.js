let requestCount = 0;

export const loaderStore = {
  show: () => {},
  hide: () => {},

  increment() {
    requestCount++;
    this.show();
  },

  decrement() {
    requestCount--;
    if (requestCount <= 0) {
      requestCount = 0;
      this.hide();
    }
  },
};
