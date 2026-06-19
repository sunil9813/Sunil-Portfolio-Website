import { Tooltip } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useId, useMemo, useState } from "react";
import { Eye, PencilLine, Trash2, FolderOpen, ImageOff, Files } from "lucide-react";
import { Wrapper } from "@/utils/Router";

/*
 * One continuous SVG shape creates:
 * 1. The top-left folder tab
 * 2. The main front folder panel
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

const DEFAULT_COLOUR = {
  r: 103,
  g: 72,
  b: 180,
};

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

  return {
    h: hue,
    s: saturation,
    l: lightness,
  };
};

const hslToRgb = ({ h, s, l }) => {
  if (s === 0) {
    const grey = Math.round(l * 255);

    return {
      r: grey,
      g: grey,
      b: grey,
    };
  }

  const hueToRgb = (p, q, value) => {
    let adjustedValue = value;

    if (adjustedValue < 0) {
      adjustedValue += 1;
    }

    if (adjustedValue > 1) {
      adjustedValue -= 1;
    }

    if (adjustedValue < 1 / 6) {
      return p + (q - p) * 6 * adjustedValue;
    }

    if (adjustedValue < 1 / 2) {
      return q;
    }

    if (adjustedValue < 2 / 3) {
      return p + (q - p) * (2 / 3 - adjustedValue) * 6;
    }

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

const normaliseColour = (colour) => {
  const hsl = rgbToHsl(colour);

  return hslToRgb({
    h: hsl.h,
    s: clamp(hsl.s, 0.42, 0.78),
    l: clamp(hsl.l, 0.36, 0.5),
  });
};

/* ==========================================================================
   EXTRACT DOMINANT IMAGE COLOUR
   ========================================================================== */

const extractDominantColour = (image) => {
  const canvas = document.createElement("canvas");

  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!context) {
    return DEFAULT_COLOUR;
  }

  const sampleSize = 56;

  canvas.width = sampleSize;
  canvas.height = sampleSize;

  context.drawImage(image, 0, 0, sampleSize, sampleSize);

  const pixels = context.getImageData(0, 0, sampleSize, sampleSize).data;

  const colourBuckets = new Map();

  for (let index = 0; index < pixels.length; index += 8) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];
    const alpha = pixels[index + 3];

    if (alpha < 180) {
      continue;
    }

    const brightness = red * 0.299 + green * 0.587 + blue * 0.114;

    const difference = Math.max(red, green, blue) - Math.min(red, green, blue);

    // Ignore nearly white and nearly black pixels.
    if (brightness > 238 || brightness < 22) {
      continue;
    }

    const groupedRed = Math.round(red / 24) * 24;

    const groupedGreen = Math.round(green / 24) * 24;

    const groupedBlue = Math.round(blue / 24) * 24;

    const key = `${groupedRed}-${groupedGreen}-${groupedBlue}`;

    const bucket = colourBuckets.get(key) || {
      score: 0,
      totalRed: 0,
      totalGreen: 0,
      totalBlue: 0,
      count: 0,
    };

    const saturationWeight = 0.7 + (difference / 255) * 1.8;

    bucket.score += saturationWeight;
    bucket.totalRed += red;
    bucket.totalGreen += green;
    bucket.totalBlue += blue;
    bucket.count += 1;

    colourBuckets.set(key, bucket);
  }

  if (colourBuckets.size === 0) {
    return DEFAULT_COLOUR;
  }

  let dominantBucket = null;

  colourBuckets.forEach((bucket) => {
    if (!dominantBucket || bucket.score > dominantBucket.score) {
      dominantBucket = bucket;
    }
  });

  return {
    r: Math.round(dominantBucket.totalRed / dominantBucket.count),

    g: Math.round(dominantBucket.totalGreen / dominantBucket.count),

    b: Math.round(dominantBucket.totalBlue / dominantBucket.count),
  };
};

/* ==========================================================================
   CREATE DYNAMIC CARD PALETTE
   ========================================================================== */

