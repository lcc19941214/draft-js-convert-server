var React = require('react');
var ReactDOMServer = require('react-dom');
var _convertFromHTML = require('draft-convert').convertFromHTML;
var { ContentState, convertFromRaw, convertToRaw, convertFromHTML } = require('draft-js');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM();
document = dom.window.document;
HTMLElement = require('jsdom/lib/jsdom/living/nodes/HTMLBodyElement-impl').implementation;
HTMLAnchorElement = require('jsdom/lib/jsdom/living/nodes/HTMLAnchorElement-impl')
  .implementation;

function convert(html) {
  var contentState = convertFromHTML(html);

  var rawDraftContentState = ContentState.createFromBlockArray(
    contentState.contentBlocks,
    contentState.entityMap
  );

  var r = convertToRaw(rawDraftContentState);

  return contentState;
}

const convertConfig = {
  textToEntity: (text, createEntity) => {
    const result = [];
    text.replace(/\$\{[^\$\{\}]+?\}/g, (match, name, offset) => {
      const entityKey = createEntity('labelBlock', 'IMMUTABLE', { label: 123 });
      result.push({
        entity: entityKey,
        offset,
        length: match.length,
        result: match
      });
    });
    return result;
  }
};

function _convert(html) {
  var contentState = _convertFromHTML(convertConfig)(html);
  var r = convertToRaw(contentState);
  return r;
}

// module.exports = convert;
module.exports = _convert;
