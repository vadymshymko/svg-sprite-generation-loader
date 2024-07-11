# svg-sprite-generation-loader

[![npm version](https://img.shields.io/npm/v/svg-sprite-generation-loader)](https://www.npmjs.com/package/svg-sprite-generation-loader)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/vadymshymko/svg-sprite-generation-loader/blob/master/LICENSE)

Webpack loader for generating external svg symbol sprite files

## Table of contents

- [How it works?](#how-it-works)
- [Installation](#installation)
- [Usage](#usage)
- [Options](#options)

## How it works?

svg-sprite-generation-loader is a webpack-loader that takes a multiple svg files, optimize them (using [svgo.optimize](https://github.com/svg/svgo#optimize)), transform (parse and return as an object with `symbolId`, `attributes` and `content` (disabled by default) keys) and put them back in one file.

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

## Usage:

In your webpack config:

```javascript
const SvgSpriteGenerationPlugin = require('svg-sprite-generation-loader/plugin.js');

module.exports = {
  plugins: [new SvgSpriteGenerationPlugin()],
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: 'svg-sprite-generation-loader',
      },
    ],
  },
};
```

In some source code:

```jsx
import iconData from 'path/to/some/icon-file-name.svg';

// by default iconData will include symbolId and attributes keys.
// If you enable the addContent loader option, the `content` key will also be added

<svg {...iconData.attributes}>
  <use href={`path/to/sprite/filename.svg#${iconData.symbolId}`} />
</svg>;
```

## Options

| Name           | Type                             | Default value | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------- | -------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbolId       | `string`&nbsp;\|&nbsp;`function` | `"[name]"`    | Sprite item (single icon) `<symbol>`&nbsp;`id` attribute value.<br />`string` or `function` that takes the file path of the original icon as an argument and returns `string`.<br /><br />You can use [interpolateName](https://github.com/webpack/loader-utils#interpolatename) patterns.<br /> Default value (`"[name]"`) is equal to icon filename (without extension). For example, by default symbolId for `file1.svg` file will be `file1`                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| spriteFilePath | `string`                         | `sprite.svg`  | Path to sprite file.<br /> `webpack.output.path` is included. You can use [interpolateName](https://github.com/webpack/loader-utils#interpolatename) patterns.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| svgoOptimize   | `boolean` \| `object`            | `true`        | Enable/Disable/Customize source svg file optimization with [svgo.optimize](https://github.com/svg/svgo#optimize). The following options are used by default: <br /><pre>`{`<br />&nbsp;&nbsp;`plugins: [`<br />&nbsp;&nbsp;&nbsp;&nbsp;`{`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`name: 'preset-default',`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`params: {`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`overrides: {`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`removeViewBox: false,`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`},`<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`},`<br />&nbsp;&nbsp;&nbsp;&nbsp;`},`<br />&nbsp;&nbsp;&nbsp;&nbsp;`'removeXMLNS',`<br />&nbsp;&nbsp;`],`<br />`}`</pre> You can disable it completely (by passing `false`) or use your own configuration (see [svgo docs](https://github.com/svg/svgo#optimize)) |
| **addContent** | `boolean`                        | `false`       | Add svg content as property to transformed svg object (may increase bundle size when enabled)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
