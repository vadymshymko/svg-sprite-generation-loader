class SvgSpriteGenerationState {
  constructor() {
    this.sprites = {};
  }

  addSpriteIcon(icon, spriteFilePath) {
    this.sprites[spriteFilePath] = this.sprites[spriteFilePath] || {};
    this.sprites[spriteFilePath][icon.symbolId] = icon;
  }

  getSpriteContent(spriteFilePath) {
    return `${Object.keys(this.sprites[spriteFilePath]).reduce(
      (result, iconId) =>
        `${result}<symbol viewBox="${this.sprites[spriteFilePath][iconId].attributes.viewBox}" fill="none" id="${iconId}">${this.sprites[spriteFilePath][iconId].content}</symbol>`,
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
    )}</svg>`;
  }
}

module.exports = new SvgSpriteGenerationState();
