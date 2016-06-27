/**
  @module components
  @submodule jsonapi-list-heading
**/
import Ember from 'ember';
import layout from '../templates/components/jsonapi-list-heading';

/**
  @class JsonapiListHeadingComponent
  @extends Ember.Component
*/
export default Ember.Component.extend({
  layout,

  tagName: 'th',

  activeHeader: '',

  field: '',

  order: '',

  classNameBindings: ['isActive:active'],

  isActive: Ember.computed('activeHeader', 'field', function() {
    return this.get('activeHeader') === this.get('field');
  }),

  isDescending: Ember.computed('order', function() {
    return this.get('order') === 'desc';
  }),

  actions: {

    doSort(){
      this.get('on-sort')(this.get('field'));
    }
  }
});