const createPalette = (dominantColour) => {
  const accent = normaliseColour(dominantColour);

  const surfaceTop = mixColour(
    accent,
    {
      r: 43,
      g: 41,
      b: 44,
    },
    0.76,
  );

  const surfaceMiddle = mixColour(
    accent,
    {
      r: 30,
      g: 29,
      b: 32,
    },
    0.86,
  );

  const surfaceBottom = mixColour(
    accent,
    {
      r: 24,
      g: 23,
      b: 26,
    },
    0.93,
  );

  const rearPaper = mixColour(
    accent,
    {
      r: 70,
      g: 48,
      b: 118,
    },
    0.28,
  );

  const imagePaper = mixColour(
    accent,
    {
      r: 95,
      g: 66,
      b: 152,
    },
    0.2,
  );

  const frontPaper = mixColour(
    accent,
    {
      r: 126,
      g: 85,
      b: 194,
    },
    0.25,
  );

  const highlight = mixColour(
    accent,
    {
      r: 255,
      g: 255,
      b: 255,
    },
    0.12,
  );

  return {
    surfaceTop: colourToString(surfaceTop),

    surfaceMiddle: colourToString(surfaceMiddle),

    surfaceBottom: colourToString(surfaceBottom),

    rearPaper: colourToString(rearPaper),

    imagePaper: colourToString(imagePaper),

    frontPaper: colourToString(frontPaper),

    accent: colourToString(accent),

    accentSoft: colourToString(accent, 0.16),

    accentBorder: colourToString(accent, 0.3),

    border: colourToString(accent, 0.1),

    glow: colourToString(highlight, 0.25),

    imageOverlay: colourToString(surfaceBottom, 0.26),
  };
};

/* ==========================================================================
   METADATA
   ========================================================================== */

