import { Comments } from "@/components/comment/Comments";
import { ActionButton } from "@/components/customeUI/Button";
import { DateFormatter } from "@/components/DateFormatter";
import { FavoriteButton } from "@/components/FavoriteButton";
import { LikeButton } from "@/components/LikeButton";
import { ProductQuestions } from "@/components/product/ProductQuestions";
import { RichTextRenderer } from "@/components/render/RichTextRenderer";
import { COMMENT_RESET, getComments } from "@/redux/slices/common/commentSlice";
import { getAllProject, getProject } from "@/redux/slices/projectSlice";
import { addCartItem } from "@/utils/cart";
import { REACT_APP_BACKEND_URL } from "@/utils/api";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineInstagram, AiOutlineLink, AiOutlineTwitter, AiOutlineUpload } from "react-icons/ai";
import { BsArrowLeft, BsArrowRight, BsBoxSeam, BsClipboard, BsFillCalendarCheckFill, BsGrid1X2Fill, BsPatchCheck } from "react-icons/bs";
import { FaBug, FaCode, FaComments, FaFacebookF, FaFileDownload, FaQuestionCircle, FaRegLifeRing, FaShoppingCart, FaTelegramPlane } from "react-icons/fa";
import { IoCheckmarkCircle, IoEye } from "react-icons/io5";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IconWithFallback } from "./ProjectCard";

const getCount = (value) => {
  if (Array.isArray(value)) return value.length;
  const numericValue = Number(value || 0);
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const getCommentCount = (items = []) => {
  if (!Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    const replies = item?.replies || item?.comment?.replies || [];
    return total + 1 + getCommentCount(replies);
  }, 0);
};

const getProjectDisplayPrice = (project) => {
  const price = Number(project?.price || 0);
  const discount = Number(project?.discount || 0);
  const discountDate = project?.discountDate ? new Date(project.discountDate) : null;
  const hasActiveDiscount = project?.discountShow && discount > 0 && discountDate && discountDate > new Date();

  return Math.max(0, hasActiveDiscount ? price - discount : price);
};

const formatProjectPrice = (price) => {
  const value = Number(price || 0);
  return value > 0 ? `$ ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}` : "Free";
};

const formatFileSize = (size) => {
  const bytes = Number(size || 0);
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getProjectResourceMeta = (project) => {
  const resourceFile = project?.resourceFile || {};
  const file = resourceFile.file || {};

  if (resourceFile.type === "url") {
    return {
      label: "External link",
      detail: resourceFile.url?.replace(/^https?:\/\//, "") || "Resource URL",
      type: "URL",
    };
  }

  if (resourceFile.type === "file" || Object.keys(file).length) {
    return {
      label: file.originalName || file.fileName || "Project package",
      detail: [formatFileSize(file.size), file.mimeType || file.fileType].filter(Boolean).join(" • ") || "Downloadable file",
      type: "File",
    };
  }

  return {
    label: "No file attached",
    detail: "Add a resource file or URL from dashboard.",
    type: "Missing",
  };
};

const upsertHeadTag = ({ selector, tag = "meta", attributes = {} }) => {
  if (typeof document === "undefined") return null;

  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(tag);
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    if (value) element.setAttribute(key, value);
  });

  return element;
};

const getVideoEmbedUrl = (url) => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.replace("/", "");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (parsedUrl.hostname.includes("vimeo.com")) {
      const videoId = parsedUrl.pathname.split("/").filter(Boolean).pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  } catch {
    return "";
  }
};

const getAssetUrl = (asset) => {
  if (!asset) return "";
  if (typeof asset === "string") return asset;
  return asset?.filePath || asset?.url || asset?.secure_url || asset?.secureUrl || asset?.path || asset?.src || asset?.file?.filePath || asset?.file?.url || "";
};

