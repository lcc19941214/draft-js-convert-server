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
  return text.replace(FIELD_PTN, (match, offset, name) => {
    const oldField = match.slice(2, -1);
    if (CONVERT_DATA[oldField]) return CONVERT_DATA[oldField];
    return match;
  });
}

const convertConfig = {
  textToEntity: (text, createEntity) => {
    const result = [];
    text.replace(FIELD_PTN, (match, offset, group) => {
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
  let _content = matchField(content);
  _content = _content.replace(/\n/g, '<br>');
  const contentState = convertFromHTML(convertConfig)(_content);
  const r = convertToRaw(contentState);
  return r;
}

function convertHTML(content) {
  const html = matchField(content);
  return `<div style="color: #3b3e44; font-size: 14px; line-height: 1.8">${html}</div>`;
}

module.exports = {
  convertState,
  convertHTML
};
