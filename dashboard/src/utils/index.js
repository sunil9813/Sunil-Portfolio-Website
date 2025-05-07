export const generateItemColor = (itemName) => {
  const hashCode = Array.from(itemName).reduce((hash, char) => {
    return (hash << 5) - hash + char.charCodeAt(0);
  }, 0);

  // Generate RGB color values based on hash code
  const r = (hashCode & 0xff0000) >> 16;
  const g = (hashCode & 0x00ff00) >> 8;
  const b = hashCode & 0x0000ff;

  // Adjust brightness (lower the brightness for a darker shade)
  const adjustBrightness = (colorValue, factor = 0.7) => Math.floor(colorValue * factor);

  // Apply brightness adjustment
  const newR = adjustBrightness(r);
  const newG = adjustBrightness(g);
  const newB = adjustBrightness(b);

  // Return the adjusted color in RGB format
  return `rgb(${newR}, ${newG}, ${newB})`;
};
export const isImageValid = (file) => {
  const allowedFormats = ["image/png", "image/jpeg", "image/jpg"];
  return allowedFormats.includes(file.type);
};

export const truncateText = (text, maxLength) => {
  if (!text) return ""; // Handle undefined or null text
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const CommonClassForInput = "w-full h-full p-2 rounded-lg highlightbg textColor text-xs 3xl:text-sm";
