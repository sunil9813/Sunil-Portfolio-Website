export const getFocusedEditor = (editor) => {
  return editor.chain().focus();
};

// Function to validate the URL and return the origin
export const validateUrl = (url) => {
  if (!url.trim()) return "";

  let finalUrl;

  try {
    finalUrl = new URL(url);
  } catch {
    finalUrl = new URL("http://" + url);
  }
  return finalUrl.origin;
};
