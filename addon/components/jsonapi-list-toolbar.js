import Ember from 'ember';
import layout from '../templates/components/jsonapi-list-toolbar';

export default Ember.Component.extend({
  layout,

  /**
    List of filters, objects with prop name, options list, and selected

    ```js
    let options = ['All', 'Active', 'Completed'];
    {
      name: 'status',
      options: options,
      selected: options[0]
    }
    ```

    @property filters
    @type Array
  */
  filters: null,

  /**
    Action passed in to handler filtering

    @method filterAction
  */
  filterAction: Ember.K,

  /**
    @property placeholderText
    @type String
  */
  placeholderText: 'Search…',

  /**
    Action passed in to handler filtering

    @method filterAction
  */
  searchAction: Ember.K,

  /**
    @property searchQuery
    @type String
  */
  searchQuery: '',

  /**
    @property sortBy
    @type String
  */
  sortBy: null,

  sortAction: Ember.K,

  /**
    @property orderBy
    @type String
  */
  orderBy: null,

  /**
    toggles the arrow that displays whether ordering should be asc or desc
    @property isDescending
    @type Boolean
  */
  isDescending: Ember.computed('orderBy', function() {
    if(this.get('orderBy') === 'desc') {
      return true;
    } else {
      return false;
    }
  }),

  actions: {
    /**
      @method actions.filter
      @param {String} name of attribute to filter by
      @param {String} selected value for filter
    */
    filter(name, selected) {
      this.get('filterAction')(name, selected);
    },

    /**
      @method actions.search
      @param {String} query to filter by
    */
    search(query) {
      this.get('searchAction')(query);
    },

    /**
      @method actions.sort
      @param  {String} field of the attribute for sort param
    */
    sort(field) {
      this.get('sortAction')(field);
    },

    /**
      @method actions.order
      @param  {String} direction for setting the order to sort by
    */
    order(direction) {
      this.toggleProperty('isDescending');
      if (direction === 'desc') {
        this.set('orderBy', 'asc');
      } else {
        this.set('orderBy', 'desc');
      }
      this.get('orderAction')(this.get('orderBy'));
    }
  }
});
