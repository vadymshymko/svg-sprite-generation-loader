const loaderUtils = require('loader-utils');
const svgSpriteState = require('./utils/spriteState');

class SvgSpriteGeneratorPlugin {
  constructor(params) {
    this.params = params;
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    // webpack module instance can be accessed from the compiler object,
    // this ensures that correct version of the module is used
    // (do not require/import the webpack or any symbols from it directly).
    const { webpack } = compiler;

    // RawSource is one of the "sources" classes that should be used
    // to represent asset sources in compilation.
    const { RawSource } = webpack.sources;

    compiler.hooks.thisCompilation.tap(
      SvgSpriteGeneratorPlugin.name,
      (compilation) => {
        compilation.hooks.processAssets.tap(
          SvgSpriteGeneratorPlugin.name,
          () => {
            if (compilation.options.loader.target === 'web') {
              Object.keys(svgSpriteState.sprites).forEach((spriteFilePath) => {
                const spriteContent = svgSpriteState.getSpriteContent(
                  spriteFilePath,
                  this.params
                );

                const interpolatedPath = loaderUtils.interpolateName(
                  { resourcePath: spriteFilePath },
                  spriteFilePath,
                  {
                    context: compilation.options.context,
                    content: spriteContent,
                  }
                );

                compilation.emitAsset(
                  interpolatedPath,
                  new RawSource(spriteContent)
                );
              });
            }
          }
        );
      }
    );
  }
}

module.exports = SvgSpriteGeneratorPlugin;
