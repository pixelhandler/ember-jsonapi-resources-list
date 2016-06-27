import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

export default function startApp(attrs) {
  let application;
  // See http://emberjs.com/deprecations/v2.x/#toc_ember-merge
  let assign = (typeof Ember.assign === 'function') ? Ember.assign : Ember.merge;
  let attributes = assign({}, config.APP);
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  Ember.run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
