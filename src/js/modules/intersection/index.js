/**
 *  @author Yaroslav Andrievskiy
 */


import helpers from './helpers';

export default (function (window, document, undefined) {

  // Plugin constants
  const MIN_THRESHOLD_VALUE = 0;
  const MAX_THRESHOLD_VALUE = 1;
  const THRESHOLD_DECIMALS = 2;
  const defaults = {
    root: null,
    rootMargin: '0px',
    threshold: [1],
    numSteps: 10,
    initialTrigger: false,
  };


  // The actual plugin constructor
  return class IObserver {
    /**
     * Creates an instance of Plugin
     *
     * @param {function} callback - callback function
     * @param {object} options - user configs
     * @constructor
     */
    constructor(callback, options) {

      this.settings = Object.assign({}, defaults, options);
      this.observables = [];

      if (!options.threshold) {
        this.settings.threshold = this._generateThresholdSchedule(options.steps, options.initialTrigger);
      }

      if (!options.rootMargin) {
        this.settings.rootMargin = `${options.offsetTop || '0px'} ${options.offsetRight || '0px'} ${options.offsetBottom || '0px'} ${options.offsetLeft || '0px'}`;
      }

      this.instance = new IntersectionObserver(callback, this.settings);
    }

    /**
     * generate schedule of callback function calls on observable dom-element
     *
     * @param {number} steps - amount of callback function calls
     * @param {boolean} initialTrigger - whether or not should callback trigger on first pixel of dom-element
     * @private
     */

    _generateThresholdSchedule(steps = 10, initialTrigger = false) {
      const threshold = [];
      const step = MAX_THRESHOLD_VALUE / steps;
      let base = step;

      if (initialTrigger) {
        base = MIN_THRESHOLD_VALUE;
      }

      for (let i = base; threshold.length < steps; i += step) {
        const thresholdPoint = Number(i.toFixed(THRESHOLD_DECIMALS));
        threshold.push(thresholdPoint);
      }

      return threshold;
    }

    /**
     * register dom-element as an observable
     *
     * @param {object} observableToRegister - dom-element to be watched by InteresctionObserver
     * @private
     */

    _registerObservable(observableToRegister) {
      try {
        this.instance.observe(observableToRegister);
        this.observables.push(observableToRegister);
      } catch (e) {
        // handle error
        console.error(e);
      }
    }

    /**
     * delete dom-element from the observables
     *
     * @param {number} steps - amount of callback function calls
     * @param {boolean} initialTrigger - whether or not should callback trigger on first pixel of dom-element
     * @private
     */

    _deleteObservable(observableToDelete) {
      try {
        this.observables = this.observables.filter((observable) => observable !== observableToDelete);
        this.instance.unobserve(observableToDelete);
      } catch (e) {
        // handle error
        console.error(e);
      }
    }

    /**
     *  public method to register observable
     *
     * @param {object} node - element to be observed
     *
     */

    observe(node) {
      if (helpers.isIterable(node)) {
        node.forEach((observable) => {
          this._registerObservable(observable);
        });

        return;
      }

      this._registerObservable(node);
      return;
    }

    /**
     *  public method to unregister observable
     *
     * @param {object} node - element to be unobserved
     *
     */

    unobserve(node) {
      if (helpers.isIterable(node)) {
        node.forEach((observable) => {
          this._deleteObservable(observable);
        });

        return;
      }

      this._deleteObservable(node);
      return;
    }

    /**
     *  public method to stop watching all of the instance target elements for visibility changes
     */

    destroy() {
      console.log(this);

      this.instance.disconnect();
      return;
    }
  }

})(window, document);