const getProjectAssets = (assets) => {
  const collectedAssets = [];

  const collectAsset = (value) => {
    if (!value) return;

    if (typeof value === "string") {
      collectedAssets.push(value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(collectAsset);
      return;
    }

    if (typeof value === "object") {
      if (getAssetUrl(value)) {
        collectedAssets.push(value);
        return;
      }

      Object.values(value).forEach(collectAsset);
    }
  };

  collectAsset(assets);
  return collectedAssets;
};

export const ProjectDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState("");
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const [isReporting, setIsReporting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [accessModal, setAccessModal] = useState(null);
  const [projectAccess, setProjectAccess] = useState(null);

  const { project, projects, isLoading } = useSelector((state) => state.project);
  const { favoriteResource } = useSelector((state) => state.favorite);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { comments: loadedComments } = useSelector((state) => state.comment);

  const projectAssets = useMemo(() => getProjectAssets(project?.assets), [project?.assets]);
  const coverImage = project?.thumbnail?.filePath || project?.thumbnail?.url || getAssetUrl(projectAssets[0]) || "../image/home/b1.webp";
  const galleryAssets = useMemo(() => {
    const uniqueAssets = [];
    const seenUrls = new Set();

    const addAsset = (asset) => {
      const assetUrl = getAssetUrl(asset);
      if (!assetUrl || seenUrls.has(assetUrl)) return;

      seenUrls.add(assetUrl);
      uniqueAssets.push(asset);
    };

    addAsset({
      filePath: coverImage,
      publicId: project?.thumbnail?.publicId || `${project?.title || "Project"} cover`,
    });
    projectAssets.forEach(addAsset);

    return uniqueAssets;
  }, [coverImage, project?.thumbnail?.publicId, project?.title, projectAssets]);
  const selectedAsset = galleryAssets[selectedAssetIndex] || galleryAssets[0];
  const selectedCoverImage = getAssetUrl(selectedAsset) || coverImage;
  const categoryTitle = project?.category?.title || "Project";
  const viewCount = getCount(project?.numOfViews);
  const backendCommentCount = project?.commentsCount ?? project?.totalComments ?? project?.commentCount ?? getCount(project?.comments);
  const loadedCommentCount = getCommentCount(loadedComments);
  const commentCount = loadedComments?.length ? loadedCommentCount : backendCommentCount;
  const price = getProjectDisplayPrice(project);
  const projectPosts = useMemo(() => projects?.posts || [], [projects?.posts]);
  const relatedProjects = useMemo(() => {
    if (!Array.isArray(projectPosts) || !projectPosts.length || !project?._id) return [];

    const projectTags = new Set(getListValues(project?.tags, "tag").map((tag) => tag.toLowerCase()));
    const projectFormats = new Set(getListValues(project?.formats, "format").map((format) => format.toLowerCase()));
    const projectCategory = (project?.category?.title || "").toLowerCase();

    return projectPosts
      .filter((item) => String(item?._id) !== String(project?._id))
      .map((item) => {
        const itemCategory = (item?.category?.title || "").toLowerCase();
        const itemTags = getListValues(item?.tags, "tag").map((tag) => tag.toLowerCase());
        const itemFormats = getListValues(item?.formats, "format").map((format) => format.toLowerCase());
        const score =
          (projectCategory && itemCategory === projectCategory ? 3 : 0) +
          itemTags.filter((tag) => projectTags.has(tag)).length * 2 +
          itemFormats.filter((format) => projectFormats.has(format)).length;

        return { ...item, relatedScore: score };
      })
      .filter((item) => item.relatedScore > 0)
      .sort((a, b) => b.relatedScore - a.relatedScore)
      .slice(0, 3);
  }, [project, projectPosts]);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `${project?.title || "Gorkcoder Project"}\n\n${project?.metaDescription || "Explore this project on Gorkcoder."}`;

  useEffect(() => {
    if (!project?._id || typeof document === "undefined") return undefined;

    const previousTitle = document.title;
    const pageTitle = project.seoTitle || `${project.title} | Gorkcoder Project`;
    const pageDescription = project.seoDescription || project.metaDescription || "Explore project previews, details, reviews, and resources on Gorkcoder.";
    const pageImage = project.ogImage || selectedCoverImage;
    const canonicalHref = project.canonicalUrl || shareUrl;

    document.title = pageTitle;
    upsertHeadTag({ selector: 'meta[name="description"]', attributes: { name: "description", content: pageDescription } });
    upsertHeadTag({ selector: 'meta[property="og:title"]', attributes: { property: "og:title", content: pageTitle } });
    upsertHeadTag({ selector: 'meta[property="og:description"]', attributes: { property: "og:description", content: pageDescription } });
    upsertHeadTag({ selector: 'meta[property="og:image"]', attributes: { property: "og:image", content: pageImage } });
    upsertHeadTag({ selector: 'meta[property="og:url"]', attributes: { property: "og:url", content: canonicalHref } });
    upsertHeadTag({ selector: 'link[rel="canonical"]', tag: "link", attributes: { rel: "canonical", href: canonicalHref } });

    return () => {
      document.title = previousTitle;
    };
  }, [project, selectedCoverImage, shareUrl]);

  const isFavorited = useMemo(() => {
    const projectFavorites = favoriteResource?.Project;
    if (Array.isArray(projectFavorites)) return projectFavorites.some((fav) => String(fav?._id || fav) === String(project?._id));
    return Boolean(projectFavorites?.[project?._id]);
  }, [favoriteResource, project?._id]);

  useEffect(() => {
    dispatch(getProject(slug));
  }, [slug, dispatch]);

  useEffect(() => {
    if (!projectPosts.length) {
      dispatch(getAllProject());
    }
  }, [dispatch, projectPosts.length]);

  useEffect(() => {
    if (!project?._id) return undefined;

    dispatch(COMMENT_RESET());
    dispatch(getComments(project._id));

    return () => {
      dispatch(COMMENT_RESET());
    };
  }, [project?._id, dispatch]);

  useEffect(() => {
    setSelectedAssetIndex(0);
  }, [project?._id]);

  useEffect(() => {
    if (!project?._id || !isLoggedIn) {
      setProjectAccess(null);
      return;
    }

    axios
      .get(`${REACT_APP_BACKEND_URL}/project/access/${project._id}`, { withCredentials: true })
      .then((response) => setProjectAccess(response.data || null))
      .catch(() => setProjectAccess(null));
  }, [project?._id, isLoggedIn]);

  const handleFilterClick = (filterType, value) => {
    if (!value) return;

    if (filterType === "category") {
      navigate(`/filter?category=${encodeURIComponent(value)}`);
    } else if (filterType === "tag") {
      navigate(`/filter?tag=${encodeURIComponent(value)}`);
    }
  };

  const handleAddToCart = () => {
    if (!project?._id) return;

    addCartItem(project, "Project");
    toast.success(`${project?.title || "Project"} added to cart.`);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Project link copied.");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy link.");
    }
  };

  const handleCopyCommand = async (command) => {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedCommand(command);
      toast.success("Setup command copied.");
      window.setTimeout(() => setCopiedCommand(""), 1600);
    } catch {
      toast.error("Could not copy command.");
    }
  };

  const handleDownloadProject = async () => {
    if (!project?._id) return;

    try {
      setIsDownloading(true);
      const response = await axios.get(`${REACT_APP_BACKEND_URL}/project/download/${project._id}`, { withCredentials: true });
      const downloadUrl = response.data?.url;
      setProjectAccess((current) =>
        current
          ? {
              ...current,
              license: response.data?.license || current.license,
              downloads: {
                ...(current.downloads || {}),
                used: response.data?.userDownloadCount ?? current.downloads?.used,
                remaining: response.data?.remainingDownloads ?? current.downloads?.remaining,
              },
            }
          : current,
      );

      if (!downloadUrl) {
        toast.info("No downloadable project file is attached yet.");
        return;
      }

      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      const message = error?.response?.data?.error || error?.response?.data?.message || "Please login or purchase this project to download files.";
      const status = error?.response?.status;
      setAccessModal({
        type: status === 402 || price > 0 ? "purchase" : "login",
        title: status === 402 || price > 0 ? "Purchase required" : "Login required",
        message,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReportProject = async () => {
    if (!project?._id || isReporting) return;

    const message = window.prompt("What is wrong with this project? Example: preview link is broken, wrong files, or payment access issue.");
    if (!message?.trim()) return;

    try {
      setIsReporting(true);
      await axios.post(
        `${REACT_APP_BACKEND_URL}/project/report/${project._id}`,
        {
          issueType: "other",
          message: message.trim(),
          pageUrl: shareUrl,
        },
        { withCredentials: true },
      );
      toast.success("Thanks, your project issue was submitted.");
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.response?.data?.message || "Could not submit the project issue.");
    } finally {
      setIsReporting(false);
    }
  };

  if (isLoading && !project?._id) {
    return (
      <section className="blog-details project-details relative overflow-hidden bg-[#111821] pb-20 pt-32">
        <div className="container">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-white/[0.035] p-4 backdrop-blur-2xl">
            <div className="h-96 animate-pulse rounded-[1.5rem] bg-white/[0.045]"></div>
            <div className="mx-auto mt-8 h-10 max-w-3xl animate-pulse rounded-full bg-white/[0.04]"></div>
            <div className="mx-auto mt-4 h-20 max-w-4xl animate-pulse rounded-2xl bg-white/[0.03]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="blog-details project-details isolate overflow-hidden bg-[#111821] pb-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[48rem] overflow-hidden">
          <img src={selectedCoverImage} alt={selectedAsset?.publicId || project?.title || "Project thumbnail"} className="h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111821]/50 via-[#111821]/78 to-[#111821]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#111821] via-[#111821]/45 to-[#111821]"></div>
          <div className="absolute inset-0 bg-black/24 backdrop-blur-[1.2px]"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#111821] to-transparent"></div>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-[120px]"></div>
        <div className="pointer-events-none absolute right-[-12rem] top-[36rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-fuchsia-400/10 blur-[120px]"></div>
        <div className="pointer-events-none absolute left-0 top-[35rem] -z-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="container relative z-10 pt-14">
          <div className="mt-10">
            <button
              onClick={() => handleFilterClick("category", categoryTitle)}
              className="group relative mb-6 inline-flex overflow-hidden rounded-full bg-white/[0.055] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/[0.05] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-teal-50"
            >
              <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/45 to-transparent"></span>
              {categoryTitle}
            </button>

            <div className="flex items-start gap-2">
              <h1 className="gardient-text text-3xl font-semibold leading-[1.08] tracking-[-0.05em] md:text-5xl lg:text-6xl">{project?.title}</h1>
              <VscVerifiedFilled size={25} className="mt-2 shrink-0 text-green-400" />
            </div>
            <p className="mt-5 max-w-5xl text-sm leading-7 textColor opacity-72 md:text-base">{project?.metaDescription}</p>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <MetaPill icon={<IoEye size={14} />} label={`${viewCount} views`} tone="bg-sky-300/10 text-sky-100 ring-sky-200/10" />
              <MetaPill icon={<FaComments size={13} />} label={`${commentCount} comments`} tone="bg-emerald-300/10 text-emerald-100 ring-emerald-200/10" />
              <MetaPill icon={<BsGrid1X2Fill size={13} />} label={`${project?.layout || "Responsive"} layout`} tone="bg-violet-300/10 text-violet-100 ring-violet-200/10" />
              <MetaPill icon={<FaShoppingCart size={13} />} label={formatProjectPrice(price)} tone="bg-amber-300/10 text-amber-100 ring-amber-200/10" />
              <MetaPill icon={<BsFillCalendarCheckFill size={13} />} label={<DateFormatter date={project?.createdAt} />} tone="bg-cyan-300/10 text-cyan-100 ring-cyan-200/10" />
              <div className="blog-action-group ml-0 md:ml-1">
                <LikeButton resourceType="project" contentId={project?._id} initialLikes={project?.likes || []} showCount className="blog-like-count-button" />
              </div>
              <div className="blog-action-group">
                <FavoriteButton resourceType="Project" resourceId={project?._id} initialFavorited={isFavorited} className="blog-bookmark-button" showLabel />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px] xl:grid-cols-[minmax(0,1fr)_340px]">
            <article className="rounded-[2rem] bg-gradient-to-br from-white/[0.09] via-white/[0.035] to-white/[0.018] p-5 shadow-[0_22px_70px_rgba(0,0,0,0.22)] backdrop-blur-md md:p-8 lg:p-10">
              <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-200/55">Project content</p>
                  <h2 className="mt-2 text-xl font-semibold textColor">View the full project</h2>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="rounded-full bg-white/[0.055] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.13em] textColor opacity-60">{galleryAssets.length || 1} previews</span>
                </div>
              </div>

              <ProjectPreview assets={galleryAssets} selectedIndex={selectedAssetIndex} onSelect={setSelectedAssetIndex} title={project?.title} />

              <ProjectPreviewVideo videoUrl={project?.previewVideoUrl} title={project?.title} />

              <div className="blog-rich-content mt-8 textColor">
                <RichTextRenderer content={project?.description || ""} />
              </div>

              <ProjectDetailEnhancements project={project} copiedCommand={copiedCommand} onCopyCommand={handleCopyCommand} />
            </article>

            <aside className="relative space-y-4 lg:sticky lg:top-24 lg:self-start">
              <SidePanel eyebrow="Project tools" title="Actions" visual>
                <ProjectActions project={project} price={price} onAddToCart={handleAddToCart} onCopy={handleCopyLink} copied={copied} onReport={handleReportProject} onDownload={handleDownloadProject} isReporting={isReporting} isDownloading={isDownloading} />
              </SidePanel>

              <SidePanel eyebrow="Core features" title="Feature checklist" visual>
                <ProjectHighlightList highlights={project?.highlights} />
              </SidePanel>

              <SidePanel eyebrow="Project info" title="Details" visual>
                <ProjectInfo project={project} />
              </SidePanel>

              <SidePanel eyebrow="Tech stack" title="Built with tools" visual>
                <ProjectStackPanel formats={project?.formats} />
              </SidePanel>

              <SidePanel eyebrow="Buyer guide" title="Access & support" visual>
                <ProjectBuyerAccessPanel project={project} price={price} access={projectAccess} isLoggedIn={isLoggedIn} onDownload={handleDownloadProject} isDownloading={isDownloading} />
              </SidePanel>

              <SidePanel eyebrow="Explore more" title="Related ideas" visual>
                {project?.tags?.length || project?.category?.title ? (
                  <div className="space-y-3">
                    <div className="rounded-[1.25rem] bg-white/[0.03] p-4 ring-1 ring-white/[0.038] backdrop-blur-xl">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-100/55">Discover similar</p>
                      <p className="mt-2 text-xs leading-5 textColor opacity-55">Tap a tag to explore more projects and resources with the same topic.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    {project?.category?.title && (
                      <button
                        className="group relative overflow-hidden rounded-full bg-white/[0.045] px-4 py-2 text-xs font-semibold text-teal-100/70 ring-1 ring-white/[0.045] transition hover:bg-white/[0.065] hover:text-teal-50"
                        onClick={() => handleFilterClick("category", project.category.title)}
                        type="button"
                      >
                        {project.category.title}
                      </button>
                    )}
                    {project?.tags?.map((tag) => {
                      const tagValue = tag?.tag || tag?.title || tag?.name || tag;
                      return (
                        <button
                          className="group relative overflow-hidden rounded-full bg-white/[0.035] px-4 py-2 text-xs font-semibold text-teal-100/65 ring-1 ring-white/[0.04] transition hover:bg-white/[0.055] hover:text-teal-50 hover:ring-white/[0.065]"
                          key={tag?._id || tagValue}
                          onClick={() => handleFilterClick("tag", tagValue)}
                        >
                          <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition group-hover:opacity-100"></span>
                          #{tagValue}
                        </button>
                      );
                    })}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[1.2rem] bg-white/[0.035] p-4 ring-1 ring-white/[0.035]">
                    <p className="text-xs leading-6 textColor opacity-55">No tags added yet.</p>
                  </div>
                )}
              </SidePanel>

              <SidePanel eyebrow="Send this" title="Share project" visual>
                <ShareProjectPanel project={project} coverImage={selectedCoverImage} shareUrl={shareUrl} shareText={shareText} copied={copied} onCopy={handleCopyLink} />
              </SidePanel>
            </aside>
          </div>

          <ProjectRelatedProjects projects={relatedProjects} fallbackCategory={categoryTitle} />

          {project?._id && (
            <div id="project-questions" className="mt-8 scroll-mt-28">
              <ProductQuestions productType="project" productId={project._id} isLoggedIn={isLoggedIn} />
            </div>
          )}

          {project?._id && (
            <div className="mt-8">
              <Comments resourceId={project._id} resourceType="Project" />
            </div>
          )}
        </div>
        <MobileProjectActionBar project={project} price={price} onAddToCart={handleAddToCart} onDownload={handleDownloadProject} isDownloading={isDownloading} />
        <DownloadAccessModal modal={accessModal} onClose={() => setAccessModal(null)} onLogin={() => navigate("/login")} onAddToCart={handleAddToCart} />
      </section>
    </>
  );
};

const MetaPill = ({ icon, label, tone = "bg-white/[0.045] textColor ring-white/[0.05]" }) => (
  <span className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-white/[0.052] px-3 text-xs font-normal textColor opacity-86 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] ring-1 ring-white/[0.04] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/[0.07] hover:opacity-95`}>
    {icon && <span className={`inline-flex size-6 items-center justify-center rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ${tone}`}>{icon}</span>}
    <span>{label}</span>
  </span>
);

const SidePanel = ({ eyebrow, title, children, visual = false }) => (
  <div className={`relative overflow-hidden rounded-[2rem] p-px shadow-[0_18px_55px_rgba(0,0,0,0.18)] ${visual ? "bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-white/[0.018]" : "bg-gradient-to-br from-white/[0.075] via-white/[0.028] to-white/[0.014]"}`}>
    <div className={`relative overflow-hidden rounded-[1.95rem] p-5 backdrop-blur-2xl md:p-6 ${visual ? "bg-[#111820]/78" : "bg-[#151b23]/92"}`}>
      <span className="pointer-events-none absolute -right-24 -top-24 size-52 rounded-full bg-teal-200/[0.025] blur-3xl"></span>
      <span className="pointer-events-none absolute -bottom-28 left-1/2 size-56 -translate-x-1/2 rounded-full bg-white/[0.018] blur-3xl"></span>
      {visual && <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent"></span>}
      <div className="relative mb-5">
        <p className="inline-flex rounded-full bg-white/[0.035] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-teal-100/55 ring-1 ring-white/[0.04]">{eyebrow}</p>
        <h2 className="mt-2 text-xl font-semibold textColor">{title}</h2>
      </div>
      <div className="relative">{children}</div>
    </div>
  </div>
);

const DownloadAccessModal = ({ modal, onClose, onLogin, onAddToCart }) => {
  if (!modal) return null;

  const isPurchase = modal.type === "purchase";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#070b10]/78 p-4 backdrop-blur-xl">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close access modal"></button>
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] bg-gradient-to-br from-white/[0.12] via-white/[0.055] to-white/[0.025] p-px shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <div className="relative overflow-hidden rounded-[1.95rem] bg-[#111821]/95 p-6 text-center ring-1 ring-white/[0.06]">
          <span className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-teal-300/[0.055] blur-3xl"></span>
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-white/[0.055] text-teal-100/75 ring-1 ring-white/[0.07]">
            {isPurchase ? <FaShoppingCart size={20} /> : <FaFileDownload size={20} />}
          </span>
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-100/55">{isPurchase ? "Paid access" : "Account access"}</p>
          <h3 className="mt-2 text-2xl font-semibold textColor">{modal.title}</h3>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 textColor opacity-58">{modal.message}</p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                if (isPurchase) onAddToCart();
                else onLogin();
                onClose();
              }}
              className="flex h-12 flex-1 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#071319] shadow-[0_16px_38px_rgba(255,255,255,0.14)]"
            >
              {isPurchase ? "Add to cart" : "Login now"}
            </button>
            <button type="button" onClick={onClose} className="flex h-12 flex-1 items-center justify-center rounded-full bg-white/[0.045] px-5 text-sm font-semibold textColor ring-1 ring-white/[0.055]">
              Back to project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectPreview = ({ assets, selectedIndex, onSelect, title }) => {
  const previewAssets = assets.length ? assets : [];
  const mainAsset = previewAssets[selectedIndex] || previewAssets[0];
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLightboxImageLoading, setIsLightboxImageLoading] = useState(false);
  const visibleSlides = 4;
  const maxCarouselIndex = Math.max(previewAssets.length - visibleSlides, 0);

  const selectPreviousAsset = () => {
    if (!previewAssets.length) return;
    onSelect(selectedIndex === 0 ? previewAssets.length - 1 : selectedIndex - 1);
  };

  const selectNextAsset = () => {
    if (!previewAssets.length) return;
    onSelect(selectedIndex === previewAssets.length - 1 ? 0 : selectedIndex + 1);
  };

  useEffect(() => {
    if (selectedIndex < carouselIndex) {
      setCarouselIndex(selectedIndex);
      return;
    }

    if (selectedIndex >= carouselIndex + visibleSlides) {
      setCarouselIndex(Math.min(selectedIndex - visibleSlides + 1, maxCarouselIndex));
    }
  }, [carouselIndex, maxCarouselIndex, selectedIndex]);

  useEffect(() => {
    setCarouselIndex(0);
  }, [previewAssets.length]);

  useEffect(() => {
    if (isLightboxOpen) setIsLightboxImageLoading(true);
  }, [isLightboxOpen, selectedIndex]);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsLightboxOpen(false);
      if (event.key === "ArrowLeft") selectPreviousAsset();
      if (event.key === "ArrowRight") selectNextAsset();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen, selectedIndex, previewAssets.length]);

  const handlePrev = () => {
    setCarouselIndex((current) => Math.max(current - 1, 0));
  };

  const handleNext = () => {
    setCarouselIndex((current) => Math.min(current + 1, maxCarouselIndex));
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-teal-200/18 via-white/[0.055] to-violet-300/12 p-px shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
        <div className="relative overflow-hidden rounded-[1.78rem] bg-[#111821]/78 p-2">
          <span className="pointer-events-none absolute left-6 top-6 z-10 rounded-full bg-black/35 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/75 ring-1 ring-white/10 backdrop-blur-xl">
            Preview {String(selectedIndex + 1).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute right-6 top-6 z-10 rounded-full bg-black/35 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 ring-1 ring-white/10 backdrop-blur-xl transition hover:bg-white/15 hover:text-white"
          >
            Fullscreen
          </button>
          <span className="pointer-events-none absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"></span>
          <button type="button" onClick={() => setIsLightboxOpen(true)} className="block w-full">
            <img src={getAssetUrl(mainAsset)} alt={mainAsset?.publicId || title} className="h-[360px] w-full rounded-[1.42rem] object-cover md:h-[520px]" />
          </button>
          <div className="pointer-events-none absolute inset-2 rounded-[1.42rem] bg-gradient-to-t from-[#111821]/18 via-transparent to-white/[0.035]"></div>
        </div>
      </div>
      {previewAssets.length > 1 && (
        <div className="relative rounded-[1.45rem] bg-white/[0.025] p-3 ring-1 ring-white/[0.035]">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-100/55">Project gallery</p>
              <p className="mt-1 text-xs textColor opacity-45">Click any preview to switch the main image</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden rounded-full bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] textColor opacity-55 ring-1 ring-white/[0.04] sm:inline-flex">
                {previewAssets.length} images
              </span>
              <button
                type="button"
                onClick={handlePrev}
                disabled={carouselIndex === 0}
                className="flex size-9 items-center justify-center rounded-full bg-white/[0.045] textColor ring-1 ring-white/[0.055] transition hover:bg-white/[0.075] disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Previous project preview"
              >
                <BsArrowLeft size={15} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={carouselIndex === maxCarouselIndex}
                className="flex size-9 items-center justify-center rounded-full bg-white/[0.045] textColor ring-1 ring-white/[0.055] transition hover:bg-white/[0.075] disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Next project preview"
              >
                <BsArrowRight size={15} />
              </button>
            </div>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-0 top-[4.65rem] z-10 w-10 bg-gradient-to-r from-[#151b23] to-transparent"></div>
          <div className="pointer-events-none absolute bottom-3 right-0 top-[4.65rem] z-10 w-14 bg-gradient-to-l from-[#151b23] to-transparent"></div>
          <div className="overflow-hidden px-1 pb-1">
            <div className="flex gap-3 transition-transform duration-500 ease-out" style={{ transform: `translateX(-${carouselIndex * 13.75}rem)` }}>
            {previewAssets.map((asset, index) => {
              const isActive = selectedIndex === index;

              return (
                <button
                  type="button"
                  key={asset?.publicId || asset?.filePath || index}
                  onClick={() => onSelect(index)}
                  className={`group relative h-24 w-40 shrink-0 overflow-hidden rounded-[1.15rem] p-1.5 text-left transition duration-300 md:h-28 md:w-52 ${
                    isActive
                      ? "bg-gradient-to-br from-teal-200/35 via-teal-200/10 to-violet-300/20 ring-1 ring-teal-200/50 shadow-[0_16px_45px_rgba(45,212,191,0.14)]"
                      : "bg-white/[0.03] ring-1 ring-white/[0.035] hover:-translate-y-0.5 hover:bg-white/[0.055] hover:ring-white/[0.08]"
                  }`}
                >
                  <img src={getAssetUrl(asset)} alt={asset?.publicId || `${title} preview ${index + 1}`} className="h-full w-full rounded-[0.85rem] object-cover transition duration-300 group-hover:scale-[1.03]" />
                  <span className="absolute inset-1.5 rounded-[0.85rem] bg-gradient-to-t from-[#111821]/42 via-transparent to-white/[0.04]"></span>
                  <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] backdrop-blur-xl ${isActive ? "bg-teal-200 text-[#102027]" : "bg-black/45 text-white/75"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-3 right-3 inline-flex size-7 items-center justify-center rounded-full bg-teal-200 text-[#102027] shadow-[0_10px_28px_rgba(45,212,191,0.26)]">
                      <IoCheckmarkCircle size={16} />
                    </span>
                  )}
                </button>
              );
            })}
            </div>
          </div>
        </div>
      )}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#070b10]/92 p-4 backdrop-blur-2xl">
          <button type="button" className="absolute inset-0 cursor-default" onClick={() => setIsLightboxOpen(false)} aria-label="Close preview"></button>
          <div className="relative z-10 w-full max-w-7xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-100/55">Project preview</p>
                <h3 className="mt-1 text-lg font-semibold textColor">{title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/[0.055] px-4 py-2 text-xs font-semibold textColor ring-1 ring-white/[0.06]">
                  {selectedIndex + 1} / {previewAssets.length}
                </span>
                <button type="button" onClick={() => setIsLightboxOpen(false)} className="flex size-11 items-center justify-center rounded-full bg-white/[0.055] text-xl textColor ring-1 ring-white/[0.06] transition hover:bg-white/[0.09]">
                  ×
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] bg-white/[0.045] p-2 ring-1 ring-white/[0.07]">
              {isLightboxImageLoading && <div className="absolute inset-2 animate-pulse rounded-[1.6rem] bg-white/[0.055]"></div>}
              <img src={getAssetUrl(mainAsset)} alt={mainAsset?.publicId || title} onLoad={() => setIsLightboxImageLoading(false)} className={`max-h-[76vh] w-full rounded-[1.6rem] object-contain transition duration-300 ${isLightboxImageLoading ? "opacity-0" : "opacity-100"}`} />
              {previewAssets.length > 1 && (
                <>
                  <button type="button" onClick={selectPreviousAsset} className="absolute left-5 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 textColor ring-1 ring-white/10 backdrop-blur-xl transition hover:bg-white/15">
                    <BsArrowLeft size={18} />
                  </button>
                  <button type="button" onClick={selectNextAsset} className="absolute right-5 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 textColor ring-1 ring-white/10 backdrop-blur-xl transition hover:bg-white/15">
                    <BsArrowRight size={18} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectPreviewVideo = ({ videoUrl, title }) => {
  const embedUrl = getVideoEmbedUrl(videoUrl);

  if (!embedUrl) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-white/[0.018] p-px shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
      <div className="relative rounded-[1.65rem] bg-[#111820]/82 p-4 backdrop-blur-2xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-100/55">Video walkthrough</p>
            <h3 className="mt-1 text-lg font-semibold textColor">Watch the project in action</h3>
          </div>
          <a href={videoUrl} target="_blank" rel="noreferrer" className="rounded-full bg-white/[0.045] px-4 py-2 text-[10px] font-semibold textColor opacity-65 ring-1 ring-white/[0.045]">
            Open video
          </a>
        </div>
        <div className="aspect-video overflow-hidden rounded-[1.35rem] bg-black/35 ring-1 ring-white/[0.05]">
          <iframe src={embedUrl} title={`${title || "Project"} preview video`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
      </div>
    </div>
  );
};

const getListValues = (items = [], key) => {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => (typeof item === "string" ? item : item?.[key] || item?.title || item?.name || item?.tag))
    .filter(Boolean);
};

const ProjectDetailEnhancements = ({ project, copiedCommand, onCopyCommand }) => {
  const hasDownload = Boolean(project?.resourceFile?.url || project?.resourceFile?.file || Object.keys(project?.assets || {}).length);

  const deliverables = [
    { icon: <FaCode />, title: "Source code", text: "Clean project files structured for learning, customization, and real implementation." },
    { icon: <BsGrid1X2Fill />, title: "Responsive UI", text: `${project?.layout || "Responsive"} layout with polished screens and reusable interface sections.` },
    { icon: <IoEye />, title: "Visual previews", text: "Project screenshots and gallery previews help you inspect the design before using it." },
    { icon: <FaFileDownload />, title: "Download ready", text: hasDownload ? "Assets or resource files are attached where available." : "Resource files can be attached from the admin panel when ready." },
    { icon: <BsPatchCheck />, title: "Production notes", text: "Includes implementation details, structure, and setup guidance for smoother handoff." },
    { icon: <FaRegLifeRing />, title: "Basic support", text: "You can ask setup or pre-purchase questions from the project question section." },
  ];

  const setupSteps = [
    "Download or open the project package after access is available.",
    "Install dependencies for the frontend and backend where included.",
    "Create the environment file and add required API, database, or payment keys.",
    "Run the backend service first, then start the frontend app.",
    "Review the project notes and customize branding, content, and images.",
  ];

  const requirements = [
    "Node.js and npm installed on your device.",
    "MongoDB or configured database connection if the project includes backend APIs.",
    "Cloudinary, Stripe, eSewa, or other keys only when that feature is used.",
    "Basic React, Tailwind, and Express knowledge for customization.",
  ];

  return (
    <div className="mt-10 space-y-5">
      <ProjectSectionHeader
        eyebrow="Project guide"
        title="Everything included for a smoother build"
        text="A compact buyer/developer guide with deliverables, setup steps, requirements, support, version notes, and usage rules."
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {deliverables.map((item) => (
          <ProjectMiniCard key={item.title} icon={item.icon} title={item.title} text={item.text} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ProjectGlassBlock eyebrow="Setup flow" title="Installation steps">
          <div className="space-y-3">
            {setupSteps.map((step, index) => (
              <ProjectStepItem key={step} number={index + 1} text={step} />
            ))}
          </div>
        </ProjectGlassBlock>

        <ProjectGlassBlock eyebrow="Before you start" title="Requirements">
          <div className="space-y-2">
            {requirements.map((requirement) => (
              <ProjectChecklistItem key={requirement} text={requirement} subtle />
            ))}
          </div>
        </ProjectGlassBlock>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <ProjectPolicyCard
          title="License note"
          text={project?.license || "Use this project for learning, portfolio practice, and personal/client implementation. Do not resell or redistribute the original package as your own template."}
        />
        <ProjectPolicyCard
          title="Refund eligibility"
          text={project?.refundPolicy || "Refund requests are reviewed when files are inaccessible, incorrect, duplicated, or the delivered project is not as described."}
        />
        <ProjectPolicyCard title="Version info" text="Latest project edit and content update." date={project?.updatedAt || project?.createdAt} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ProjectIncludedFiles project={project} hasDownload={hasDownload} />
        <ProjectSetupCommands copiedCommand={copiedCommand} onCopyCommand={onCopyCommand} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ProjectDemoCredentials project={project} />
        <ProjectChangelog project={project} />
      </div>

      <ProjectFAQ project={project} hasDownload={hasDownload} />
    </div>
  );
};

const ProjectSectionHeader = ({ eyebrow, title, text }) => (
  <div className="rounded-[1.7rem] bg-white/[0.03] p-5 ring-1 ring-white/[0.04] backdrop-blur-xl">
    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-100/55">{eyebrow}</p>
    <h2 className="mt-2 text-2xl font-semibold textColor">{title}</h2>
    <p className="mt-2 max-w-3xl text-sm leading-6 textColor opacity-58">{text}</p>
  </div>
);

const ProjectMiniCard = ({ icon, title, text }) => (
  <div className="group rounded-[1.35rem] bg-white/[0.028] p-4 ring-1 ring-white/[0.035] backdrop-blur-xl transition hover:bg-white/[0.048]">
    <span className="flex size-11 items-center justify-center rounded-full bg-white/[0.045] text-teal-100/70 ring-1 ring-white/[0.04] transition group-hover:text-teal-50">{icon}</span>
    <h3 className="mt-4 text-sm font-semibold textColor">{title}</h3>
    <p className="mt-2 text-xs leading-5 textColor opacity-55">{text}</p>
  </div>
);

const ProjectGlassBlock = ({ eyebrow, title, children }) => (
  <div className="rounded-[1.7rem] bg-white/[0.028] p-5 ring-1 ring-white/[0.04] backdrop-blur-xl">
    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-100/50">{eyebrow}</p>
    <h3 className="mt-2 text-lg font-semibold textColor">{title}</h3>
    <div className="mt-4">{children}</div>
  </div>
);

const ProjectChecklistItem = ({ text, subtle = false }) => (
  <div className="flex gap-3 rounded-[1.05rem] bg-white/[0.025] p-3 ring-1 ring-white/[0.032]">
    <IoCheckmarkCircle size={17} className={`mt-0.5 shrink-0 ${subtle ? "text-teal-100/48" : "text-teal-100/68"}`} />
    <p className="text-xs leading-5 textColor opacity-65">{text}</p>
  </div>
);

const ProjectStepItem = ({ number, text }) => (
  <div className="flex gap-3 rounded-[1.1rem] bg-white/[0.025] p-3 ring-1 ring-white/[0.032]">
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.045] text-[10px] font-semibold text-teal-100/60 ring-1 ring-white/[0.04]">{String(number).padStart(2, "0")}</span>
    <p className="pt-1 text-xs leading-5 textColor opacity-65">{text}</p>
  </div>
);

const ProjectPolicyCard = ({ title, text, date }) => (
  <div className="rounded-[1.35rem] bg-white/[0.028] p-4 ring-1 ring-white/[0.035] backdrop-blur-xl">
    <p className="text-sm font-semibold textColor">{title}</p>
    <p className="mt-2 text-xs leading-5 textColor opacity-55">{text}</p>
    {date && (
      <p className="mt-3 inline-flex rounded-full bg-white/[0.035] px-3 py-1.5 text-[10px] font-semibold text-teal-100/55 ring-1 ring-white/[0.035]">
        <DateFormatter date={date} />
      </p>
    )}
  </div>
);

const ProjectEmptyNote = ({ text }) => <p className="rounded-[1.1rem] bg-white/[0.025] p-3 text-xs leading-5 textColor opacity-50 ring-1 ring-white/[0.03]">{text}</p>;

const ProjectIncludedFiles = ({ project, hasDownload }) => {
  const formatNames = getListValues(project?.formats, "format").map((item) => item.toLowerCase());
  const hasBackend = formatNames.some((item) => ["node", "express", "mongodb", "backend", "mern"].includes(item));
  const dashboardFiles = Array.isArray(project?.includedFiles)
    ? project.includedFiles
        .map((file) => ({ title: file?.title, text: file?.text || "Included in the project package.", active: true }))
        .filter((file) => file.title || file.text)
    : [];
  const includedFiles = dashboardFiles.length ? dashboardFiles : [
    { title: "Frontend source", text: "React UI pages, components, styles, and reusable layout sections.", active: true },
    { title: "Preview assets", text: "Project screenshots and uploaded visual resources.", active: Boolean(project?.assets && Object.keys(project.assets || {}).length) },
    { title: "Backend source", text: "API, models, routes, and server setup where the package includes backend work.", active: hasBackend },
    { title: "Environment guide", text: "Keys and `.env` values you may need for local setup.", active: true },
    { title: "Database structure", text: "MongoDB/model structure or setup notes when backend is available.", active: hasBackend },
    { title: "Download package", text: "Attached resource file or downloadable bundle.", active: hasDownload },
  ];

  return (
    <ProjectGlassBlock eyebrow="Package contents" title="Included files">
      <div className="grid gap-2">
        {includedFiles.map((file) => (
          <div key={file.title} className="flex items-start gap-3 rounded-[1.05rem] bg-white/[0.025] p-3 ring-1 ring-white/[0.032]">
            <span className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ring-1 ${file.active ? "bg-teal-300/[0.08] text-teal-100/75 ring-teal-100/10" : "bg-white/[0.035] textColor opacity-35 ring-white/[0.035]"}`}>
              <IoCheckmarkCircle size={16} />
            </span>
            <span>
              <span className="block text-xs font-semibold textColor">{file.title}</span>
              <span className="mt-1 block text-[11px] leading-5 textColor opacity-52">{file.text}</span>
            </span>
          </div>
        ))}
      </div>
    </ProjectGlassBlock>
  );
};

