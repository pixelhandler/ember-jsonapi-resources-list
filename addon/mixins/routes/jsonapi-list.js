/**
  @module mixins
  @submodule routers/jsonapi-list
**/
import Ember from 'ember';

const { Mixin, required, computed, on } = Ember;

/**
  @class RoutersJsonApiMixin
*/
export default Mixin.create({

  /**
    The name of the model type, used with store service

    @property [resourceName]
    @type String
    @required
  */
  resourceName: required,

  /**
    The parent or route name

    @property [routeParent]
    @type String
    @required
  */
  routeParent: required,

  /**
    The count of resources in a page

    @property [size]
    @type Number
  */
  size: 25,

  /**
    Current Page number

    @property [number]
    @type Number
  */
  number: 1,

  /**
    Total pages based on current query for resources

    @property [total]
    @type Number
  */
  total: computed.reads('meta.total'),

  /**
    Sort param for API request, use `-` prefix for desc sort, default is asc

    @property [sortParams]
    @type String
  */
  sortParams: '-updated-at',

  /**
    @property [sortField]
    @type String
  */
  sortField: computed('meta.sort', function () {
    let sort = this.get('meta.sort');
    let field;
    if (sort && sort.length) {
      field = sort[0].field;
    }
    return field.replace(/_/g, '-');
  }),

  /**
    @property [sortDirection]
    @type String
  */
  sortDirection: computed('meta.sort', '_sortDirection', {
    get(key) {
      let sort = this.get('meta.sort');
      let direction;
      if (sort && sort.length) {
        direction = sort[0].direction;
      }
      let sortWithoutReload = this.get(`_${key}`);
      return sortWithoutReload || direction;
    },
    set(key, value) {
      return this.set(`_${key}`, value);
    }
  }),

  /**
    Flag to indicate when the route is refreshing data

    @property [isRefreshing]
    @type Boolean
  */
  isRefreshing: false,

  /**
    Bump page number used in query if route is refreshing

    @method [beforeModel]
  */
  beforeModel() {
    if (this.isRefreshing) {
      let page = this.get('number');
      this.set('number', page + 1);
    }
  },

  /**
    @method [model]
    @param {Object} [params]
    @return {RSVP.Promise}
  */
  model(params) {
    // Grab url params and set them if necessary - this is for when users navigate directly in
    if (!!params.sortParamName && !!params.sortingDirection) {
      this.set('sortParams', params.sortParamName);
      this.set('sortDirection', params.sortingDirection);
    }
    this.buildFilters(params);

    let resource = this.get('resourceName');
    return this.store.find(resource, { query: this.buildQuery(params) });
  },

  /**
    Build filters based on params

    @param {Object} params
  */
  buildFilters(params) {
    let filters = this.get('filters') || {};
    //… customize filters based on params
    Ember.Logger.debug('params', params);
    /*
    if (!!params.colorParam && params.colorParam !== 'All') {
      filters.color = params.colorParam;
    }
    */
    this.set('filters', filters);
  },

  /**
    Collects map of loaded ids for use with building collections of resources

    @method [afterModel]
    @param {Array} [collection] resources
    @return {Array} collection
  */
  afterModel(collection) {
    this.isRefreshing = false;
    let ids = collection.mapBy('id');
    let loaded = this.get('loadedIds');
    if (loaded.get('length') === 0) {
      loaded.pushObjects(ids);
    } else {
      let more = [];
      for (let i = 0; i < ids.length; i++) {
        if (loaded.indexOf(ids[i]) === -1) {
          more.push(ids[i]);
        }
      }
      loaded.pushObjects(more);
    }
    return collection;
  },

  /**
    Set flags on the controller for loading more resources and builds collection

    @method [setupController]
  */
  setupController(controller, collection) {
    controller.setProperties({
      'hasMore': this.get('hasMore'),
      'loadingMore': false
    });
    collection = this.buildCollection();
    this._super(controller, collection);
  },

  /**
    Uses the cached resources to combine fetched collection for appending resources

    @method [buildCollection]
    @return {Array} collection of resources
  */
  buildCollection() {
    let resource = this.get('resourceName');
    let data = this.store.all(resource);
    let ids = this.get('loadedIds');
    let collection = data.filter(function (record) {
      return (ids.indexOf(record.get('id')) > -1);
    }).sortBy(this.get('sortField'));
    if (this.get('sortParams') !== '-updated-at' && this.get('sortDirection') === 'desc') {
      collection.reverse();
    }
    return collection;
  },

  /**
    Constructs an object to be serializes as get params with an API request

    @method [buildQuery]
    @param {Object} [params] properties to use with an API request, e.g. search query
    @param {String} [params.searchQuery]
    @return {Object} properties for API request parameters
  */
  buildQuery(params = {}) {
    let query = {};
    if (params.searchQuery) {
      query.filter = { search: params.searchQuery };
    }
    let paging = this.getProperties('number', 'size', 'sortParams');

    //JSON-api uses '-' to represent reverse order so we want to pass that to the API instead of an order parameter
    if (paging.sortParams !== '-updated-at' && this.get('sortDirection') === 'desc') {
      query.sort = "-" + paging.sortParams;
    } else {
      query.sort = paging.sortParams;
    }
    query['page[number]'] = paging.number;
    query['page[size]'] = paging.size;

    let filters = this.get('filters');
    Object.keys(filters).forEach(function(prop) {
      let value = filters[prop];
      if (value !== 'All') {
        query['filter['+ prop +']'] = value;
      }
    });

    return query;
  },

  /**
    Meta date from request responses, computed from service meta

    @property [meta]
    @type Object
  */
  meta: computed(function () {
    let service = this.get('resourceName');
    return this.store[service].get('cache.meta.page');
  }).volatile(),

  /**
    Flag to indicate when there are more resources available with the current query

    @property [hasMore]
    @type Boolean
  */
  hasMore: computed('loadedIds', 'total', function () {
    let total = this.get('meta.total');
    let size = this.get('meta.size');
    if (Ember.isEmpty(total)) {
      return false;
    }
    let pages = Math.ceil(this.get('loadedIds').get('length') / size);

    return pages < total;
  }).volatile(),

  /**
    @method [initLoadedIds]
    @requires [loadedIds]
  */
  initLoadedIds: on('init', function () {
    this.set('loadedIds', Ember.ArrayProxy.create({content: Ember.A([])}));
  }),

  /**
    @property [loadedIds]
    @type Array
  */
  loadedIds: null,

  /**
    @method [resetLoadedIds]
  */
  resetLoadedIds() {
    this.set('loadedIds.content', Ember.A([]));
  },

  /**
    @method [resetLoadedIds]
  */
  resetPageNumber() {
    this.set('number', 1);
  },

  actions: {
    /**
      Refresh the route and filter resources by a search query

      @method [actions.search]
    */
    search() {
      Ember.run.throttle(this, this.refreshQuery, this.refreshQueryThrottleRate);
    },

    /**
      Action hook. Refreshes the route and sorts based on sort params.

      @method [actions.sorting]
    */
    sorting(field, direction) {
      this.setProperties({'sortField': field, '_sortDirection': direction});
      this.refreshQuery();
    },

    /**
      Refreshes the route filtering the list based on filter params

      @method [actions.filtering]
      @param {Object} [filters] as key, value pairs
    */
    filtering(filters) {
      this.set('filters', filters);
      this.refreshQuery();
    },

    /**
      Triggered by jsonapi-list-loader component, refreshes route

      @method [actions.more]
    */
    more() {
      this.isRefreshing = true;
      let path = this.get('routeParent');
      this.controllerFor(`${path}.list`).set('loadingMore', true);
      this.refresh();
    }
  },

  /**
    Refresh query, use throttled as search query changes

    @method [refreshQuery]
  */
  refreshQuery() {
    this.resetLoadedIds();
    this.resetPageNumber();
    this.refresh();
  },

  /**
    Milliseconds value as a refresh rate for query changes

    @property [refreshQueryThrottleRate]
    @type Number
  */
  refreshQueryThrottleRate: 500
});
