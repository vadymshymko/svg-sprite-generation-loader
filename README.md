# svg-sprite-generation-loader

[![npm version](https://img.shields.io/npm/v/svg-sprite-generation-loader)](https://www.npmjs.com/package/svg-sprite-generation-loader)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vadymshymko/svg-sprite-generation-loader/blob/master/LICENSE)

Webpack plugin and loader for generating svg sprites

## Installation:

```bash
npm install svg-sprite-generation-loader --save-dev
```

**yarn**

```bash
yarn add svg-sprite-generation-loader --dev
```

## Usage:

In your webpack config:

```javascript
const SvgSpriteGenerationPlugin = require("svg-sprite-generation-loader/plugin.js");

module.exports = {
  plugins: [
    new SvgSpriteGenerationPlugin.Plugin({
      spriteFilePath: `path/to/sprite/file.svg`,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: "svg-sprite-generation-loader",
      },
    ],
  },
};
```

In some source code:

```javascript
import someIcon from 'path/to/iconFileName.svg'

export default function SomeIcon() {
  return (
    <svg {...someIcon}>
      <use href="path/to/sprite/file.svg#iconFileName">
    </svg>
  );
}
```
