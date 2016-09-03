import { humanize } from 'dummy/helpers/humanize';
import { module, test } from 'qunit';

module('Unit | Helper | humanize');

test('capitalizes and adds spaces if needed', function(assert) {
  assert.equal(humanize(['first-name']), 'First name');
  assert.equal(humanize(['first_name']), 'First name');
  assert.equal(humanize(['first name']), 'First name');
  assert.equal(humanize(['firstName']), 'First name');
  assert.equal(humanize(['FirstName']), 'First name');
});