const formatMetadata = (item) => {
  const explicitCount = item?.fileCount ?? item?.filesCount ?? item?.totalFiles;

  const postCount = item?.posts?.length || 0;

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

export const CategoryCard = ({ item = {}, type = "category", linktoupdate = "update-category", linktoview = "view-category", onDelete = () => {} }) => {
  const navigate = useNavigate();

  const componentId = useId().replace(/:/g, "");

  const surfaceGradientId = `folder-surface-${componentId}`;

  const glowGradientId = `folder-glow-${componentId}`;

  const [imageError, setImageError] = useState(false);

  const [dominantColour, setDominantColour] = useState(DEFAULT_COLOUR);

  const imageUrl = item?.cover?.filePath;

  const identifier = item?.slug || item?._id;

  const palette = useMemo(() => createPalette(dominantColour), [dominantColour]);

  const metadata = formatMetadata(item);

  const typeLabel = type ? type.charAt(0).toUpperCase() + type.slice(1) : "Category";

  useEffect(() => {
    setImageError(false);
    setDominantColour(DEFAULT_COLOUR);

    if (!imageUrl) {
      return undefined;
    }

    let cancelled = false;

    const colourImage = new Image();

    colourImage.crossOrigin = "anonymous";

    colourImage.decoding = "async";

    colourImage.onload = () => {
      if (cancelled) {
        return;
      }

      try {
        const extractedColour = extractDominantColour(colourImage);

        setDominantColour(extractedColour);
      } catch (error) {
        console.warn("Unable to extract image colour:", error);
      }
    };

    colourImage.onerror = () => {
      // Keep the default colour.
    };

    colourImage.src = imageUrl;

    return () => {
      cancelled = true;
      colourImage.onload = null;
      colourImage.onerror = null;
    };
  }, [imageUrl]);

  const handleView = () => {
    if (!identifier) {
      return;
    }

    navigate(`/${linktoview}/${identifier}`);
  };

  const handleDelete = () => {
    if (!item?._id) {
      return;
    }

    onDelete(item._id);
  };

  return (
    <Wrapper className="enhanced-folder-wrapper">
      <article
        className="enhanced-folder-card"
        style={{
          "--folder-rear-paper": palette.rearPaper,

          "--folder-image-paper": palette.imagePaper,

          "--folder-front-paper": palette.frontPaper,

          "--folder-accent": palette.accent,

          "--folder-accent-soft": palette.accentSoft,

          "--folder-accent-border": palette.accentBorder,

          "--folder-border": palette.border,

          "--folder-glow": palette.glow,

          "--folder-image-overlay": palette.imageOverlay,
        }}
        aria-label={`${typeLabel}: ${item?.title || "Untitled"}`}
      >
        {/* Layer 1: rear coloured paper */}
        <div
          className="
            enhanced-folder-card__paper
            enhanced-folder-card__paper--rear
          "
          aria-hidden="true"
        />

        {/* Layer 2: category image */}
        <div
          className="
            enhanced-folder-card__paper
            enhanced-folder-card__paper--image
          "
          aria-hidden="true"
        >
          {imageUrl && !imageError ? (
            <>
              <img src={imageUrl} alt="" className="enhanced-folder-card__paper-image" loading="lazy" onError={() => setImageError(true)} />

              <span className="enhanced-folder-card__paper-image-overlay" />
            </>
          ) : (
            <span className="enhanced-folder-card__paper-fallback">
              <ImageOff size={20} />
            </span>
          )}
        </div>

        {/* Layer 3: coloured paper */}
        <div
          className="
            enhanced-folder-card__paper
            enhanced-folder-card__paper--front
          "
          aria-hidden="true"
        />

        {/* Layer 4: main folder */}
        <svg className="enhanced-folder-card__shape" viewBox="0 0 268 220" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={surfaceGradientId} x1="24" y1="6" x2="247" y2="214" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={palette.surfaceTop} />

              <stop offset="47%" stopColor={palette.surfaceMiddle} />

              <stop offset="100%" stopColor={palette.surfaceBottom} />
            </linearGradient>

            <radialGradient
              id={glowGradientId}
              cx="0"
              cy="0"
              r="1"
              gradientTransform="
                translate(51 45)
                rotate(42)
                scale(108 97)
              "
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={palette.glow} stopOpacity="0.88" />

              <stop offset="56%" stopColor={palette.glow} stopOpacity="0.13" />

              <stop offset="100%" stopColor={palette.glow} stopOpacity="0" />
            </radialGradient>
          </defs>

          <path d={FOLDER_PATH} fill={`url(#${surfaceGradientId})`} stroke={palette.border} strokeWidth="1" />

          <path d={FOLDER_PATH} fill={`url(#${glowGradientId})`} />
        </svg>

        {/* Card content */}
        <div className="enhanced-folder-card__content">
          <div className="enhanced-folder-card__type">
            <FolderOpen size={12} />

            <span>{typeLabel}</span>
          </div>

          <h3 className="enhanced-folder-card__title" title={item?.title || "Untitled"}>
            {item?.title || "Untitled"}
          </h3>

          <div className="enhanced-folder-card__metadata">
            <Files size={13} />

            <span>{metadata}</span>
          </div>

          {item?.description && <p className="enhanced-folder-card__description">{item.description}</p>}
        </div>

        {/*
         * Hidden normally.
         * Appears only when the whole card is hovered.
         */}
        <div className="enhanced-folder-card__actions">
          <Tooltip content="View">
            <button
              type="button"
              onClick={handleView}
              className="
                enhanced-folder-card__action
                enhanced-folder-card__action--view
              "
              aria-label={`View ${item?.title || "category"}`}
            >
              <Eye size={16} strokeWidth={2} />
            </button>
          </Tooltip>

          <Tooltip content="Edit">
            <NavLink
              to={identifier ? `/${linktoupdate}/${identifier}` : "#"}
              className="
                enhanced-folder-card__action
                enhanced-folder-card__action--edit
              "
              aria-label={`Edit ${item?.title || "category"}`}
            >
              <PencilLine size={15} strokeWidth={2} />
            </NavLink>
          </Tooltip>

          <Tooltip content="Delete">
            <button
              type="button"
              onClick={handleDelete}
              className="
                enhanced-folder-card__action
                enhanced-folder-card__action--delete
              "
              aria-label={`Delete ${item?.title || "category"}`}
            >
              <Trash2 size={15} strokeWidth={2} />
            </button>
          </Tooltip>
        </div>
      </article>
    </Wrapper>
  );
};

/* ==========================================================================
   PROP TYPES
   ========================================================================== */

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

  type: PropTypes.string,
  linktoupdate: PropTypes.string,
  linktoview: PropTypes.string,
  onDelete: PropTypes.func,
};
