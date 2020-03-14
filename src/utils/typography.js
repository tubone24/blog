import Typography from 'typography';
import theme from 'typography-theme-japanese-tofu';

const typography = new Typography(theme);

if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles();
}

export default typography;
export const { rhythm, scale } = typography;
