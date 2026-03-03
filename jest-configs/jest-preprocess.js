// Custom Babel plugin to replace import.meta.env.X with process.env.X for Jest (CommonJS)
function importMetaEnvPlugin({ types: t }) {
  return {
    visitor: {
      MetaProperty(path) {
        if (
          path.node.meta.name === "import" &&
          path.node.property.name === "meta"
        ) {
          // Replace import.meta with an object that has an env property
          // pointing to process.env so that import.meta.env.FOO works.
          path.replaceWith(
            t.objectExpression([
              t.objectProperty(
                t.identifier("env"),
                t.memberExpression(
                  t.identifier("process"),
                  t.identifier("env"),
                ),
              ),
            ]),
          );
        }
      },
    },
  };
}

const babelOptions = {
  presets: [
    "@babel/preset-react",
    "@babel/preset-env",
    "@babel/preset-typescript",
  ],
  plugins: [importMetaEnvPlugin],
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = require("babel-jest").createTransformer(babelOptions);
