const CART_STORAGE_KEY = "sunil_portfolio_cart";
const WISHLIST_STORAGE_KEY = "sunil_portfolio_wishlist";
export const CART_UPDATED_EVENT = "cart:updated";
export const WISHLIST_UPDATED_EVENT = "wishlist:updated";

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

const getAssetUrl = (asset) => {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  return asset.filePath || asset.url || "";
};

export const getItemPrice = (item = {}) => {
  const originalPrice = Number(item.price || 0);
  const discount = item.discountShow && item.discount ? Number(item.discount || 0) : 0;
  const isDiscountActive = !item.discountDate || new Date(item.discountDate).getTime() >= Date.now();

  if (discount > 0 && isDiscountActive) {
    return Math.max(Number((originalPrice - (originalPrice * discount) / 100).toFixed(2)), 0);
  }

  return originalPrice;
};

export const normalizeCartItem = (item = {}, type = "course") => {
  const normalizedType = type === "Project" || item.type === "Project" ? "Project" : "Course";
  const title = item.title || item.name || "Untitled item";
  const price = getItemPrice(item);

  return {
    id: item._id || item.id,
    type: normalizedType,
    title,
    slug: item.slug,
    description: item.metaDescription || item.description || "",
    image: getAssetUrl(item.thumbnail) || getAssetUrl(item.logo) || getAssetUrl(item.assets?.[0]),
    price,
    originalPrice: Number(item.price || price || 0),
    discount: item.discountShow ? Number(item.discount || 0) : 0,
    quantity: 1,
  };
};

export const getCartItems = () => {
  if (!canUseStorage()) return [];

  try {
    const parsedItems = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch {
    return [];
  }
};

const setCartItems = (items = []) => {
  if (!canUseStorage()) return items;

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: items }));

  return items;
};

export const addCartItem = (item = {}, type = "course") => {
  const normalizedItem = normalizeCartItem(item, type);

  if (!normalizedItem.id) {
    return getCartItems();
  }

  const currentItems = getCartItems();
  const exists = currentItems.some((cartItem) => cartItem.id === normalizedItem.id && cartItem.type === normalizedItem.type);

  if (exists) {
    return currentItems;
  }

  return setCartItems([...currentItems, normalizedItem]);
};

export const removeCartItem = (id, type) => {
  return setCartItems(getCartItems().filter((item) => !(item.id === id && item.type === type)));
};

export const clearCart = () => setCartItems([]);

export const getWishlistItems = () => {
  if (!canUseStorage()) return [];

  try {
    const parsedItems = JSON.parse(window.localStorage.getItem(WISHLIST_STORAGE_KEY) || "[]");
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch {
    return [];
  }
};

const setWishlistItems = (items = []) => {
  if (!canUseStorage()) return items;

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED_EVENT, { detail: items }));

  return items;
};

export const addWishlistItem = (item = {}) => {
  const normalizedItem = item.id ? item : normalizeCartItem(item, item.type || "course");

  if (!normalizedItem.id) return getWishlistItems();

  const currentItems = getWishlistItems();
  const exists = currentItems.some((wishlistItem) => wishlistItem.id === normalizedItem.id && wishlistItem.type === normalizedItem.type);

  if (exists) return currentItems;

  return setWishlistItems([...currentItems, normalizedItem]);
};

export const removeWishlistItem = (id, type) => {
  return setWishlistItems(getWishlistItems().filter((item) => !(item.id === id && item.type === type)));
};

export const moveCartItemToWishlist = (item) => {
  addWishlistItem(item);
  return removeCartItem(item.id, item.type);
};

export const moveWishlistItemToCart = (item) => {
  addCartItem(item, item.type);
  return removeWishlistItem(item.id, item.type);
};

export const getCartSummary = (items = getCartItems()) => {
  const count = items.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  const subtotal = items.reduce((total, item) => total + Number(item.price || 0) * (Number(item.quantity) || 1), 0);

  return {
    count,
    subtotal: Number(subtotal.toFixed(2)),
  };
};

export const subscribeCart = (callback) => {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback(getCartItems());
  window.addEventListener(CART_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(CART_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

export const subscribeWishlist = (callback) => {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback(getWishlistItems());
  window.addEventListener(WISHLIST_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(WISHLIST_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};
