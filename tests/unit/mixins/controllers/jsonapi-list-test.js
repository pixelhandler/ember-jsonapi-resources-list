import Ember from 'ember';
import ControllersJsonapiListMixin from 'ember-jsonapi-resources-list/mixins/controllers/jsonapi-list';
import { module, test } from 'qunit';

module('Unit | Mixin | controllers/jsonapi-list');

test('it works like a mixin', function(assert) {
  let ControllersJsonapiListObject = Ember.Object.extend(ControllersJsonapiListMixin);
  let subject = ControllersJsonapiListObject.create();
  assert.ok(subject);
});