const ProjectSetupCommands = ({ copiedCommand, onCopyCommand }) => {
  const commands = ["npm install", "npm run dev", "npm run build"];

  return (
    <ProjectGlassBlock eyebrow="Developer shortcuts" title="Copy setup commands">
      <div className="space-y-3">
        {commands.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => onCopyCommand(command)}
            className="group flex w-full items-center justify-between gap-3 rounded-[1.1rem] bg-[#0b1118]/52 p-3 text-left ring-1 ring-white/[0.035] transition hover:bg-white/[0.04] hover:ring-white/[0.065]"
          >
            <code className="text-xs font-normal text-teal-100/78">{command}</code>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.045] px-3 py-1.5 text-[10px] font-semibold textColor opacity-58 ring-1 ring-white/[0.04] transition group-hover:opacity-80">
              <BsClipboard size={12} />
              {copiedCommand === command ? "Copied" : "Copy"}
            </span>
          </button>
        ))}
        <p className="text-[11px] leading-5 textColor opacity-45">Use these as a quick starting point. Some projects may need separate frontend/backend commands from the description.</p>
      </div>
    </ProjectGlassBlock>
  );
};

const ProjectDemoCredentials = ({ project }) => {
  const demoCredentials = project?.demoCredentials || project?.credentials || {};
  const credentialRows = [
    { label: "Admin email", value: demoCredentials?.adminEmail || demoCredentials?.admin?.email },
    { label: "Admin password", value: demoCredentials?.adminPassword || demoCredentials?.admin?.password },
    { label: "User email", value: demoCredentials?.userEmail || demoCredentials?.user?.email },
    { label: "User password", value: demoCredentials?.userPassword || demoCredentials?.user?.password },
  ].filter((row) => row.value);

  return (
    <ProjectGlassBlock eyebrow="Demo access" title="Demo credentials">
      {credentialRows.length && project?.showDemoCredentials ? (
        <div className="grid gap-2">
          {credentialRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-3 rounded-[1.05rem] bg-white/[0.025] p-3 ring-1 ring-white/[0.032]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] textColor opacity-45">{row.label}</span>
              <span className="truncate text-xs font-normal text-teal-100/70">{row.value}</span>
            </div>
          ))}
        </div>
      ) : credentialRows.length ? (
        <ProjectEmptyNote text="Demo credentials are saved, but hidden publicly. Enable “Show demo credentials” from the dashboard when the demo account is safe to share." />
      ) : (
        <ProjectEmptyNote text="No demo login added yet. If this project has demo admin/user access, add credentials from the dashboard and they will show here." />
      )}
    </ProjectGlassBlock>
  );
};

