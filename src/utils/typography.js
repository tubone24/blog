import Typography from 'typography'
import grandViewTheme from 'typography-theme-grand-view'

grandViewTheme.overrideThemeStyles = () => ({
  'html,body,h1,h2,h3,h4,h5,h6': {
    color: '#444',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Helvetica Neue',
      'Hiragino Kaku Gothic ProN',
      '"Yu Gothic"',
      'YuGothic',
      'Verdana',
      'Meiryo',
      '"M+ 1p"',
      'sans-serif',
    ].join(','),
  },
})

const typography = new Typography(grandViewTheme)

const { rhythm, scale } = typography;
export { rhythm, scale, typography as default };
