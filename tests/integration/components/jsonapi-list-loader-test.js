import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('jsonapi-list-loader', 'Integration | Component | jsonapi-list-loader', {
  integration: true
});

test('it renders jsonapi-list-loader element', function(assert) {
  assert.expect(1);

  this.render(hbs`{{jsonapi-list-loader}}`);

  assert.equal(this.$('jsonapi-list-loader').text().trim(), '');
});

test('when hasMore is `false` it does NOT include a button', function(assert) {
  assert.expect(1);

  this.set('moreStuff', false);
  this.render(hbs`{{jsonapi-list-loader hasMore=moreStuff}}`);

  assert.equal(this.$('jsonapi-list-loader button').length, 0);
});

test('when hasMore is `true` it does include a button with text "Show More"', function(assert) {
  assert.expect(2);

  this.set('moreStuff', true);
  this.render(hbs`{{jsonapi-list-loader hasMore=moreStuff}}`);

  let btn = this.$('jsonapi-list-loader button');
  assert.equal(btn.length, 1);
  assert.equal(btn.text().trim(), 'Show More…');
});

test('clicking button sends showMore action', function(assert) {
  assert.expect(1);

  let actionSent = false;

  this.set('moreStuff', true);
  this.on('showMore', function() {
    actionSent = true;
  });

  this.render(hbs`{{jsonapi-list-loader hasMore=moreStuff action="showMore"}}`);
  this.$('jsonapi-list-loader button').trigger('click');

  assert.ok(actionSent);
});

test('when hasMore and and loadingMore are both `true` it does include a button with text "Loading…"', function(assert) {
  assert.expect(2);

  this.set('moreStuff', true);
  this.set('busy', true);
  this.render(hbs`{{jsonapi-list-loader hasMore=moreStuff loadingMore=busy}}`);

  let btn = this.$('jsonapi-list-loader button');
  assert.equal(btn.length, 1);
  assert.equal(btn.text().trim(), 'Loading…');
});
