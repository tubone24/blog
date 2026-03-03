// gatsby の withPrefix 相当（Astroでは不要、パススルー）
export const withPrefix = (path: string): string => path;

// gatsby の navigate 相当
export const navigate = (path: string): void => {
  if (typeof window !== "undefined") {
    window.location.href = path;
  }
};
