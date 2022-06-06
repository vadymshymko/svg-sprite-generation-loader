const { optimize } = require('svgo');

const svgSpriteState = require('./utils/spriteState');

class SvgSpriteGeneratorPlugin {
  static defaultOptions = {
    spriteFilePath: 'sprite.svg',
    svgo: {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeUselessDefs: false,
              removeViewBox: false,
              cleanupIDs: false,
            },
          },
        },
      ],
    },
  };

  constructor(options = {}) {
    this.options = { ...SvgSpriteGeneratorPlugin.defaultOptions, ...options };
  }

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
              compilation.emitAsset(
                `${this.options.spriteFilePath}`,
                new RawSource(
                  optimize(
                    svgSpriteState.getSpriteContent(),
                    this.options.svgo
                  ).data
                )
              );
            }
          }
        );
      }
    );
  }
}

module.exports = SvgSpriteGeneratorPlugin;
