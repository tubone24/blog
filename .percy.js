module.exports = {
  'version': 1,
  'snapshot': {
    'widths': [375, 1280, 1920],
    'min-height': 1024, // px
    'percy-css': `
      iframe {
        display: none;
      }`,
    'enable-javascript': true,
  },
  'static-snapshots': {
    'path': './public/',
    'base-url': '/',
    'snapshot-files': '**/*.html',
    'ignore-files': '**/*.htm'
  },
};
