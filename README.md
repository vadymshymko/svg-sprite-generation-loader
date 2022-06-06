# svg-sprite-generation-loader

[![npm version](https://img.shields.io/npm/v/svg-sprite-generation-loader)](https://www.npmjs.com/package/svg-sprite-generation-loader)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vadymshymko/svg-sprite-generation-loader/blob/master/LICENSE)

Webpack loader for generating external svg symbol sprite files

## How it works?

svg-sprite-generation-loader is a webpack-loader that takes a multiple svg files, transform them, optimizes and put them back in one file.

Input multiple svg files, e.g:

```html
<!-- file1.svg -->
<svg viewBox="0 0 10 10">
  <!-- file1.svg content -->
</svg>

<!-- file2.svg -->
<svg viewBox="0 0 10 30">
  <!-- file2.svg content -->
</svg>

<!-- file3.svg -->
<svg viewBox="0 0 15 40">
  <!-- file3.svg content -->
</svg>
```

Output one svg file (svg sprite):

```html
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol viewBox="0 0 10 10" id="file1">
    <!-- file1.svg content -->
  </symbol>

  <symbol viewBox="0 0 10 30" id="file2">
    <!-- file1.svg content -->
  </symbol>

  <symbol viewBox="0 0 15 40" id="file3">
    <!-- file3.svg content -->
  </symbol>
</svg>
```

You can refer to this file to display all your icons using [SVG stacking technique](https://css-tricks.com/svg-fragment-identifiers-work/#article-header-id-4)

## Installation:

```bash
npm install svg-sprite-generation-loader --save-dev
```

**yarn**

```bash
yarn add svg-sprite-generation-loader --dev
```

## Options

Plugin options:

| Name           | Type     | Default value                                                                              | Description                                                         |
| -------------- | -------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| spriteFilePath | `string` | `sprite.svg`                                                                               | Path to sprite file.<br /> `webpack.output.path` <br /> is included |
| svgo           | object   | default preset with disabled `removeUselessDefs`, `removeViewBox` and `cleanupIDs` plugins | [svgo](https://github.com/svg/svgo) config object                   |

Loader options:

| Name     | Type                 | Default value                                                                                | Description                          |
| -------- | -------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------ |
| symbolId | `function(iconPath)` | Icon filename (without extension). For example symbolId for `file1.svg` file will be `file1` | `<symbol>`&nbsp;`id` attribute value |

## Usage:

In your webpack config:

```javascript
const SvgSpriteGenerationPlugin = require("svg-sprite-generation-loader/plugin.js");

module.exports = {
  plugins: [
    new SvgSpriteGenerationPlugin.Plugin({
      spriteFilePath: "path/to/sprite/filename.svg",
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

```jsx
import iconData from "path/to/some/icon-file-name.svg";

<svg {...iconData.attributes}>
  <use href={`path/to/sprite/filename.svg#${iconData.symbolId}`} />
</svg>;
```
