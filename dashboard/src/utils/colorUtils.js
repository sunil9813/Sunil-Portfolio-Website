export const getContrastingTextColor = (bgColor) => {
  if (!bgColor) return "#000000"; // Default to black if no color

  // Handle named colors and hex
  let color = bgColor.toLowerCase().replace(/\s/g, "");
  if (color === "white" || color === "#fff" || color === "#ffffff") return "#000000";
  if (color === "black" || color === "#000" || color === "#000000") return "#ffffff";

  // Remove '#' if present
  color = color.replace("#", "");

  // Handle 3-digit hex
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }

  // Convert hex to RGB
  const r = parseInt(color.slice(0, 2), 16);
  const g = parseInt(color.slice(2, 4), 16);
  const b = parseInt(color.slice(4, 6), 16);

  // Calculate luminance (W3C formula)
  const luminance = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);

  // Return black for light backgrounds, white for dark backgrounds
  return luminance > 0.5 ? "#000000" : "#ffffff";
};