const ProjectChangelog = ({ project }) => {
  const changelogItems = Array.isArray(project?.changelog) && project.changelog.length ? project.changelog : [
    {
      version: project?.version || "v1.0",
      title: "Project published",
      date: project?.updatedAt || project?.createdAt,
      text: "Initial project release with preview, description, stack, support, and access information.",
    },
  ];

  return (
    <ProjectGlassBlock eyebrow="Release notes" title="Changelog">
      <div className="space-y-3">
        {changelogItems.slice(0, 4).map((item, index) => (
          <div key={item?._id || item?.version || index} className="rounded-[1.1rem] bg-white/[0.025] p-3 ring-1 ring-white/[0.032]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold textColor">{item?.version || `v1.${index}`}</p>
              <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-semibold text-teal-100/55 ring-1 ring-white/[0.035]">
                <DateFormatter date={item?.date || project?.updatedAt || project?.createdAt} />
              </span>
            </div>
            <p className="mt-2 text-xs font-semibold textColor opacity-70">{item?.title || "Project update"}</p>
            <p className="mt-1 text-[11px] leading-5 textColor opacity-52">{item?.text || item?.description || "Project content and resources updated."}</p>
          </div>
        ))}
      </div>
    </ProjectGlassBlock>
  );
};

const ProjectFAQ = ({ project, hasDownload }) => {
  const faqs = [
    {
      question: "Do I get the source code?",
      answer: hasDownload ? "Yes. Available project files or resources are connected with this project where the admin has uploaded them." : "The project page is ready for source files. Add the downloadable package from the admin panel when it is prepared.",
    },
    {
      question: "Is the backend included?",
      answer: getListValues(project?.formats, "format").some((item) => ["node", "express", "mongodb", "backend", "mern"].includes(item.toLowerCase()))
        ? "This project appears to include backend-related technologies. Check the project description for exact setup details."
        : "Backend availability depends on the project package. Review the description and ask from the question section if needed.",
    },
    {
      question: "Can I customize this project?",
      answer: "Yes. You can change branding, colors, content, layouts, API keys, and images for learning, portfolio, or client-style implementation.",
    },
    {
      question: "Can I use it commercially?",
      answer: "You can use it for personal/client implementation, but do not resell or redistribute the original package as your own template.",
    },
  ];

  return (
    <ProjectGlassBlock eyebrow="Quick answers" title="Project FAQ">
      <div className="grid gap-3 md:grid-cols-2">
        {faqs.map((faq) => (
          <div key={faq.question} className="rounded-[1.2rem] bg-white/[0.025] p-4 ring-1 ring-white/[0.035]">
            <p className="text-sm font-semibold textColor">{faq.question}</p>
            <p className="mt-2 text-xs leading-5 textColor opacity-56">{faq.answer}</p>
          </div>
        ))}
      </div>
    </ProjectGlassBlock>
  );
};

