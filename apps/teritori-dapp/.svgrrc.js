module.exports = {
    jsx: {
      babelConfig: {
        plugins: ['react-inline-svg-unique-id']
      }
    },
    replaceAttrValues: {
      "#color": "{props.color}"
    }
  };