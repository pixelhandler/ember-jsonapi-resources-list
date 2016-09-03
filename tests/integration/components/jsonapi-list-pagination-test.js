import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { clickTrigger, nativeMouseDown, nativeMouseUp } from 'dummy/tests/helpers/ember-power-select';

moduleForComponent('jsonapi-list-pagination', 'Integration | Component | jsonapi list pagination', {
  integration: true
});

test('renders pagination controls in toolbar', function(assert) {
  this.render(hbs`
    {{pagination-toolbar
      pageNumber=1
      pageTotal=10
      pageSize=25
      recordCount=100
    }}
  `);

  assert.equal(this.$('.ToolBar .ToolBar-control:eq(0) .ToolBar-label').text().trim(), 'Per Page');
  assert.equal(this.$('.ToolBar .ToolBar-control:eq(0) div[role="button"]').length, 1);

  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) .ToolBar-label').text().trim(), 'Page');
  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn').length, 3);
});

test('when only one page is available, no paging buttons are present', function(assert) {
  this.render(hbs`
    {{pagination-toolbar
      pageNumber=1
      pageTotal=1
      pageSize=25
      recordCount=24
    }}
  `);

  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn').length, 0);
});

test('when two pages are available, one active button is present', function(assert) {
  this.render(hbs`
    {{pagination-toolbar
      pageNumber=1
      pageTotal=2
      pageSize=25
      recordCount=49
    }}
  `);

  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn').length, 2);
  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn').not('button[disabled]').length, 1);
});

test('when three pages are available, two active buttons are present', function(assert) {
  this.render(hbs`
    {{pagination-toolbar
      pageNumber=1
      pageTotal=3
      pageSize=25
      recordCount=74
    }}
  `);

  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn').length, 3);
  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn').not('button[disabled]').length, 2);
});

test('when two pages are available and on page 1, the first button is disabled', function(assert) {
  this.render(hbs`
    {{pagination-toolbar
      pageNumber=1
      pageTotal=2
      pageSize=25
      recordCount=49
    }}
  `);

  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn:eq(0)').attr('disabled'), 'disabled');
});

test('when three pages are available and on page 1, the first button is disabled', function(assert) {
  this.render(hbs`
    {{pagination-toolbar
      pageNumber=1
      pageTotal=3
      pageSize=25
      recordCount=74
    }}
  `);

  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn:eq(0)').attr('disabled'), 'disabled');
});

test('when two pages are available and on page 2, the last button is disabled', function(assert) {
  this.render(hbs`
    {{pagination-toolbar
      pageNumber=2
      pageTotal=2
      pageSize=25
      recordCount=49
    }}
  `);

  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn:eq(1)').attr('disabled'), 'disabled');
});

test('when three pages are available and on page 3, the last button is disabled', function(assert) {
  this.render(hbs`
    {{pagination-toolbar
      pageNumber=3
      pageTotal=3
      pageSize=25
      recordCount=74
    }}
  `);

  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn:eq(2)').attr('disabled'), 'disabled');
});

test('when four pages are available on page 2, three active buttons are present', function(assert) {
  this.render(hbs`
    {{pagination-toolbar
      pageNumber=2
      pageTotal=4
      pageSize=25
      recordCount=99
    }}
  `);

  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn').length, 4);
  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn').not('button[disabled]').length, 3);
});

test('when five pages are available on page 2, three active buttons are present', function(assert) {
  this.render(hbs`
    {{pagination-toolbar
      pageNumber=2
      pageTotal=5
      pageSize=25
      recordCount=124
    }}
  `);

  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn').length, 4);
  assert.equal(this.$('.ToolBar .ToolBar-control:eq(1) button.Btn').not('button[disabled]').length, 3);
});

