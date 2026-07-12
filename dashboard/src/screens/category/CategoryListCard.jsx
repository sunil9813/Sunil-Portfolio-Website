import { Tooltip } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useId, useMemo, useState } from "react";
import { Eye, PencilLine, Trash2, FolderOpen, ImageOff, Files } from "lucide-react";
import { Wrapper } from "@/routes";

/*
 * One continuous SVG path creates:
 * 1. The top-left folder tab
 * 2. The complete front folder panel
 */
const FOLDER_PATH = `
  M 34 0
  H 88
  C 99 0 105 4 112 13
  L 127 29
  C 133 36 141 40 152 40
  H 235
  C 254 40 268 54 268 72
  V 187
  C 268 205 253 220 235 220
  H 33
  C 15 220 0 205 0 187
  V 34
  C 0 15 15 0 34 0
  Z
`;

/*
 * More premium muted colours for dark UI.
 * These are intentionally deeper and more controlled.
 */
const CATEGORY_COLOURS = [
  { accent: { r: 17, g: 105, b: 123 } }, // cyan
  { accent: { r: 83, g: 63, b: 165 } }, // violet
  { accent: { r: 47, g: 81, b: 145 } }, // blue
  { accent: { r: 138, g: 50, b: 87 } }, // rose
  { accent: { r: 29, g: 108, b: 79 } }, // green
  { accent: { r: 137, g: 94, b: 34 } }, // amber
  { accent: { r: 65, g: 58, b: 150 } }, // indigo
  { accent: { r: 118, g: 55, b: 132 } }, // magenta
  { accent: { r: 130, g: 58, b: 58 } }, // brick
  { accent: { r: 23, g: 96, b: 96 } }, // teal
  { accent: { r: 67, g: 90, b: 132 } }, // steel
  { accent: { r: 103, g: 61, b: 103 } }, // plum
];

/* ==========================================================================
   COLOUR HELPERS
   ========================================================================== */

const clamp = (value, minimum, maximum) => {
  return Math.min(Math.max(value, minimum), maximum);
};

const mixColour = (firstColour, secondColour, amount) => ({
  r: Math.round(firstColour.r + (secondColour.r - firstColour.r) * amount),
  g: Math.round(firstColour.g + (secondColour.g - firstColour.g) * amount),
  b: Math.round(firstColour.b + (secondColour.b - firstColour.b) * amount),
});

