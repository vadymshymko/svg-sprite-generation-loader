const loaderUtils = require('loader-utils');
const { optimize } = require('svgo');

const svgSpriteState = require('./utils/spriteState');
const transformSvg = require('./utils/transformSvg');

function svgSpriteGenerationLoader(source) {
  const options = {
    symbolId: '[name]',
    spriteFilePath: 'sprite.svg',
    svgoOptimize: true,
    addContent: false,
    ...this.getOptions(),
  };

  const isSvgoOptimizeEnabled = !!options.svgoOptimize;
  const svgoOptimizeConfig =
    options.svgoOptimize === true
      ? {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
            'removeXMLNS',
          ],
        }
      : options.svgoOptimize;

  const iconSource = isSvgoOptimizeEnabled
    ? optimize(source, svgoOptimizeConfig).data
    : source;

  const { attributes, content } = transformSvg(iconSource);

  const symbolId = loaderUtils.interpolateName(
    this,
    typeof options.symbolId === 'string'
      ? options.symbolId
      : options.symbolId(this.resourcePath)
  );

  if (this.target === 'web') {
    svgSpriteState.addSpriteIcon(
      { symbolId, attributes, content },
      options.spriteFilePath
    );
  }

  return `
    export default ${JSON.stringify({
      symbolId,
      attributes,
      ...(options.addContent ? { content } : {}),
    })}
  `;
}

module.exports = svgSpriteGenerationLoader;
