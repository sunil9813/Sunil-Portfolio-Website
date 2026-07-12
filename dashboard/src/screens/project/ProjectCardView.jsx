import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { ArrowUpRight, Boxes, Download, Eye, Heart, ImageOff, LockKeyhole, PackageOpen, Star, Unlock } from "lucide-react";

const DEFAULT_IMAGE = "https://via.placeholder.com/1400x900?text=Project";

/*
 * Accent colours are only used for subtle lighting,
 * category indicators and the top border highlight.
 * The card background remains neutral and dark.
 */
const PROJECT_ACCENTS = [
  {
    primary: "#8FA2C7",
    soft: "rgba(143,162,199,0.10)",
    border: "rgba(143,162,199,0.25)",
    glow: "rgba(105,128,177,0.16)",
  },
  {
    primary: "#A18AC0",
    soft: "rgba(161,138,192,0.10)",
    border: "rgba(161,138,192,0.25)",
    glow: "rgba(139,94,179,0.17)",
  },
  {
    primary: "#7DA5C3",
    soft: "rgba(125,165,195,0.10)",
    border: "rgba(125,165,195,0.25)",
    glow: "rgba(82,142,184,0.16)",
  },
  {
    primary: "#A188B0",
    soft: "rgba(161,136,176,0.10)",
    border: "rgba(161,136,176,0.25)",
    glow: "rgba(151,92,165,0.16)",
  },
  {
    primary: "#79A7B5",
    soft: "rgba(121,167,181,0.10)",
    border: "rgba(121,167,181,0.25)",
    glow: "rgba(69,145,164,0.16)",
  },
];

/*
 * Matches the reference:
 *
 * First row:
 * 4 columns + 5 columns + 3 columns
 *
 * Second row:
 * 5 columns + 7 columns
 */
const PROJECT_LAYOUTS = [
  {
    className: "xl:col-span-4",
    heightClass: "min-h-[390px] xl:h-[430px]",
  },
  {
    className: "xl:col-span-5",
    heightClass: "min-h-[390px] xl:h-[430px]",
  },
  {
    className: "xl:col-span-3",
    heightClass: "min-h-[390px] xl:h-[430px]",
  },
  {
    className: "xl:col-span-5",
    heightClass: "min-h-[410px] xl:h-[465px]",
  },
  {
    className: "xl:col-span-7",
    heightClass: "min-h-[410px] xl:h-[465px]",
  },
];

const projectShape = PropTypes.shape({
  _id: PropTypes.string,
  id: PropTypes.string,
  slug: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  shortDescription: PropTypes.string,
  metaDescription: PropTypes.string,
  image: PropTypes.string,

  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  thumbnail: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      filePath: PropTypes.string,
      url: PropTypes.string,
      src: PropTypes.string,
    }),
  ]),

  cover: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      filePath: PropTypes.string,
      url: PropTypes.string,
      src: PropTypes.string,
    }),
  ]),

  assets: PropTypes.oneOfType([PropTypes.array, PropTypes.number, PropTypes.string]),

  numOfViews: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

  views: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

  likes: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

  downloadCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

  downloads: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

  ratings: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.array]),

  visibility: PropTypes.string,
  featured: PropTypes.bool,
  isFeatured: PropTypes.bool,

  category: PropTypes.shape({
    title: PropTypes.string,
  }),
});

const TWO_LINE_CLAMP = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const THREE_LINE_CLAMP = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const getAccent = (index) => PROJECT_ACCENTS[index % PROJECT_ACCENTS.length];

const getImageUrl = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  return value?.filePath || value?.url || value?.src || null;
};

const getProjectImage = (project) => getImageUrl(project?.thumbnail) || getImageUrl(project?.cover) || project?.image || DEFAULT_IMAGE;

const getProjectLink = (project) => {
  const identifier = project?.slug || project?._id || project?.id || "";

  return `/view-project/${identifier}`;
};

const getCount = (value) => {
  if (Array.isArray(value)) {
    return value.length;
  }

  if (value === undefined || value === null) {
    return 0;
  }

  const number = Number(value);

  return Number.isNaN(number) ? 0 : number;
};

const formatCount = (value) => {
  const number = getCount(value);

  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1)}M`;
  }

  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(1)}K`;
  }

  return number.toString();
};

const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") {
    return "Free";
  }

  const price = Number(value);

  if (Number.isNaN(price)) {
    return String(value);
  }

  if (price === 0) {
    return "Free";
  }

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(price);
};

const getDescription = (project) =>
  project?.metaDescription || project?.shortDescription || project?.description || "Explore the included resources, reusable assets and complete implementation details for this project.";

const getAssetCount = (project) => getCount(project?.assets);

const getViewCount = (project) => getCount(project?.numOfViews ?? project?.views);

const getDownloadCount = (project) => getCount(project?.downloadCount ?? project?.downloads);

