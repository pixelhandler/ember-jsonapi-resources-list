import Ember from 'ember';
import RoutesJsonapiListMixin from 'ember-jsonapi-resources-list/mixins/routes/jsonapi-list';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/jsonapi-list');

test('it works like a mixin', function(assert) {
  let RoutesJsonapiListObject = Ember.Object.extend(RoutesJsonapiListMixin);
  let subject = RoutesJsonapiListObject.create();
  assert.ok(subject);
});
