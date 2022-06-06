class SvgSpriteGenerationState {
  constructor() {
    this.spriteIcons = {};
  }

  addSpriteIcon(icon) {
    this.spriteIcons[icon.symbolId] = icon;
  }

  getSpriteContent() {
    return `${Object.keys(this.spriteIcons).reduce(
      (result, iconId) =>
        `${result}<symbol viewBox="${this.spriteIcons[iconId].attributes.viewBox}" fill="none" id="${iconId}">${this.spriteIcons[iconId].content}</symbol>`,
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
    )}</svg>`;
  }
}

module.exports = new SvgSpriteGenerationState();
