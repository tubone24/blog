// SCSS + CSS Module + TypeScript
declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}
