module.exports = function (source) {
  const [_, parsedAttributes, parsedContent] = source.match(
    /<svg(.{0,})>([\s\S]+)<\/svg>/i
  );

  const attributes = parsedAttributes
    .match(/([\w-:]+)(=)?("[^<>"]*"|'[^<>']*'|[\w-:]+)/g)
    .reduce(function (result, attribute) {
      const [name, unformattedValue] = attribute.split("=");

      result[name] = unformattedValue
        ? unformattedValue.replace(/['"]/g, "")
        : true;

      return result;
    }, {});

  return {
    attributes,
    content: parsedContent.replace(/\n/g, " ").trim(),
  };
};
