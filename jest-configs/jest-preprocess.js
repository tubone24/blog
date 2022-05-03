const babelOptions = {
  presets: [
    "@babel/preset-react",
    "babel-preset-gatsby",
    "@babel/preset-typescript",
  ],
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = require("babel-jest").createTransformer(babelOptions);
