import Ember from 'ember';
import RoutesJsonapiListPagedMixin from 'ember-jsonapi-resources-list/mixins/routes/jsonapi-list-paged';
import { module, test } from 'qunit';

module('Unit | Mixin | routes/jsonapi-list');

// Replace this with your real tests.
test('it works', function(assert) {
  let RoutesJsonapiListPagedObject = Ember.Object.extend(RoutesJsonapiListPagedMixin);
  let subject = RoutesJsonapiListPagedObject.create();
  assert.ok(subject);
});
