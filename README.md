# Ember JSONAPI Resources List Addon

Ember Addon that provides mixins for use with controllers and routes that need
to display a list of resources that follow the JSON API 1.0 specification.

- Use with the [ember-jsonapi-resources] addon

[ember-jsonapi-resources]: http://ember-jsonapi-resources.com


## Example Use

In the router a list route is defined at the path '/' under the 'products' route.

```js
Router.map(function() {
  this.route('products', { path: '/' }, function () {
    this.route('list', { path: '/' });
  });
});
```

*List Route:*

```js
import Ember from 'ember';
import ListRouteMixin from 'ember-jsonapi-resources-list/mixins/routes/jsonapi-list';

export default Ember.Route.extend(ListRouteMixin, {
  /**
    The name of the model type, used with store service

    @property resourceName
    @type String
    @required
  */
  resourceName: 'products',

  /**
    The parent or route name

    @property routeParent
    @type String
    @required
  */
  routeParent: 'products'
});
```

*List Controller*

Use query params on the products list page which represent the request parameters
used with the API server.

This example includes a filter for a `facet`. Perhaps the actual implementation
will use `color` or `size`, or both (facets).

```js
import Ember from 'ember';
import ListControllerMixin from 'ember-jsonapi-resources-list/mixins/controllers/jsonapi-list';
import facetTransform from '../transforms/facet';

export default Ember.Controller.extend(ListControllerMixin, {
  queryParams: [
    { searchQuery: 'search' },
    { sortParamName: 'sort' },
    { sortingDirection: 'order'},
    { facetParam: 'facet' }
  ],

  /**
    Value use with `filter[facet]` param in API requests

    @property facetParam
    @type String
  */
  facetParam: '',

  /**
    @property facetFilter
    @type String
  */
  facetFilter: Ember.computed('facets', 'facetParam', {
    get() {
      if (!this.get('facetParam')) {
        this.set('facetParam', this.get('facets')[0]);
      }
      return this.get('facetParam');
    },
    set(key, value) {
      return this.set('facetParam', value);
    },
  }),

  /**
    @property facets
    @type {Array}
  */
  facets: Ember.computed(function() {
    let facets = facetTransform.values.map(function(i){ return i; });
    facets.unshift('All'); // Allow "All" as an option
    return facets;
  }),

  actions: {
    /**
      Set the filtering params to pass into the route and display into the URL

      @method filtering
      @param {String} key
      @param {String} value
    */
    filtering(key, value) {
      if (key === 'facet') {
        this.set('facetFilter', value);
      }
      this.get('target').send('filtering', {
        facet: this.get('facetParam')
      });
    }
  }
});
```

*List Template*

```hbs
{{input value=searchQuery placeholder="Search…" enter="search" class="search"}}

<div class="resource-filters row">
  <section class="one column">
    <p class="resource-filters-title">Filters</p>
  </section>
  <section class="resource-filters-item eleven columns icons">
    <em>Facet</em>
    {{#each facets as |filter|}}
      {{#selectable-button value=filter selectedValue=facetFilter action="filtering" attrName="facet"}}
        {{filter}}
      {{/selectable-button}}
    {{/each}}
  </section>
</div>

<table class="Product-list resource-list u-full-width">
  <thead>
    <tr class="u-small-text u-short-header">
      {{#jsonapi-list-heading
        on-sort=(action "sorting") field="facet"
        order=sortingDirection
        activeHeader=sortParamName}}Facet{{/jsonapi-list-heading}}
      {{#jsonapi-list-heading
        on-sort=(action "sorting") field="name"
        order=sortingDirection
        activeHeader=sortParamName}}Product{{/jsonapi-list-heading}}
      {{#jsonapi-list-heading
        on-sort=(action "sorting") field="updated-at"
        order=sortingDirection
        activeHeader=sortParamName}}Updated{{/jsonapi-list-heading}}
    </tr>
  </thead>
  <tbody>
    {{#each model key="id" as |resource|}}
      <tr {{action "detail" resource}}>
        <td>{{icon-for value=resource.facet}}</td>
        <td>{{resource.display-name}}</td>
        <td>{{moment-format resource.updated-at "ll"}}</td>
      </tr>
    {{/each}}
  </tbody>
  <tfoot>
    <tr>
      <td colspan="4" class="u-align-center">
        {{jsonapi-list-loader hasMore=hasMore loadingMore=loadingMore action="more"}}
      </td>
    </tr>
  </tfoot>
</table>

{{outlet}}
```

## Installation

In the consuming application…

    ember install ember-jsonapi-resources-list

## Development

Install dependencies…

* `git clone` this repository
* `npm install`
* `bower install`

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
