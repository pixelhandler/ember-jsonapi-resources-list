import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('jsonapi-list-heading', 'Integration | Component | jsonapi-list-heading', {
  integration: true
});

test('should render the sort direction', function(assert) {
  assert.expect(2);

  let actionsCalled = {};
  this.on('sorting', function() {actionsCalled.sorting = true;});

  this.render(hbs`
    {{#jsonapi-list-heading on-sort=(action "sorting") order="desc" field="name" activeHeader="name"}}
      Name {{/jsonapi-list-heading}}`);

  assert.ok(this.$('th').hasClass('active'));
  assert.ok(this.$('span').hasClass('desc'));
});

test('sort icons appear and you are able to click to sort', function(assert) {

  let actionsCalled = {};
  this.on('sorting', function() {actionsCalled.sorting = true;});

  this.render(hbs`
    {{#jsonapi-list-heading on-sort=(action "sorting") order="desc" field="name" activeHeader="name"}}
      Name {{/jsonapi-list-heading}}`);

  Ember.run(function() {
    this.$('span').trigger('click');
  }.bind(this));

  Ember.run(function() {
    assert.equal(actionsCalled.sorting, true, 'sort action called');
  });
});