test('changing the page size sends resetPageSize action', function(assert) {
  let done = assert.async();
  this.set('resetPageSize', function(size) {
    actionsCalled.push({ name: 'resetPageSize', args: { size: size } });
  });
  let actionsCalled = [];

  this.render(hbs`
    {{pagination-toolbar
      on-page-size-change=(action resetPageSize)
    }}
  `);

  Ember.run(function() {
    let scope = '.ToolBar .ToolBar-control:eq(0)';
    clickTrigger(scope);
  }.bind(this));

  Ember.run(function() {
    let selector = '.ember-basic-dropdown-content .ember-power-select-options .ember-power-select-option:eq(3)';
    let option = this.$().parent().find(selector)[0];
    nativeMouseDown(option);
    nativeMouseUp(option);
  }.bind(this));

  Ember.run.later(function() {
    let actionCalled = Ember.A(actionsCalled).findBy('name', 'resetPageSize');
    assert.equal(actionCalled.name, 'resetPageSize', 'resetPageSize action called');
    assert.equal(actionCalled.args.size, 100, 'per page size value sent with action');
    done();
  }.bind(this), 30);
});

test('can send action for first page', function(assert) {
  let done = assert.async();
  let actionsCalled = [];

  this.set('first', function() {
    actionsCalled.push({ name: 'first', args: {} });
  });

  this.render(hbs`
    {{pagination-toolbar
      pageNumber=3
      pageTotal=5
      pageSize=25
      recordCount=124
      on-first=(action first)
    }}
  `);

  let scope = '.ToolBar .ToolBar-control:eq(1)';

  Ember.run(function() {
    let btn = this.$(scope + ' .Btn').first();
    btn.trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    let actionCalled = Ember.A(actionsCalled).findBy('name', 'first');
    assert.equal(actionCalled.name, 'first', 'first action called');
    done();
  }.bind(this), 30);
});

test('can send action for last page', function(assert) {
  let done = assert.async();
  let actionsCalled = [];

  this.set('last', function() {
    actionsCalled.push({ name: 'last', args: {} });
  });

  this.render(hbs`
    {{pagination-toolbar
      pageNumber=3
      pageTotal=5
      pageSize=25
      recordCount=124
      on-last=(action last)
    }}
  `);

  let scope = '.ToolBar .ToolBar-control:eq(1)';

  Ember.run(function() {
    let btn = this.$(scope + ' .Btn').last();
    btn.trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    let actionCalled = Ember.A(actionsCalled).findBy('name', 'last');
    assert.equal(actionCalled.name, 'last', 'last action called');
    done();
  }.bind(this), 30);
});

test('can send action for previous page', function(assert) {
  let done = assert.async();
  let actionsCalled = [];

  this.set('previous', function() {
    actionsCalled.push({ name: 'previous', args: {} });
  });

  this.render(hbs`
    {{pagination-toolbar
      pageNumber=3
      pageTotal=5
      pageSize=25
      recordCount=124
      on-previous=(action previous)
    }}
  `);

  let scope = '.ToolBar .ToolBar-control:eq(1)';

  Ember.run(function() {
    let btn = this.$(scope + ' .Btn:eq(1)');
    btn.trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    let actionCalled = Ember.A(actionsCalled).findBy('name', 'previous');
    assert.equal(actionCalled.name, 'previous', 'previous action called');
    done();
  }.bind(this), 30);
});

test('can send action for next page', function(assert) {
  let done = assert.async();
  let actionsCalled = [];

  this.set('next', function() {
    actionsCalled.push({ name: 'next', args: {} });
  });

  this.render(hbs`
    {{pagination-toolbar
      pageNumber=3
      pageTotal=5
      pageSize=25
      recordCount=124
      on-next=(action next)
    }}
  `);

  let scope = '.ToolBar .ToolBar-control:eq(1)';

  Ember.run(function() {
    let btn = this.$(scope + ' .Btn:eq(3)');
    btn.trigger('click');
  }.bind(this));

  Ember.run.later(function() {
    let actionCalled = Ember.A(actionsCalled).findBy('name', 'next');
    assert.equal(actionCalled.name, 'next', 'next action called');
    done();
  }.bind(this), 30);
});