const ProjectRelatedProjects = ({ projects = [], fallbackCategory }) => {
  if (!projects.length) {
    return (
      <div className="mt-8 rounded-[2rem] bg-white/[0.025] p-6 ring-1 ring-white/[0.035] backdrop-blur-xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-100/55">Related projects</p>
        <h2 className="mt-2 text-xl font-semibold textColor">More {fallbackCategory || "project"} ideas will appear here</h2>
        <p className="mt-2 text-sm leading-6 textColor opacity-55">Add more projects with matching category, tags, or tools to show automatic related suggestions.</p>
      </div>
    );
  }

  return (
    <section className="mt-8 rounded-[2rem] bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.015] p-px shadow-[0_20px_70px_rgba(0,0,0,0.18)]">
      <div className="rounded-[1.95rem] bg-[#111820]/82 p-5 backdrop-blur-2xl md:p-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-100/55">Related projects</p>
            <h2 className="mt-2 text-xl font-semibold textColor">Find similar project ideas</h2>
          </div>
          <span className="rounded-full bg-white/[0.04] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] textColor opacity-55 ring-1 ring-white/[0.04]">
            {projects.length} matches
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((item) => (
            <NavLink key={item?._id || item?.slug} to={`/project-details/${item?.slug}`} className="group overflow-hidden rounded-[1.45rem] bg-white/[0.028] p-2 ring-1 ring-white/[0.035] transition hover:-translate-y-1 hover:bg-white/[0.05] hover:ring-white/[0.08]">
              <div className="relative h-40 overflow-hidden rounded-[1.15rem] bg-white/[0.035]">
                <img src={item?.thumbnail?.filePath || item?.thumbnail?.url || "../image/home/b1.webp"} alt={item?.title || "Related project"} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111821] via-transparent to-black/10"></div>
                <span className="absolute bottom-3 left-3 rounded-full bg-black/35 px-3 py-1.5 text-[10px] font-semibold text-white/70 ring-1 ring-white/10 backdrop-blur-xl">{item?.category?.title || "Project"}</span>
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-semibold leading-5 textColor">{item?.title}</h3>
                <p className="mt-2 line-clamp-2 text-xs leading-5 textColor opacity-52">{item?.metaDescription || "Explore this related project."}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <FormatStack formats={item?.formats?.slice(0, 5)} />
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.05] textColor ring-1 ring-white/[0.05] transition group-hover:translate-x-0.5">
                    <BsArrowRight size={14} />
                  </span>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectActions = ({ project, price, onAddToCart, onCopy, copied, onReport, onDownload, isReporting, isDownloading }) => {
  const resourceMeta = getProjectResourceMeta(project);

  return (
  <div className="space-y-3">
    <div className="relative overflow-hidden rounded-[1.35rem] bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ring-1 ring-white/[0.04] backdrop-blur-2xl">
      <span className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-white/[0.025] blur-2xl"></span>
      <p className="relative text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-100/55">Project access</p>
      <div className="relative mt-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-2xl font-semibold textColor">{formatProjectPrice(price)}</p>
          <p className="mt-1 text-xs textColor opacity-50">Preview, review, then add to cart.</p>
        </div>
        <span className="rounded-full bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] textColor opacity-55 ring-1 ring-white/[0.04]">
          {price > 0 ? "Paid" : "Free"}
        </span>
      </div>
    </div>

    {project?.urllink && (
      <NavLink target="_blank" to={project.urllink} className="group flex items-center gap-3 rounded-[1.2rem] bg-white/[0.028] p-3 ring-1 ring-white/[0.035] backdrop-blur-xl transition hover:bg-white/[0.05] hover:ring-white/[0.065]">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/[0.045] text-teal-100/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/[0.04]">
          <BsArrowRight size={16} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold textColor">Live preview</span>
          <span className="block text-[10px] textColor opacity-45">Open project demo</span>
        </span>
        <span className="text-xs textColor opacity-35 transition group-hover:translate-x-0.5 group-hover:opacity-70">Open</span>
      </NavLink>
    )}

    <button type="button" onClick={onAddToCart} className="group flex w-full items-center gap-3 rounded-[1.2rem] bg-gradient-to-r from-teal-200 via-cyan-200 to-white p-3 text-left text-[#071319] shadow-[0_18px_45px_rgba(45,212,191,0.18)] ring-1 ring-white/25 transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(45,212,191,0.24)]">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#071319]/10 text-[#071319] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] ring-1 ring-[#071319]/10">
        <FaShoppingCart size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">Add to cart</span>
        <span className="block text-[10px] opacity-65">{formatProjectPrice(price)}</span>
      </span>
      <span className="text-xs font-semibold opacity-65 transition group-hover:translate-x-0.5 group-hover:opacity-90">Add</span>
    </button>

    <button type="button" onClick={onDownload} disabled={isDownloading} className="group flex w-full items-center gap-3 rounded-[1.2rem] bg-white/[0.028] p-3 text-left ring-1 ring-white/[0.035] backdrop-blur-xl transition hover:bg-white/[0.05] hover:ring-white/[0.065] disabled:cursor-not-allowed disabled:opacity-60">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/[0.045] text-teal-100/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ring-1 ring-white/[0.04]">
        <FaFileDownload size={14} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold textColor">{isDownloading ? "Preparing file" : "Download files"}</span>
        <span className="block truncate text-[10px] textColor opacity-45">{resourceMeta.label} • {price > 0 ? "Paid access" : "Login required"}</span>
      </span>
      <span className="text-xs textColor opacity-35 transition group-hover:translate-x-0.5 group-hover:opacity-70">Open</span>
    </button>

    <ActionButton className="blog-glass-action flexC !h-11 w-full gap-2 !px-4">
      <AiOutlineLink size={18} className="text-gray-200" />
      <button type="button" onClick={onCopy}>
        {copied ? "Copied link" : "Copy link"}
      </button>
    </ActionButton>

    <div className="grid grid-cols-2 gap-2">
      <a href="#project-questions" className="group flex min-h-20 flex-col justify-between rounded-[1.15rem] bg-white/[0.026] p-3 ring-1 ring-white/[0.032] backdrop-blur-xl transition hover:bg-white/[0.05] hover:ring-white/[0.06]">
        <span className="flex size-9 items-center justify-center rounded-full bg-teal-300/[0.08] text-teal-100/70 ring-1 ring-teal-100/10">
          <FaQuestionCircle size={14} />
        </span>
        <span>
          <span className="block text-xs font-semibold textColor">Ask first</span>
          <span className="mt-0.5 block text-[10px] leading-4 textColor opacity-45">Question before buying</span>
        </span>
      </a>
      <button type="button" onClick={onReport} disabled={isReporting} className="group flex min-h-20 flex-col justify-between rounded-[1.15rem] bg-white/[0.026] p-3 text-left ring-1 ring-white/[0.032] backdrop-blur-xl transition hover:bg-white/[0.05] hover:ring-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60">
        <span className="flex size-9 items-center justify-center rounded-full bg-rose-300/[0.08] text-rose-100/70 ring-1 ring-rose-100/10">
          <FaBug size={14} />
        </span>
        <span>
          <span className="block text-xs font-semibold textColor">{isReporting ? "Submitting..." : "Report issue"}</span>
          <span className="mt-0.5 block text-[10px] leading-4 textColor opacity-45">Broken link or files</span>
        </span>
      </button>
    </div>
  </div>
  );
};

const MobileProjectActionBar = ({ project, price, onAddToCart, onDownload, isDownloading }) => {
  if (!project?._id) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[998] rounded-[1.4rem] bg-white/[0.075] p-2 shadow-[0_18px_55px_rgba(0,0,0,0.34)] ring-1 ring-white/[0.08] backdrop-blur-2xl lg:hidden">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1 px-2">
          <p className="truncate text-xs font-semibold textColor">{project?.title}</p>
          <p className="mt-0.5 text-[11px] font-semibold text-teal-100/65">{formatProjectPrice(price)}</p>
        </div>
        {project?.urllink && (
          <NavLink target="_blank" to={project.urllink} className="flex h-11 shrink-0 items-center justify-center rounded-full bg-white/[0.055] px-4 text-xs font-semibold textColor ring-1 ring-white/[0.055]">
            Preview
          </NavLink>
        )}
        <button type="button" onClick={onDownload} disabled={isDownloading} className="flex h-11 shrink-0 items-center justify-center rounded-full bg-white/[0.055] px-4 text-xs font-semibold textColor ring-1 ring-white/[0.055] disabled:opacity-50">
          <FaFileDownload size={13} />
        </button>
        <button type="button" onClick={onAddToCart} className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-[#071319] shadow-[0_12px_30px_rgba(255,255,255,0.14)]">
          <FaShoppingCart size={13} />
          Cart
        </button>
      </div>
    </div>
  );
};

const ProjectInfo = ({ project }) => {
  const resourceMeta = getProjectResourceMeta(project);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        <InfoRow icon={<AiOutlineUpload />} label="Updated" value={<DateFormatter date={project?.updatedAt} />} />
        <InfoRow icon={<BsFillCalendarCheckFill />} label="Published" value={<DateFormatter date={project?.createdAt} />} />
      </div>
      <InfoRow icon={<BsGrid1X2Fill />} label="Layout" value={project?.layout || "-"} wide />
      <InfoRow icon={<FaFileDownload />} label={`Resource • ${resourceMeta.type}`} value={resourceMeta.label} wide />
      <div className="rounded-[1.15rem] bg-white/[0.026] p-3 ring-1 ring-white/[0.032]">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] textColor opacity-42">Download info</span>
          <span className="rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-semibold text-teal-100/55 ring-1 ring-white/[0.035]">{project?.downloadCount || 0} downloads</span>
        </div>
        <p className="mt-2 truncate text-xs textColor opacity-58">{resourceMeta.detail}</p>
      </div>
      <div className="rounded-[1.25rem] bg-white/[0.03] p-4 ring-1 ring-white/[0.038] backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] textColor opacity-45">Formats</p>
          <span className="rounded-full bg-white/[0.045] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] textColor opacity-45">{project?.formats?.length || 0} tools</span>
        </div>
        <FormatStack formats={project?.formats} />
      </div>
    </div>
  );
};

