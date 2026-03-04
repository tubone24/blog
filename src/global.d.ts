// autocomplete.js has no type declarations
declare module "autocomplete.js";

// SCSS + CSS Module + TypeScript
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
  export = content;
}

declare module "*.module.scss" {
  const classes: { [className: string]: string };
  export default classes;
  export = classes;
}
