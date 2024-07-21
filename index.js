const loaderUtils = require('loader-utils');
const { optimize } = require('svgo');
const { validate } = require('schema-utils');

const svgSpriteState = require('./utils/spriteState');
const transformSvg = require('./utils/transformSvg');

const optionsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'SvgSpriteGeneratorPlugin Options',
  type: 'object',
  properties: {
    symbolId: {
      description:
        'Sprite item (single icon) `<symbol>` id attribute value. Can be a string or a function that takes the file path of the original icon and returns a string.',
      oneOf: [
        {
          type: 'string',
          description:
            "String value for symbol id, e.g. '[name]' which defaults to the icon filename without extension.",
        },
        {
          instanceof: 'Function',
          description:
            'Function that takes the file path of the original icon and returns a string.',
        },
      ],
    },
    spriteFilePath: {
      type: 'string',
      description:
        'Path to sprite file. This path is relative to `webpack.output.path` and can include [interpolateName](https://github.com/webpack/loader-utils#interpolatename) patterns.',
    },
    svgoOptimize: {
      description: 'Enable or disable SVG optimization',
      oneOf: [
        {
          type: 'boolean',
          description:
            'Enable or disable SVG optimization with default settings.',
        },
        {
          type: 'object',
          description: 'Customize SVG optimization using svgo options.',
          properties: {
            plugins: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name of the svgo plugin',
                  },
                  params: {
                    type: 'object',
                    description: 'Parameters for the svgo plugin',
                  },
                },
                required: ['name'],
              },
            },
          },
        },
      ],
    },
    addContent: {
      type: 'boolean',
      description:
        'Add SVG content as property to transformed SVG object, which may increase bundle size.',
    },
  },
  required: [],
  additionalProperties: false,
};

function svgSpriteGenerationLoader(source) {
  const options = {
    symbolId: '[name]',
    spriteFilePath: 'sprite.svg',
    svgoOptimize: true,
    addContent: false,
    ...this.getOptions(),
  };

  validate(optionsSchema, options, {
    name: 'svgSpriteGenerationLoader',
    baseDataPath: 'options',
  });

  this.cacheable(false);

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
