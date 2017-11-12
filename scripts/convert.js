var React = require('react');
var ReactDOMServer = require('react-dom');
var convertFromHTML = require('draft-convert').convertFromHTML;
var { ContentState, convertFromRaw, convertToRaw } = require('draft-js');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const CONVERT_DATA = require('../data/convert.json');
const FIELD_DATA = require('../data/fields.json');
const FIELD_PTN = /\$\{[^\$\{\}]+?\}/g;

const dom = new JSDOM();
document = dom.window.document;
HTMLElement = require('jsdom/lib/jsdom/living/nodes/HTMLBodyElement-impl').implementation;
HTMLAnchorElement = require('jsdom/lib/jsdom/living/nodes/HTMLAnchorElement-impl')
  .implementation;

function matchField(text) {
  return text.replace(FIELD_PTN, (match, name, offset) => {
    const oldField = match.slice(2, -1);
    if (CONVERT_DATA[oldField]) return CONVERT_DATA[oldField];
    return match;
  });
}

const convertConfig = {
  textToEntity: (text, createEntity) => {
    const result = [];
    text.replace(FIELD_PTN, (match, name, offset) => {
      const newField = match.slice(2, -1);
      if (FIELD_DATA[newField]) {
        const { locale_key: localeKey } = FIELD_DATA[newField];
        const entityKey = createEntity('labelBlock', 'IMMUTABLE', {
          label: localeKey,
          localeKey,
          field: match,
          highlight: false
        });
        result.push({
          entity: entityKey,
          offset,
          length: match.length,
          result: match
        });
      }
    });
    return result;
  }
};

function convertState(content) {
  const _content = matchField(content);
  const contentState = convertFromHTML(convertConfig)(_content);
  const r = convertToRaw(contentState);
  return r;
}

function convertHTML(content) {
  return matchField(content);
}

module.exports = {
  convertState,
  convertHTML
};
