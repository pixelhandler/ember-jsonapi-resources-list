/**
  @module mixins
  @submodule controllers/jsonapi-list
**/
import Ember from 'ember';

/**
  @class ControllersJsonapiListMixin
*/
export default Ember.Mixin.create({
  /**
    In most cases, refine the queryParams array and include the items below
    along with your custom fitlers.

    @property [queryParams]
    @type Array
  */
  queryParams: [
    { searchQuery: 'search' },
    { sortParamName: 'sort' },
    { sortingDirection: 'order'}
  ],

  /**
    Value use with search filter for API requests

    @property [searchQuery]
    @type String
  */
  searchQuery: '',

  /**
    Value to sort by for API requests

    @property [sortParamName]
    @type String
  */
  sortParamName: '',

  /**
    Direction of sorting for API requests

    @property [sortingDirection]
    @type String - values can be `asc` or `desc`
  */
  sortingDirection: '',

  /**
    Flag to show button for more

    @property [hasMore]
    @type Boolean
  */
  hasMore: true,

  /**
    Flag to indicate an is loading state

    @property [loadingMore]
    @type Boolean
  */
  loadingMore: false,

  /**
    Method for determining the sort direction. Calls the toggle function which determines whether the sort is asc or desc

    @method[setSortDirection]
  */
  setSortDirection(field) {
    let direction;
    if (this.get('sortParamName') === field) {
      direction = this.toggleOrder();
    } else {
      //this is mainly for the initial sortParams (-updated_at)
      if (field.indexOf("-") !== -1) {
        direction = 'desc';
      } else {
        direction = 'asc';
      }
    }
    return direction;
  },

  /**
    Method to toggle the value of sortDirection depending on what the previous value is

    @method[toggleOrder]
  */
  toggleOrder() {
    let direction;
    if (this.get('sortingDirection') === 'asc') {
      direction = 'desc';
    } else {
      direction = 'asc';
    }
    return direction;
  },

  actions: {
    /**
      Set the filtering params to pass into the route and display into the URL

      Example for a `color` param…

      ```js
        filtering(key, value) {
          if (key === 'color') {
            this.set('colorFilter', value);
          }
          this.get('target').send('filtering', {
            color: this.get('colorParam')
          });
        },
      ```

      @method [actions.filtering]
      @required
      @param {String} [key]
      @param {String} [value]
    */
    filtering: Ember.K,

    /**
      Set the sorting params to pass into the route and display into the URL

      @method [sorting]
    */
    sorting(field) {
      let direction = this.setSortDirection(field);
      this.set('sortParamName', field);
      this.set('sortingDirection', direction);
      this.get('target').send('sorting', field, direction);
    }
  }
});
