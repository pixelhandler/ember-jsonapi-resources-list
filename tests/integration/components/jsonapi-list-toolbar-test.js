import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger, nativeMouseDown, nativeMouseUp } from 'dummy/tests/helpers/ember-power-select';

moduleForComponent('jsonapi-list-toolbar', 'Integration | Component | jsonapi list toolbar', {
  integration: true
});

let podFilters = Ember.String.w('All Brand iPhone iPad Music Mac Watch');
let statusFilters = Ember.String.w('All Active Killed Completed');
let filters = [
  {
    name: 'status',
    options: statusFilters,
    selected: statusFilters[0]
  },
  {
    name: 'pod',
    options: podFilters,
    selected: podFilters[0]
  }
];

let sortFilters = Ember.String.w('Name Channel Updated-at Created-at');
let sorters = {
  options: sortFilters,
  selected: sortFilters[0]
};


test('renders list of filters', function(assert) {
  this.set('filters', filters);

  this.render(hbs`
    {{tool-bar
      filters=filters
    }}
  `);

  assert.equal(this.$('.ToolBar .ToolBar-title:eq(0)').text().trim(), 'Filters');
  assert.equal(this.$('.ToolBar label.ToolBar-label:eq(0)').text().trim(), 'Status');
  assert.equal(this.$('.ToolBar label.ToolBar-label:eq(1)').text().trim(), 'Pod');
  assert.equal(this.$('.ToolBar .ToolBar-control:eq(0) div[role="button"]').length, 2);
});

test('selecting a filter sends an action', function(assert) {
  let done = assert.async();
  this.set('filters', filters);
  this.set('filter', function(name, selected) {
    actionsCalled.push({ name: 'filter', args: { name: name, selected: selected } });
  });
  let actionsCalled = [];

  this.render(hbs`
    {{tool-bar
      filters=filters
      filterAction=(action filter)
    }}
  `);

  Ember.run(function() {
    let scope = '.ToolBar .ToolBar-control:eq(0)';
    clickTrigger(scope);
  }.bind(this));

  Ember.run(function() {
    let selector = '.ember-basic-dropdown-content .ember-power-select-options .ember-power-select-option:eq(2)';
    let option = this.$().parent().find(selector)[0];
    nativeMouseDown(option);
    nativeMouseUp(option);
  }.bind(this));

  Ember.run.later(function() {
    let actionCalled = Ember.A(actionsCalled).findBy('name', 'filter');
    assert.equal(actionCalled.name, 'filter', 'filter action called');
    assert.equal(actionCalled.args.name, 'status', 'status filter changed');
    assert.equal(actionCalled.args.selected, 'Killed', 'status selected is Killed');
    done();
  }.bind(this), 30);
});

test('submiting a search query sends and action', function(assert) {
  let done = assert.async();
  let actionsCalled = [];

  this.set('searchQuery', '');
  this.set('search', function(query) {
    actionsCalled.push({ name: 'search', args: { query: query } });
  });

  this.render(hbs`
    {{tool-bar
      searchQuery=searchQuery
      searchAction=(action search)
    }}
  `);

  let scope = '.ToolBar .ToolBar-control:eq(2)';

  Ember.run(function() {
    let inputEl = this.$(scope + ' .ToolBar-input .ToolBar-search');
    inputEl.val('demo');
    inputEl.trigger('change');
  }.bind(this));

  Ember.run(function() {
    let btn = this.$(scope + ' .ToolBar-icon');
    btn.trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    let actionCalled = Ember.A(actionsCalled).findBy('name', 'search');
    assert.equal(actionCalled.name, 'search', 'search action called');
    assert.equal(actionCalled.args.query, 'demo', 'query sent with action');
    done();
  }.bind(this), 30);
});

test('selecting a sort value sends an action', function(assert) {
  let done = assert.async();
  let actionsCalled = [];
  this.set('sortBy', sorters);
  this.set('sort', function (field) {
    actionsCalled.push({ name: 'sort', args: { selected: field } });
  });

  this.render(hbs`
    {{tool-bar
      sortBy=sortBy
      sortAction=(action sort)
    }}
  `);

  Ember.run(function() {
    let scope = '.ToolBar .ToolBar-control:eq(1)';
    clickTrigger(scope);
  }.bind(this));

  Ember.run(function() {
    let selector = '.ember-basic-dropdown-content .ember-power-select-options .ember-power-select-option:eq(1)';
    let option = this.$().parent().find(selector)[0];
    nativeMouseDown(option);
    nativeMouseUp(option);
  }.bind(this));

  Ember.run.later(function() {
    let actionCalled = Ember.A(actionsCalled).findBy('name', 'sort');
    assert.equal(actionCalled.name, 'sort', 'sort action called');
    assert.equal(actionCalled.args.selected, 'Channel', 'sort selected is Channel');
    done();
  }.bind(this), 30);
});
