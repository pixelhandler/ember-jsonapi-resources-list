import Ember from 'ember';
import layout from '../templates/components/jsonapi-list-pagination';

let pageSizeOptions = [25,50,75,100];

export default Ember.Component.extend({
  layout,

  /**
    @property pageNumber
    @type Number
    @required
  */
  pageNumber: 1,

  /**
    @property pageTotal
    @type Number
    @required
  */
  pageTotal: 1,

  /**
    @property pageSize
    @type Number
    @required
  */
  pageSize: null,

  /**
    @property pageSizes
    @type Array
  */
  pageSizes: Ember.computed('pageNumber', 'recordCount', 'pageSize', function () {
    let pageNumber = this.get('pageNumber');
    let count = this.get('recordCount');
    let pageSize = this.get('pageSize');
    return pageSizeOptions.filter((option) => {
      if (option === pageSize || count <= option) { return true; }
      let totalPages = Math.ceil(count / option);
      let hasMorePages = totalPages > pageNumber;
      return hasMorePages;
    });
  }),

  /**
    @property recordCount
    @type Number
    @required
  */
  recordCount: null,

  /**
    @property hasFirstPage
    @type Boolean
  */
  hasFirstPage: Ember.computed('pageNumber', 'pageTotal', function () {
    let page = this.get('pageNumber');
    let total = this.get('pageTotal');
    return (page > 2 && total > 2);
  }),

  /**
    @property hasPreviousPage
    @type Boolean
  */
  hasPreviousPage: Ember.computed('pageNumber', 'pageTotal', function () {
    let page = this.get('pageNumber');
    let total = this.get('pageTotal');
    return (page > 1 && total >= 2);
  }),

  /**
    @property hasNextPage
    @type Boolean
  */
  hasNextPage: Ember.computed('pageNumber', 'pageTotal', function () {
    let page = this.get('pageNumber');
    let total = this.get('pageTotal');
    return (page < total && total >= 2);
  }),

  /**
    @property hasLastPage
    @type Boolean
  */
  hasLastPage: Ember.computed('pageNumber', 'pageTotal', function () {
    let page = this.get('pageNumber');
    let total = this.get('pageTotal');
    return (page < total - 1 && total > 2);
  }),

  /**
    @property hasMultiplePages
    @type Boolean
  */
  hasMultiplePages: Ember.computed('pageTotal', function () {
    return this.get('pageTotal') > 1;
  }),

  actions: {
    /**
      @method actions.onPageSizeChange
      @param {String} size
    */
    onPageSizeChange(size) {
      this.get('on-page-size-change')(size);
    },

    /**
      @method actions.onFirst
    */
    onFirst() {
      if (this.get('hasFirstPage')) {
        this.get('on-first')();
      }
    },

    /**
      @method actions.onPrevious
    */
    onPrevious() {
      if (this.get('hasPreviousPage')) {
        this.get('on-previous')();
      }
    },

    /**
      @method actions.onNext
    */
    onNext() {
      if (this.get('hasNextPage')) {
        this.get('on-next')();
      }
    },

    /**
      @method actions.onLast
    */
    onLast() {
      if (this.get('hasLastPage')) {
        this.get('on-last')();
      }
    }
  },

  /* Action placeholders, these are requried */
  'on-page-size-change': Ember.K,
  'on-first': Ember.K,
  'on-previous': Ember.K,
  'on-next': Ember.K,
  'on-last': Ember.K
});
