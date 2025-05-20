// utils/colorUtils.js
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const rgbaToHex = (rgba) => {
  if (rgba.startsWith("#")) return rgba;

  // Extract values from rgba string
  const values = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/);
  if (!values) return "#ffffff";

  const r = parseInt(values[1]);
  const g = parseInt(values[2]);
  const b = parseInt(values[3]);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const isValidHex = (color) => {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color) || /^#([0-9A-F]{4}){1,2}$/i.test(color);
};

export const rgbaStringToObject = (rgba) => {
  const values = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/);
  if (!values) return { r: 255, g: 255, b: 255, a: 1 };

  return {
    r: parseInt(values[1]),
    g: parseInt(values[2]),
    b: parseInt(values[3]),
    a: values[4] ? parseFloat(values[4]) : 1,
  };
};
