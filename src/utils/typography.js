import Typography from 'typography';
import gray from 'gray-percentage';

const theme = {
  title: 'blog-theme',
  baseFontSize: '16px',
  baseLineHeight: 1.7,
  scaleRatio: 2.3,
  googleFonts: [
    {
      name: 'Noto+Sans+JP',
      styles: ['400'],
    },
    {
      name: 'Merriweather',
      styles: ['400'],
    },
  ],
  bodyFontFamily: [
    'Merriweather',
    'Noto Sans JP',
  ],
  headerColor: 'hsl(0, 0%, 20%)',
  bodyColor: 'hsl(0, 0%, 30%)',

  overrideStyles: () => ({
    html: {
      WebkitFontSmoothing: 'antialiased',
    },
    'h1,h2,h3,h4,h5,h6': {
      letterSpacing: '0.02em',
    },
    p: {
      textAlign: 'justify',
      wordBreak: 'break-all',
    },
    a: {
      color: 'inherit',
    },
    'a:hover': {
      color: '#3498DB',
    },
    li: {
      marginBottom: '0px',
    },
    blockquote: {
      color: gray(47),
      fontSize: '85%',
      position: 'relative',
      margin: '0.5em',
      padding: '0.5em 1em 0.5em 2em',
    },
    'blockquote:before': {
      position: 'absolute',
      fontSize: '1.5em',
      lineHeight: '1',
      top: '0.2em',
      left: '0.5em',
      content: '"\\201C"',
      color: gray(30),
    },
    pre: {
      overflowX: 'auto',
      padding: '1rem',
      background: 'hsla(0,0%,0%,0.04)',
    },
  }),
};

const typography = new Typography(theme);

if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

export default typography;
export const { rhythm, scale } = typography;
