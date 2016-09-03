import Ember from 'ember';

const { underscore, capitalize } = Ember.String;

export function humanize(params/*, hash*/) {
  let text = params[0];
  text = underscore(text);
  text = capitalize(text);
  text = text.replace(/_/g, ' ');
  return text;
}

export default Ember.Helper.helper(humanize);
