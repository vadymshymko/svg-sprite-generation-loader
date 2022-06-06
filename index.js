const loaderUtils = require('loader-utils');

const svgSpriteState = require('./utils/spriteState');
const transformSvg = require('./utils/transformSvg');

function svgSpriteGenerationLoader(source) {
  const options = {
    symbolId: '[name]',
    ...this.getOptions(),
  };

  const { attributes: parsedAttributes, content } = transformSvg(source);

  const symbolId = loaderUtils.interpolateName(
    this,
    typeof options.symbolId === 'string'
      ? options.symbolId
      : options.symbolId(this.resourcePath)
  );

  const attributes = options.attributes
    ? options.attributes.reduce((result, attrName) => {
        // eslint-disable-next-line no-param-reassign
        result[attrName] = parsedAttributes[attrName];
        return result;
      }, {})
    : parsedAttributes;

  if (this.target === 'web') {
    svgSpriteState.addSpriteIcon({ symbolId, attributes, content });
  }

  return `
    export default ${JSON.stringify({ symbolId, attributes })}
  `;
}

module.exports = svgSpriteGenerationLoader;