const ProjectStackPanel = ({ formats = [] }) => {
  const stackItems = getListValues(formats, "format");

  if (!stackItems.length) {
    return <ProjectEmptyNote text="No stack tools added yet. Add formats from the admin panel to show them here." />;
  }

  return (
    <div className="space-y-2.5">
      {stackItems.slice(0, 8).map((stack) => (
        <div key={stack} className="flex items-center gap-3 rounded-[1.15rem] bg-white/[0.028] p-3 ring-1 ring-white/[0.035] backdrop-blur-xl">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.045] ring-1 ring-white/[0.04]">
            <IconWithFallback value={stack.toLowerCase()} alt={`${stack} icon`} className="h-full w-full object-contain p-2.5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold textColor">{stack}</p>
            <p className="mt-0.5 text-[10px] textColor opacity-45">Project technology</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProjectTrustPanel = ({ project, price }) => {
  const trustItems = [
    {
      icon: <BsBoxSeam />,
      title: price > 0 ? "Paid access" : "Free access",
      text: price > 0 ? "Add to cart and complete checkout to unlock the project package." : "You can access this project without payment where download/preview is available.",
    },
    {
      icon: <FaFileDownload />,
      title: "Digital delivery",
      text: "Project files, previews, or links stay connected to this project page.",
    },
    {
      icon: <FaRegLifeRing />,
      title: "Support ready",
      text: "Use the question section below to ask setup or pre-purchase questions.",
    },
  ];

  return (
    <div className="space-y-3">
      {trustItems.map((item) => (
        <div key={item.title} className="flex gap-3 rounded-[1.15rem] bg-white/[0.028] p-3 ring-1 ring-white/[0.035] backdrop-blur-xl">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.045] text-teal-100/62 ring-1 ring-white/[0.04]">{item.icon}</span>
          <div>
            <p className="text-sm font-semibold textColor">{item.title}</p>
            <p className="mt-1 text-[11px] leading-5 textColor opacity-52">{item.text}</p>
          </div>
        </div>
      ))}
      <div className="rounded-[1.15rem] bg-white/[0.025] p-3 ring-1 ring-white/[0.032]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] textColor opacity-42">Version note</p>
        <p className="mt-2 text-xs leading-5 textColor opacity-58">
          Updated <DateFormatter date={project?.updatedAt || project?.createdAt} />
        </p>
      </div>
    </div>
  );
};

const ProjectBuyerAccessPanel = ({ project, price, access, isLoggedIn, onDownload, isDownloading }) => {
  const hasAccess = Boolean(access?.hasAccess);
  const license = access?.license;
  const purchase = access?.purchase;
  const downloads = access?.downloads || {};
  const invoiceUrl = purchase?.orderId ? `${REACT_APP_BACKEND_URL}/business/invoice/${purchase.orderId}` : "";
  const licenseVerifyUrl = license?.licenseId ? `/project-license/verify/${license.licenseId}` : "";

  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <div className="rounded-[1.25rem] bg-white/[0.03] p-4 ring-1 ring-white/[0.04]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-100/60">Login required</p>
          <p className="mt-2 text-sm font-semibold textColor">{price > 0 ? "Login and purchase to unlock files" : "Login to download this free project"}</p>
          <p className="mt-2 text-xs leading-5 textColor opacity-55">You can still preview the project, but download access is protected.</p>
        </div>
        <ProjectTrustPanel project={project} price={price} />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="space-y-3">
        <div className="rounded-[1.25rem] bg-white/[0.03] p-4 ring-1 ring-amber-200/[0.10]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-100/60">{access?.isRevoked ? "Access revoked" : "Purchase required"}</p>
          <p className="mt-2 text-sm font-semibold textColor">{access?.isRevoked ? "Contact support for download access" : "Buy this project to unlock the package"}</p>
          <p className="mt-2 text-xs leading-5 textColor opacity-55">{access?.isRevoked ? "Your access has been paused by admin." : "After payment, your license, invoice, and downloads will appear here."}</p>
        </div>
        <ProjectTrustPanel project={project} price={price} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-[1.35rem] bg-emerald-300/[0.055] p-4 ring-1 ring-emerald-200/[0.10]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-100/60">Access unlocked</p>
            <p className="mt-2 text-sm font-semibold textColor">{access?.isFree ? "Free project access" : "Purchased project access"}</p>
          </div>
          <IoCheckmarkCircle size={22} className="text-emerald-100/70" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] textColor">
          <div className="rounded-[1rem] bg-white/[0.035] p-3 ring-1 ring-white/[0.035]">
            <span className="block uppercase tracking-[0.14em] opacity-35">Downloads</span>
            <strong className="mt-1 block text-sm font-semibold opacity-80">{downloads.used || 0}/{downloads.limit || project?.maxDownloadsPerUser || 20}</strong>
          </div>
          <div className="rounded-[1rem] bg-white/[0.035] p-3 ring-1 ring-white/[0.035]">
            <span className="block uppercase tracking-[0.14em] opacity-35">Remaining</span>
            <strong className="mt-1 block text-sm font-semibold opacity-80">{downloads.remaining ?? "-"}</strong>
          </div>
        </div>
        <button type="button" onClick={onDownload} disabled={isDownloading} className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-xs font-semibold text-[#071319] shadow-[0_14px_32px_rgba(255,255,255,0.12)] disabled:opacity-60">
          <FaFileDownload size={13} />
          {isDownloading ? "Preparing..." : "Download latest files"}
        </button>
      </div>

      {license?.licenseId && (
        <div className="rounded-[1.25rem] bg-white/[0.028] p-4 ring-1 ring-white/[0.035]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-100/55">License</p>
          <p className="mt-2 break-all text-sm font-semibold textColor">{license.licenseId}</p>
          <p className="mt-2 text-xs leading-5 textColor opacity-52">{license.usageTerms || project?.license}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {licenseVerifyUrl && (
              <a href={licenseVerifyUrl} target="_blank" rel="noreferrer" className="rounded-full bg-white/[0.045] px-3 py-2 text-[10px] font-semibold textColor opacity-65 ring-1 ring-white/[0.045]">
                Verify license
              </a>
            )}
            {invoiceUrl && (
              <a href={invoiceUrl} target="_blank" rel="noreferrer" className="rounded-full bg-white/[0.045] px-3 py-2 text-[10px] font-semibold textColor opacity-65 ring-1 ring-white/[0.045]">
                View invoice
              </a>
            )}
          </div>
        </div>
      )}

      <div className="rounded-[1.25rem] bg-white/[0.025] p-4 ring-1 ring-white/[0.032]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] textColor opacity-42">Refund & support</p>
        <p className="mt-2 text-xs leading-5 textColor opacity-56">{project?.refundPolicy || "Refund requests are reviewed when files are inaccessible, incorrect, duplicated, or not as described."}</p>
        {project?.supportEmail && <p className="mt-3 truncate text-xs font-semibold text-teal-100/58">{project.supportEmail}</p>}
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, wide = false }) => (
  <div className={`rounded-[1.15rem] bg-white/[0.03] p-3 text-xs textColor ring-1 ring-white/[0.035] backdrop-blur-xl transition hover:bg-white/[0.048] ${wide ? "flex items-center justify-between gap-3" : ""}`}>
    <span className={`flex items-center gap-2 opacity-58 ${wide ? "" : "mb-2"}`}>
      <span className="flex size-6 items-center justify-center rounded-full bg-teal-300/[0.07] text-teal-100/65">{icon}</span>
      <span>{label}</span>
    </span>
    <span className="block text-sm font-semibold capitalize text-white/72">{value}</span>
  </div>
);

const FormatStack = ({ formats = [] }) => {
  const visibleFormats = formats?.slice(0, 7) || [];
  if (!visibleFormats.length) return <p className="text-xs textColor opacity-45">No formats added.</p>;

  return (
    <div className="flex items-center -space-x-2">
      {visibleFormats.map((format, index) => {
        const iconName = format?.format?.toLowerCase() || "unknown";
        const label = format?.format || "Unknown";
        return (
          <span key={format?._id || `${label}-${index}`} className="flex size-9 items-center justify-center rounded-full bg-white/[0.055] backdrop-blur-2xl ring-1 ring-white/[0.08]">
            <IconWithFallback value={iconName} alt={`${label} icon`} className="h-full w-full object-contain p-2" />
          </span>
        );
      })}
    </div>
  );
};

const ProjectHighlightList = ({ highlights = [] }) => {
  if (!highlights?.length) {
    return <p className="text-xs leading-6 textColor opacity-55">No highlights added yet.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="rounded-[1.25rem] bg-white/[0.03] p-4 ring-1 ring-white/[0.04] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-100/55">Included value</p>
            <p className="mt-2 text-sm leading-6 textColor opacity-70">Core points that make this project useful, polished, and production-ready.</p>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.045] text-teal-100/62 ring-1 ring-white/[0.04]">
            <IoCheckmarkCircle size={18} />
          </span>
        </div>
      </div>
      {highlights.map((highlight, index) => (
        <div className="group relative flex gap-3 overflow-hidden rounded-[1.18rem] bg-white/[0.026] p-3 ring-1 ring-white/[0.035] backdrop-blur-xl transition hover:bg-white/[0.045]" key={highlight?._id || highlight?.highlight || index}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/[0.045] text-teal-100/58 ring-1 ring-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-100/45">Highlight</p>
            <p className="mt-1 text-xs leading-5 textColor opacity-70">{highlight?.highlight || highlight}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProjectHighlights = ({ highlights = [] }) => {
  if (!highlights?.length) return null;

  return (
    <div className="mt-5 overflow-hidden rounded-[1.7rem] bg-white/[0.035] p-px">
      <div className="relative rounded-[1.65rem] bg-[#151a21]/78 p-5 backdrop-blur-xl">
        <span className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-teal-300/[0.06] blur-3xl"></span>
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-200/55">Project highlights</p>
            <h3 className="mt-2 text-lg font-semibold textColor">What this project includes</h3>
          </div>
          <span className="rounded-full bg-white/[0.045] px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] textColor opacity-55 ring-1 ring-white/[0.045]">
            {highlights.length} highlights
          </span>
        </div>
        <div className="relative mt-4 grid gap-2 md:grid-cols-2">
          {highlights.map((highlight) => (
            <div className="flex gap-3 rounded-[1.15rem] bg-white/[0.035] p-3 ring-1 ring-white/[0.035]" key={highlight?._id || highlight?.highlight}>
              <IoCheckmarkCircle size={17} className="mt-0.5 shrink-0 text-teal-200/75" />
              <p className="text-xs leading-6 textColor opacity-68">{highlight?.highlight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ShareProjectPanel = ({ project, coverImage, shareUrl, shareText, copied, onCopy }) => {
  const encodedUrl = encodeURIComponent(shareUrl || "");
  const encodedText = encodeURIComponent(shareText || "");
  const previewUrl = shareUrl ? shareUrl.replace(/^https?:\/\//, "") : "localhost/project";

  const socialLinks = [
    {
      label: "Facebook",
      caption: "Share as a link preview",
      icon: <FaFacebookF size={15} className="text-[#7bc7ff]" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Twitter",
      caption: "Post title + link",
      icon: <AiOutlineTwitter size={18} className="text-[#78c8ff]" />,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      label: "Telegram",
      caption: "Send to chat/channel",
      icon: <FaTelegramPlane size={15} className="text-[#58d0ff]" />,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
    {
      label: "Instagram",
      caption: "Copy link for bio/story",
      icon: <AiOutlineInstagram size={18} className="text-[#ff7bb6]" />,
      href: null,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[1.45rem] bg-white/[0.055] p-px shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
        <div className="overflow-hidden rounded-[1.42rem] bg-[#111821]/88 backdrop-blur-xl">
          <div className="relative h-32 overflow-hidden">
            <img src={coverImage} alt={project?.title || "Share preview"} className="h-full w-full object-cover opacity-72 saturate-[0.9]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111821] via-[#111821]/52 to-[#111821]/12"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#111821]/48 to-transparent"></div>
            <span className="absolute right-3 top-3 rounded-full bg-black/35 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-white/70 ring-1 ring-white/10 backdrop-blur-xl">Preview</span>
          </div>
          <div className="p-3">
            <p className="line-clamp-2 text-sm font-semibold leading-5 textColor">{project?.title || "Gorkcoder Project"}</p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-4 textColor opacity-55">{project?.metaDescription || "Explore this project on Gorkcoder."}</p>
            <p className="mt-3 truncate rounded-full bg-white/[0.03] px-3 py-2 text-[10px] font-medium text-teal-100/50 ring-1 ring-white/[0.035]">{previewUrl}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {socialLinks.map((item) =>
          item.href ? (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="group rounded-[1.15rem] bg-white/[0.026] p-3 ring-1 ring-white/[0.032] backdrop-blur-xl transition hover:bg-white/[0.05] hover:ring-white/[0.06]">
              <span className="flex size-10 items-center justify-center rounded-full bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">{item.icon}</span>
              <span className="mt-3 block min-w-0">
                <span className="block text-xs font-semibold textColor">{item.label}</span>
                <span className="mt-1 block line-clamp-2 text-[10px] leading-4 textColor opacity-45">{item.caption}</span>
              </span>
            </a>
          ) : (
            <button key={item.label} type="button" onClick={onCopy} className="group rounded-[1.15rem] bg-white/[0.026] p-3 text-left ring-1 ring-white/[0.032] backdrop-blur-xl transition hover:bg-white/[0.05] hover:ring-white/[0.06]">
              <span className="flex size-10 items-center justify-center rounded-full bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">{item.icon}</span>
              <span className="mt-3 block min-w-0">
                <span className="block text-xs font-semibold textColor">{item.label}</span>
                <span className="mt-1 block line-clamp-2 text-[10px] leading-4 textColor opacity-45">{item.caption}</span>
              </span>
            </button>
          ),
        )}
      </div>

      <ActionButton className="blog-glass-action flexC !h-11 w-full gap-2 !px-4">
        <AiOutlineLink size={18} className="text-gray-200" />
        <button type="button" onClick={onCopy}>
          {copied ? "Copied link" : "Copy link"}
        </button>
      </ActionButton>
    </div>
  );
};
