exports.onCreateNode = require("./gatsby/onCreateNode");

// eslint-disable-next-line @typescript-eslint/no-var-requires
exports.createPages = require("./gatsby/index").createPages;

exports.onCreateWebpackConfig = require("./gatsby/onCreateWebpackConfig");
