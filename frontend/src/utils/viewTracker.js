const VIEW_TRACK_PREFIX = "sunil-portfolio-view";

export const shouldTrackViewOnce = (viewKey) => {
  if (!viewKey) return false;

  const storageKey = `${VIEW_TRACK_PREFIX}:${viewKey}`;

  try {
    if (sessionStorage.getItem(storageKey)) {
      return false;
    }

    sessionStorage.setItem(storageKey, String(Date.now()));
    return true;
  } catch {
    return true;
  }
};