const ProjectImage = ({ project }) => {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,#172131_0%,#0E141B_48%,#080C12_100%)]">
        <span className="flex size-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025] text-[#657383] shadow-[0_18px_42px_rgba(0,0,0,0.4)]">
          <ImageOff size={22} />
        </span>
      </div>
    );
  }

  return (
    <img
      src={getProjectImage(project)}
      alt={project?.title || project?.name || "Project thumbnail"}
      loading="lazy"
      onError={() => setImageError(true)}
      className="absolute inset-0 size-full object-cover transition-[transform,filter] duration-700 ease-out group-hover/card:scale-[1.035] group-hover/card:saturate-[1.04]"
      style={{
        filter: "brightness(0.76) saturate(0.88) contrast(1.06)",
      }}
    />
  );
};

ProjectImage.propTypes = {
  project: projectShape.isRequired,
};

const CategoryBadge = ({ project, accent }) => {
  const category = project?.category?.title || "Project";

  return (
    <span
      title={category}
      className="inline-flex h-7 max-w-[70%] items-center gap-2 rounded-full border bg-[#080C12]/75 px-3 text-[7px] font-black uppercase tracking-[0.12em] shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      style={{
        color: accent.primary,
        borderColor: accent.border,
      }}
    >
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{
          background: accent.primary,
          boxShadow: `0 0 9px ${accent.primary}80`,
        }}
      />

      <span className="truncate">{category}</span>
    </span>
  );
};

CategoryBadge.propTypes = {
  project: projectShape.isRequired,

  accent: PropTypes.shape({
    primary: PropTypes.string,
    border: PropTypes.string,
  }).isRequired,
};

const PriceBadge = ({ project, accent }) => (
  <span
    className="inline-flex h-7 shrink-0 items-center rounded-full border bg-[#080C12]/75 px-3 text-[8px] font-black shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    style={{
      color: accent.primary,
      borderColor: accent.border,
    }}
  >
    {formatPrice(project?.price)}
  </span>
);

PriceBadge.propTypes = {
  project: projectShape.isRequired,

  accent: PropTypes.shape({
    primary: PropTypes.string,
    border: PropTypes.string,
  }).isRequired,
};

const StatusBadge = ({ project }) => {
  const isPublic = project?.visibility !== "private";

  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-black/20 px-2.5 text-[7px] font-bold text-white/55 backdrop-blur-lg">
      {isPublic ? <Unlock size={9} /> : <LockKeyhole size={9} />}

      {isPublic ? "Public" : "Private"}
    </span>
  );
};

StatusBadge.propTypes = {
  project: projectShape.isRequired,
};

const MetricItem = ({ icon: Icon, label, value }) => (
  <span title={label} className="inline-flex items-center gap-1.5 text-[8px] font-semibold text-[#8A96A5]">
    <Icon size={10} className="shrink-0 text-[#5E6B7A]" />

    <span className="tabular-nums">{value}</span>
  </span>
);

MetricItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,

  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const ProjectMetrics = ({ project }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
    <MetricItem icon={Boxes} label="Assets" value={formatCount(getAssetCount(project))} />

    <MetricItem icon={Eye} label="Views" value={formatCount(getViewCount(project))} />

    <MetricItem icon={Heart} label="Likes" value={formatCount(project?.likes)} />

    <MetricItem icon={Download} label="Downloads" value={formatCount(getDownloadCount(project))} />
  </div>
);

ProjectMetrics.propTypes = {
  project: projectShape.isRequired,
};

