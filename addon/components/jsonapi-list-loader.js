/**
  @module components
  @submodule jsonapi-list-loader
**/
import Ember from 'ember';
import layout from '../templates/components/jsonapi-list-loader';

const { Component, computed, run, on } = Ember;

/**
  @class JsonapiListLoaderComponent
  @extends Ember.Component
*/
export default Component.extend({
  layout,

  /**
    @property [tagName]
    @type String
  */
  tagName: 'jsonapi-list-loader',

  /**
    @property [tagName]
    @type Boolean
  */
  hasMore: false,

  /**
    @property [loadingMore]
    @type Boolean
  */
  loadingMore: false,

  /**
    @method [setupListener]
  */
  setupListener: on('didInsertElement', function () {
    Ember.$(window).on('scroll', this.get('listener'));
  }),

  /**
    @method [teardownListener]
  */
  teardownListener: on('willDestroyElement', function () {
    Ember.$(window).off('scroll', this.get('listener'));
  }),

  /**
    @property [listener]
    @type Function
  */
  listener: computed(function () {
    return function () {
      if (this.isHasMoreButtonInsideViewport()) {
        this.send('showMore');
      }
    }.bind(this);
  }).readOnly(),

  /**
    @method [isHasMoreButtonInsideViewport]
    @return {Boolean}
  */
  isHasMoreButtonInsideViewport() {
    let btn = this.$('button.has-more');
    if (btn.length === 0) {
      // template did not include an button with the 'has-more' class.
      return false;
    } else {
      let $win = Ember.$(window);
      let scrollTop = $win.scrollTop();
      let height = $win.height();
      let bounds = { top: scrollTop, bottom: scrollTop + height, page: Ember.$('body').height() };
      let offset = btn.offset();
      return (offset.top < bounds.bottom && offset.top > bounds.top);
    }
  },

  actions: {
    /**
      @method [actions.showMore]
    */
    showMore() {
      run.throttle(this, this.dispatcher, this.dispatchThrottleRate, true);
    }
  },

  /**
    @method [dispatcher]
  */
  dispatcher() {
    this.sendAction('action');
  },

  /**
    Milliseconds value as a refresh rate for action dispatcher

    @property [dispatchThrottleRate]
    @type Number
  */
  dispatchThrottleRate: 500
});
