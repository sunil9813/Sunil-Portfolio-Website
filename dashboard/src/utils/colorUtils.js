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

export const gradientColors = [
  "linear-gradient(rgb(192, 52, 149) 0%, rgb(76, 36, 214) 100%)",
  "linear-gradient(rgb(0, 91, 157) 0%, rgb(26, 105, 85) 100%)",
  "linear-gradient(209.21deg, rgb(136, 0, 148) 13.57%, rgb(81, 77, 255) 98.38%)",
  "linear-gradient(209.21deg, rgb(233, 109, 44) 13.57%, rgb(239, 77, 77) 98.38%)",
  "linear-gradient(209.21deg, rgb(186, 233, 44) 13.57%, rgb(77, 120, 239) 98.38%)",
  "linear-gradient(209.21deg, rgb(211, 30, 100) 13.57%, rgb(77, 190, 255) 98.38%)",
  "linear-gradient(209.21deg, rgb(239, 218, 54) 13.57%, rgb(255, 77, 202) 98.38%)",
  "linear-gradient(209.21deg, rgb(54, 214, 239) 13.57%, rgb(255, 157, 77) 98.38%)",
  "linear-gradient(209.21deg, rgb(100, 239, 54) 13.57%, rgb(77, 83, 255) 98.38%)",
  "linear-gradient(209.21deg, rgb(239, 54, 164) 13.57%, rgb(255, 126, 77) 98.38%)",
];
