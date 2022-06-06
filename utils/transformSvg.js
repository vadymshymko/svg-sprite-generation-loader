function transformSvg(source) {
  const [, parsedAttributes, parsedContent] = source.match(
    /<svg(.{0,})>([\s\S]+)<\/svg>/i
  );

  const attributes = parsedAttributes
    .match(/([\w-:]+)(=)?("[^<>"]*"|'[^<>']*'|[\w-:]+)/g)
    .reduce((result, attribute) => {
      const [name, unformattedValue] = attribute.split('=');

      // eslint-disable-next-line no-param-reassign
      result[name] = unformattedValue
        ? unformattedValue.replace(/['"]/g, '')
        : true;

      return result;
    }, {});

  return {
    attributes,
    content: parsedContent.replace(/\n/g, ' ').trim(),
  };
}

module.exports = transformSvg;