const colourToString = ({ r, g, b }, opacity = 1) => {
  if (opacity === 1) {
    return `rgb(${r}, ${g}, ${b})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const rgbToHsl = ({ r, g, b }) => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const difference = maximum - minimum;

  let hue = 0;
  let saturation = 0;

  const lightness = (maximum + minimum) / 2;

  if (difference !== 0) {
    saturation = lightness > 0.5 ? difference / (2 - maximum - minimum) : difference / (maximum + minimum);

    switch (maximum) {
      case red:
        hue = (green - blue) / difference + (green < blue ? 6 : 0);
        break;
      case green:
        hue = (blue - red) / difference + 2;
        break;
      default:
        hue = (red - green) / difference + 4;
        break;
    }

    hue /= 6;
  }

  return { h: hue, s: saturation, l: lightness };
};

const hslToRgb = ({ h, s, l }) => {
  if (s === 0) {
    const grey = Math.round(l * 255);
    return { r: grey, g: grey, b: grey };
  }

  const hueToRgb = (p, q, value) => {
    let adjustedValue = value;

    if (adjustedValue < 0) adjustedValue += 1;
    if (adjustedValue > 1) adjustedValue -= 1;

    if (adjustedValue < 1 / 6) return p + (q - p) * 6 * adjustedValue;
    if (adjustedValue < 1 / 2) return q;
    if (adjustedValue < 2 / 3) return p + (q - p) * (2 / 3 - adjustedValue) * 6;

    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, h) * 255),
    b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
  };
};

const getCategoryColour = (itemIndex = 0) => {
  const safeIndex = Number.isFinite(itemIndex) ? Math.max(0, itemIndex) : 0;
  const paletteIndex = safeIndex % CATEGORY_COLOURS.length;
  const cycle = Math.floor(safeIndex / CATEGORY_COLOURS.length);

  const selectedColour = CATEGORY_COLOURS[paletteIndex].accent;

  if (cycle === 0) {
    return selectedColour;
  }

  const hsl = rgbToHsl(selectedColour);

  return hslToRgb({
    h: (hsl.h + cycle * 0.045) % 1,
    s: clamp(hsl.s * 0.92, 0.34, 0.62),
    l: clamp(hsl.l + (cycle % 2 === 0 ? 0.015 : -0.01), 0.28, 0.44),
  });
};

/* ==========================================================================
   DARK, CONTROLLED PREMIUM PALETTE
   ========================================================================== */

const createPalette = (accent) => {
  const graphiteTop = { r: 33, g: 36, b: 44 };
  const graphiteMiddle = { r: 24, g: 27, b: 34 };
  const graphiteBottom = { r: 17, g: 20, b: 27 };

  const surfaceTop = mixColour(accent, graphiteTop, 0.78);
  const surfaceMiddle = mixColour(accent, graphiteMiddle, 0.86);
  const surfaceBottom = mixColour(accent, graphiteBottom, 0.92);

  const rearPaper = mixColour(accent, { r: 27, g: 31, b: 40 }, 0.52);
  const imagePaper = mixColour(accent, { r: 35, g: 40, b: 51 }, 0.62);
  const frontPaper = mixColour(accent, { r: 32, g: 36, b: 47 }, 0.56);

  const textAccent = mixColour(accent, { r: 201, g: 210, b: 224 }, 0.42);

  return {
    surfaceTop: colourToString(surfaceTop),
    surfaceMiddle: colourToString(surfaceMiddle),
    surfaceBottom: colourToString(surfaceBottom),

    rearPaper: colourToString(rearPaper),
    imagePaper: colourToString(imagePaper),
    frontPaper: colourToString(frontPaper),

    accent: colourToString(accent),
    accentSoft: colourToString(accent, 0.075),
    accentMedium: colourToString(accent, 0.13),
    accentBorder: colourToString(accent, 0.18),

    textAccent: colourToString(textAccent),

    mainBorder: colourToString(accent, 0.1),

    topHighlight: colourToString(mixColour(accent, { r: 255, g: 255, b: 255 }, 0.5), 0.09),

    internalGlow: colourToString(accent, 0.1),

    imageOverlay: colourToString(graphiteBottom, 0.42),
  };
};

/* ==========================================================================
   CATEGORY INFORMATION
   ========================================================================== */

const formatMetadata = (item) => {
  const explicitCount = item?.fileCount ?? item?.filesCount ?? item?.totalFiles;
  const postCount = Array.isArray(item?.posts) ? item.posts.length : 0;

  const count = explicitCount !== undefined ? explicitCount : postCount;

  const label = explicitCount !== undefined ? (count === 1 ? "file" : "files") : count === 1 ? "post" : "posts";

  const size = item?.size || item?.totalSize || item?.storageSize;

  if (size) {
    return `${count} ${label} · ${size}`;
  }

  if (item?.createdAt) {
    const date = new Date(item.createdAt);

    if (!Number.isNaN(date.getTime())) {
      const formattedDate = date.toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return `${count} ${label} · ${formattedDate}`;
    }
  }

  return `${count} ${label}`;
};

/* ==========================================================================
   CATEGORY CARD
   ========================================================================== */

export const CategoryCard = ({ item = {}, itemIndex = 0, type = "category", linktoupdate = "update-category", linktoview = "view-category", onDelete = () => {} }) => {
  const navigate = useNavigate();

  const componentId = useId().replace(/:/g, "");
  const surfaceGradientId = `folder-surface-${componentId}`;
  const internalGlowId = `folder-internal-glow-${componentId}`;
  const edgeHighlightId = `folder-edge-${componentId}`;

  const [imageError, setImageError] = useState(false);

  const imageUrl = item?.cover?.filePath;
  const identifier = item?.slug || item?._id;

  const categoryColour = useMemo(() => getCategoryColour(itemIndex), [itemIndex]);
  const palette = useMemo(() => createPalette(categoryColour), [categoryColour]);

  const metadata = formatMetadata(item);

  const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : "Category";

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const handleView = () => {
    if (!identifier) return;
    navigate(`/${linktoview}/${identifier}`);
  };

  const handleDelete = () => {
    if (!item?._id) return;
    onDelete(item._id);
  };

  return (
    <Wrapper className="enhanced-folder-wrapper">
      <article
        className="enhanced-folder-card"
        style={{
          "--folder-accent": palette.accent,
          "--folder-accent-soft": palette.accentSoft,
          "--folder-accent-medium": palette.accentMedium,
          "--folder-accent-border": palette.accentBorder,
          "--folder-text-accent": palette.textAccent,
          "--folder-rear-paper": palette.rearPaper,
          "--folder-image-paper": palette.imagePaper,
          "--folder-front-paper": palette.frontPaper,
          "--folder-image-overlay": palette.imageOverlay,
        }}
        aria-label={`${typeLabel}: ${item?.title || "Untitled"}`}
      >
        <div className="enhanced-folder-card__paper enhanced-folder-card__paper--rear" aria-hidden="true" />

        <div className="enhanced-folder-card__paper enhanced-folder-card__paper--image" aria-hidden="true">
          {imageUrl && !imageError ? (
            <>
              <img src={imageUrl} alt="" className="enhanced-folder-card__paper-image" loading="lazy" onError={() => setImageError(true)} />
              <span className="enhanced-folder-card__paper-image-overlay" />
            </>
          ) : (
            <span className="enhanced-folder-card__paper-fallback">
              <ImageOff size={19} />
            </span>
          )}
        </div>

        <div className="enhanced-folder-card__paper enhanced-folder-card__paper--front" aria-hidden="true" />

        <svg className="enhanced-folder-card__shape" viewBox="0 0 268 220" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={surfaceGradientId} x1="18" y1="4" x2="252" y2="218" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={palette.surfaceTop} />
              <stop offset="42%" stopColor={palette.surfaceMiddle} />
              <stop offset="100%" stopColor={palette.surfaceBottom} />
            </linearGradient>

            <radialGradient id={internalGlowId} cx="0" cy="0" r="1" gradientTransform="translate(35 26) rotate(42) scale(140 116)" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={palette.internalGlow} stopOpacity="0.42" />
              <stop offset="42%" stopColor={palette.internalGlow} stopOpacity="0.08" />
              <stop offset="100%" stopColor={palette.internalGlow} stopOpacity="0" />
            </radialGradient>

            <linearGradient id={edgeHighlightId} x1="0" y1="0" x2="268" y2="220" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={palette.topHighlight} stopOpacity="0.55" />
              <stop offset="38%" stopColor={palette.mainBorder} stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <path d={FOLDER_PATH} fill={`url(#${surfaceGradientId})`} stroke={`url(#${edgeHighlightId})`} strokeWidth="1" />

          <path d={FOLDER_PATH} fill={`url(#${internalGlowId})`} />
        </svg>

        <div className="enhanced-folder-card__content">
          <div className="enhanced-folder-card__type">
            <FolderOpen size={12} strokeWidth={1.9} />
            <span>{typeLabel}</span>
          </div>

          <h3 className="enhanced-folder-card__title" title={item?.title || "Untitled"}>
            {item?.title || "Untitled"}
          </h3>

          <div className="enhanced-folder-card__metadata">
            <Files size={13} strokeWidth={1.9} />
            <span>{metadata}</span>
          </div>

          {item?.description && <p className="enhanced-folder-card__description">{item.description}</p>}
        </div>

        <div className="enhanced-folder-card__actions">
          <Tooltip content="View">
            <button type="button" onClick={handleView} className="enhanced-folder-card__action enhanced-folder-card__action--view" aria-label={`View ${item?.title || "category"}`}>
              <Eye size={15} strokeWidth={2} />
            </button>
          </Tooltip>

          <Tooltip content="Edit">
            <NavLink
              to={identifier ? `/${linktoupdate}/${identifier}` : "#"}
              className="enhanced-folder-card__action enhanced-folder-card__action--edit"
              aria-label={`Edit ${item?.title || "category"}`}
            >
              <PencilLine size={14} strokeWidth={2} />
            </NavLink>
          </Tooltip>

          <Tooltip content="Delete">
            <button type="button" onClick={handleDelete} className="enhanced-folder-card__action enhanced-folder-card__action--delete" aria-label={`Delete ${item?.title || "category"}`}>
              <Trash2 size={14} strokeWidth={2} />
            </button>
          </Tooltip>
        </div>
      </article>
    </Wrapper>
  );
};

CategoryCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    fileCount: PropTypes.number,
    filesCount: PropTypes.number,
    totalFiles: PropTypes.number,
    size: PropTypes.string,
    totalSize: PropTypes.string,
    storageSize: PropTypes.string,
    cover: PropTypes.shape({
      filePath: PropTypes.string,
      publicId: PropTypes.string,
    }),
    posts: PropTypes.array,
    createdAt: PropTypes.string,
  }),
  itemIndex: PropTypes.number,
  type: PropTypes.string,
  linktoupdate: PropTypes.string,
  linktoview: PropTypes.string,
  onDelete: PropTypes.func,
};