const ProjectCard = ({ project, localIndex, accentIndex }) => {
  const accent = getAccent(accentIndex);

  const layout = PROJECT_LAYOUTS[localIndex % PROJECT_LAYOUTS.length];

  const title = project?.title || project?.name || "Untitled project";

  const description = getDescription(project);

  const isFeatured = project?.featured || project?.isFeatured;

  const rating = getCount(project?.ratings);

  const isWideCard = localIndex === 3 || localIndex === 4;

  return (
    <div className={`${layout.className} ${layout.heightClass}`}>
      <NavLink
        to={getProjectLink(project)}
        aria-label={`View ${title}`}
        className="group/card relative isolate block h-full overflow-hidden rounded-[22px] border border-[#252E3A] bg-[#0A0F16] shadow-[0_18px_48px_rgba(0,0,0,0.36)] transition-all duration-500 hover:-translate-y-1 hover:border-[#3B4756] hover:shadow-[0_30px_76px_rgba(0,0,0,0.55)]"
      >
        <ProjectImage project={project} />

        {/* Top image lighting */}
        <span
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-50 blur-[100px] transition-all duration-700 group-hover/card:scale-110 group-hover/card:opacity-80"
          style={{
            background: accent.glow,
          }}
        />

        {/* Smooth reference-style bottom fade */}
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,13,0.03)_0%,rgba(5,8,13,0.06)_34%,rgba(5,8,13,0.68)_62%,rgba(5,8,13,0.96)_79%,#05080D_100%)]" />

        {/* Side contrast */}
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(3,6,10,0.18)_0%,transparent_42%,rgba(3,6,10,0.10)_100%)]" />

        {/* Subtle bottom bloom */}
        <span
          className="pointer-events-none absolute -bottom-36 left-1/2 size-80 -translate-x-1/2 rounded-full opacity-25 blur-[110px]"
          style={{
            background: accent.glow,
          }}
        />

        {/* Coloured top shine */}
        <span
          className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px"
          style={{
            background: `linear-gradient(
              90deg,
              transparent,
              ${accent.primary}20,
              ${accent.primary},
              ${accent.primary}20,
              transparent
            )`,
            boxShadow: `0 0 16px ${accent.glow}`,
          }}
        />

        {/* Inner card edge */}
        <span className="pointer-events-none absolute inset-0 z-20 rounded-[22px] ring-1 ring-inset ring-white/[0.03]" />

        {/* Hover border */}
        <span
          className="pointer-events-none absolute inset-0 z-20 rounded-[22px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{
            boxShadow: `inset 0 0 0 1px ${accent.border}`,
          }}
        />

        {/* Top badges */}
        <div className="absolute inset-x-4 top-4 z-30 flex items-start justify-between gap-3">
          <CategoryBadge project={project} accent={accent} />

          <div className="flex shrink-0 items-center gap-2">
            {isFeatured && (
              <span className="flex size-7 items-center justify-center rounded-full border border-amber-300/[0.15] bg-[#080C12]/75 text-amber-200/80 shadow-[0_10px_26px_rgba(0,0,0,0.32)] backdrop-blur-xl">
                <Star size={10} className="fill-current" />
              </span>
            )}

            <PriceBadge project={project} accent={accent} />
          </div>
        </div>

        {/* Main project information */}
        <div className={`absolute inset-x-0 bottom-0 z-30 ${isWideCard ? "p-6" : "p-5"}`}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge project={project} />

            {rating > 0 && (
              <span className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-black/20 px-2.5 text-[7px] font-bold text-white/55 backdrop-blur-lg">
                <Star size={9} className="fill-current text-amber-300/75" />

                {Number(rating).toFixed(1)}
              </span>
            )}
          </div>

          <h3
            title={title}
            style={TWO_LINE_CLAMP}
            className={`max-w-[92%] font-black leading-[1.35] tracking-[-0.03em] text-[#F2F5F8] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-colors duration-300 group-hover/card:text-white ${
              isWideCard ? "text-[20px]" : "text-[17px]"
            }`}
          >
            {title}
          </h3>

          <p style={THREE_LINE_CLAMP} className={`mt-2 leading-[1.7] text-[#A0AAB7] ${isWideCard ? "max-w-2xl text-[10px]" : "max-w-xl text-[9px]"}`}>
            {description}
          </p>

          <div className="mt-4 flex items-end justify-between gap-4 border-t border-white/[0.055] pt-4">
            <ProjectMetrics project={project} />

            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
              style={{
                color: accent.primary,
                background: accent.soft,
                borderColor: accent.border,
                boxShadow: `0 8px 28px ${accent.glow}`,
              }}
            >
              <ArrowUpRight size={15} />
            </span>
          </div>
        </div>
      </NavLink>
    </div>
  );
};

ProjectCard.propTypes = {
  project: projectShape.isRequired,
  localIndex: PropTypes.number.isRequired,
  accentIndex: PropTypes.number.isRequired,
};

const EmptyProjectView = () => (
  <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-[#293440] bg-[#0E141B] px-6 text-center">
    <span className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[#859CC0]/[0.035] blur-[95px]" />

    <span className="pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full bg-[#876F9F]/[0.03] blur-[95px]" />

    <div className="relative">
      <span className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-[#293440] bg-[#10161E] text-[#687586] shadow-[0_16px_36px_rgba(0,0,0,0.32)]">
        <PackageOpen size={23} />
      </span>

      <h3 className="mt-4 text-[13px] font-black text-[#D8DEE8]">No projects found</h3>

      <p className="mt-2 max-w-sm text-[9px] leading-5 text-[#687586]">There are currently no project cards available to display.</p>
    </div>
  </div>
);

export const ProjectCardView = ({ projects = [], startIndex = 0 }) => {
  const validProjects = useMemo(() => (Array.isArray(projects) ? projects.filter(Boolean) : []), [projects]);

  if (validProjects.length === 0) {
    return <EmptyProjectView />;
  }

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-12">
      {validProjects.map((project, localIndex) => {
        const accentIndex = startIndex + localIndex;

        const projectKey = project?._id || project?.id || project?.slug || `${project?.title}-${accentIndex}`;

        return <ProjectCard key={projectKey} project={project} localIndex={localIndex} accentIndex={accentIndex} />;
      })}
    </section>
  );
};

ProjectCardView.propTypes = {
  projects: PropTypes.arrayOf(projectShape),
  startIndex: PropTypes.number,
};
