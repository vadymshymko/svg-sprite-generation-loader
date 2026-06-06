function transformSvg(source) {
  const [, parsedAttributes, content] = source.match(/<svg(.*?)>(.*?)<\/svg>/i);

  const attributes = parsedAttributes
    .match(/([\w-:]+)(=)?("[^<>"]*"|'[^<>']*'|[\w-:]+)/g)
    .reduce((result, attribute) => {
      const [name, unformattedValue] = attribute.split('=');

      result[name] = unformattedValue
        ? unformattedValue.replace(/['"]/g, '')
        : true;

      return result;
    }, {});

  return {
    attributes,
    content,
  };
}

module.exports = transformSvg;
