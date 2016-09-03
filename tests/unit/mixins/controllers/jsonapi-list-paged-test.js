import Ember from 'ember';
import ControllersJsonapiListPagedMixin from 'ember-jsonapi-resources-list/mixins/controllers/jsonapi-list-paged';
import { module, test } from 'qunit';

module('Unit | Mixin | controllers/jsonapi-list');

// Replace this with your real tests.
test('it works', function(assert) {
  let ControllersJsonapiListPagedObject = Ember.Object.extend(ControllersJsonapiListPagedMixin);
  let subject = ControllersJsonapiListPagedObject.create();
  assert.ok(subject);
});
