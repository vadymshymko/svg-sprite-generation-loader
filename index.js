const path = require("path");

const svgSpriteState = require("./utils/spriteState.js");
const parseSvg = require("./utils/parseSvg.js");

module.exports = function (source) {
  const { attributes, content } = parseSvg(source);

  const options = this.getOptions();
  const symbolId = options.symbolId
    ? options.symbolId(this.resourcePath)
    : path.basename(this.resourcePath, ".svg");

  if (this.target === "web") {
    svgSpriteState.addSpriteIcon({ symbolId, attributes, content });
  }

  return `
    export default ${JSON.stringify({ symbolId, attributes })}
  `;
};
