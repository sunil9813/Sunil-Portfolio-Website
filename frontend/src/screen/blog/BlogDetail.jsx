import BlogImg from "@/assets/bg/blogdbg.avif";
import { Comments } from "@/components/comment/Comments";
import { ActionButton } from "@/components/customeUI/Button";
import { HeadingTwo, InputLabel } from "@/components/customeUI/Title";
import { DateFormatter } from "@/components/DateFormatter";
import { FavoriteButton } from "@/components/FavoriteButton";
import { LikeButton } from "@/components/LikeButton";
import { RichTextRenderer } from "@/components/render/RichTextRenderer";
import { getallBlog, getBlog } from "@/redux/slices/blogSlice";
import { COMMENT_RESET, getComments } from "@/redux/slices/common/commentSlice";
import { generateItemColor, truncateText } from "@/utils";
import { REACT_APP_BACKEND_URL } from "@/utils/api";
import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineInstagram, AiOutlineLink, AiOutlineTwitter } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import {
  FaArrowUp,
  FaCalendarAlt,
  FaChartLine,
  FaCheck,
  FaClock,
  FaComments,
  FaEnvelope,
  FaFacebookF,
  FaFire,
  FaHeart,
  FaLightbulb,
  FaPause,
  FaPlay,
  FaQuoteLeft,
  FaSearch,
  FaStop,
  FaTelegramPlane,
  FaThumbsUp,
} from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const getCount = (value) => {
  if (Array.isArray(value)) return value.length;
  return Number(value || 0);
};

const getCommentCount = (items = []) => {
  if (!Array.isArray(items)) return 0;

  return items.reduce((total, item) => {
    const replies = item?.replies || item?.comment?.replies || [];
    return total + 1 + getCommentCount(replies);
  }, 0);
};

const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getTextFromHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getHeadingsFromHtml = (html = "") => {
  if (!html) return [];

  if (typeof window !== "undefined" && window.DOMParser) {
    const documentBody = new window.DOMParser().parseFromString(html, "text/html");
    return Array.from(documentBody.querySelectorAll("h2, h3, h4"))
      .map((heading, index) => ({
        id: `${slugify(heading.textContent || "section")}-${index}`,
        text: heading.textContent?.trim(),
        level: Number(heading.tagName.replace("H", "")),
      }))
      .filter((heading) => heading.text);
  }

  return Array.from(html.matchAll(/<h([2-4])[^>]*>(.*?)<\/h\1>/gi))
    .map((match, index) => {
      const text = getTextFromHtml(match[2]);
      return {
        id: `${slugify(text || "section")}-${index}`,
        text,
        level: Number(match[1]),
      };
    })
    .filter((heading) => heading.text);
};

const getReadingLevel = (wordCount = 0) => {
  if (wordCount < 700) return "Beginner";
  if (wordCount < 1600) return "Intermediate";
  return "Advanced";
};

const getIsFavorite = (favoriteResource, resourceType, resourceId) => {
  const resources = favoriteResource?.[resourceType];

  if (!resources || !resourceId) return false;

  if (Array.isArray(resources)) {
    return resources.some((resource) => String(resource?._id || resource) === String(resourceId));
  }

  return Boolean(resources?.[resourceId]);
};

const setMetaTag = (selector, attribute, value) => {
  if (typeof document === "undefined" || !value) return;

  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    const match = selector.match(/\[(name|property)="(.+?)"\]/);
    if (match) tag.setAttribute(match[1], match[2]);
    document.head.appendChild(tag);
  }
  tag.setAttribute(attribute, value);
};

const clearSearchHighlights = (root) => {
  root?.querySelectorAll("mark[data-blog-search-mark='true']").forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(mark.textContent || ""), mark);
    parent.normalize();
  });
};

const highlightSearchTerm = (root, term) => {
  if (!root || !term?.trim()) return 0;

  clearSearchHighlights(root);
  const escaped = term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  let count = 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "MARK"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue || !regex.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      regex.lastIndex = 0;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    const fragment = document.createDocumentFragment();
    const parts = node.nodeValue.split(regex);
    parts.forEach((part) => {
      if (!part) return;
      if (part.toLowerCase() === term.trim().toLowerCase()) {
        const mark = document.createElement("mark");
        mark.dataset.blogSearchMark = "true";
        mark.className = "rounded bg-yellow-300/80 px-1 text-black";
        mark.textContent = part;
        fragment.appendChild(mark);
        count += 1;
      } else {
        fragment.appendChild(document.createTextNode(part));
      }
    });
    node.parentNode?.replaceChild(fragment, node);
  });

  return count;
};

const reactionOptions = [
  { key: "helpful", icon: <FaFire size={17} />, label: "Helpful" },
  { key: "insightful", icon: <FaLightbulb size={17} />, label: "Insightful" },
  { key: "loved", icon: <FaHeart size={16} />, label: "Loved" },
  { key: "clear", icon: <FaCheck size={15} />, label: "Clear" },
];

export const BlogDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResultCount, setSearchResultCount] = useState(0);
  const [selectedQuote, setSelectedQuote] = useState("");
  const [quoteCopied, setQuoteCopied] = useState(false);
  const [headingCopied, setHeadingCopied] = useState("");
  const [helpfulResponse, setHelpfulResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [resumePosition, setResumePosition] = useState(0);
  const [reactions, setReactions] = useState({});
  const articleRef = useRef(null);

  const { blog, blogs, isLoading } = useSelector((state) => state.blog);
  const { favoriteResource } = useSelector((state) => state.favorite);
  const { comments: loadedComments } = useSelector((state) => state.comment);
  const allBlogs = useMemo(() => blogs?.BlogList || [], [blogs?.BlogList]);

  const isFavorited = useMemo(() => getIsFavorite(favoriteResource, "Blog", blog?._id), [favoriteResource, blog?._id]);
  const viewCount = getCount(blog?.numOfViews);
  const backendCommentCount = blog?.commentsCount ?? blog?.totalComments ?? blog?.commentCount ?? getCount(blog?.comments);
  const loadedCommentCount = getCommentCount(loadedComments);
  const commentCount = loadedComments?.length ? loadedCommentCount : backendCommentCount;
  const coverImage = blog?.cover?.filePath || BlogImg;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const seoTitle = blog?.seo?.title || blog?.title;
  const seoDescription = blog?.metaDescription || blog?.title;
  const seoImage = blog?.seo?.ogImage || coverImage;
  const canonicalUrl = blog?.seo?.canonicalUrl || shareUrl;
  const authorName = blog?.user?.name || blog?.name || "Gorkcoder";
  const authorAvatar = blog?.user?.avatar?.url || blog?.avatar?.url;
  const descriptionText = typeof blog?.description === "string" ? blog.description.replace(/<[^>]*>/g, " ") : "";
  const wordCount = descriptionText.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const readingLevel = getReadingLevel(wordCount);
  const shareText = `${blog?.title || "Gorkcoder Blog"}\n\n${blog?.metaDescription || "Read this blog on Gorkcoder."}`;
  const blogApiBase = `${REACT_APP_BACKEND_URL}/blog`;
  const storageKey = blog?._id || slug;
  const tableOfContents = useMemo(() => getHeadingsFromHtml(blog?.description || ""), [blog?.description]);
  const blogIndex = allBlogs.findIndex((item) => item?.slug === blog?.slug);
  const previousBlog = blogIndex > 0 ? allBlogs[blogIndex - 1] : null;
  const nextBlog = blogIndex >= 0 && blogIndex < allBlogs.length - 1 ? allBlogs[blogIndex + 1] : null;
  const relatedBlogs = useMemo(() => {
    const manualRelatedPosts = Array.isArray(blog?.relatedPosts) ? blog.relatedPosts.filter(Boolean) : [];
    if (manualRelatedPosts.length) {
      return manualRelatedPosts.slice(0, 3);
    }

    const currentTags = new Set((blog?.tags || []).map((tag) => tag?.tag).filter(Boolean));
    const sameCategory = blog?.category?.title;

    const related = allBlogs
      .filter((item) => item?._id !== blog?._id)
      .filter((item) => item?.category?.title === sameCategory || item?.tags?.some((tag) => currentTags.has(tag?.tag)))
      .slice(0, 3);

    if (related.length) return related;

    return allBlogs.filter((item) => item?._id !== blog?._id).slice(0, 3);
  }, [allBlogs, blog?._id, blog?.category?.title, blog?.tags, blog?.relatedPosts]);
  const blogSeries = useMemo(() => {
    if (!blog?.category?.title) return [];
    return allBlogs.filter((item) => item?._id !== blog?._id && item?.category?.title === blog.category.title).slice(0, 4);
  }, [allBlogs, blog?._id, blog?.category?.title]);

  useEffect(() => {
    dispatch(getBlog(slug));
  }, [slug, dispatch]);

  useEffect(() => {
    if (blog?._id) {
      dispatch(COMMENT_RESET());
      dispatch(getComments(blog._id));
    }
  }, [blog?._id, dispatch]);

  useEffect(() => {
    if (!blog?.title) return;
    const previousTitle = document.title;
    document.title = `${seoTitle} | Gorkcoder Blog`;
    setMetaTag('meta[name="description"]', "content", seoDescription);
    if (blog?.seo?.keywords?.length) {
      setMetaTag('meta[name="keywords"]', "content", blog.seo.keywords.join(", "));
    }
    setMetaTag('meta[property="og:title"]', "content", seoTitle);
    setMetaTag('meta[property="og:description"]', "content", seoDescription);
    setMetaTag('meta[property="og:image"]', "content", seoImage);
    setMetaTag('meta[property="og:type"]', "content", "article");
    setMetaTag('meta[property="og:url"]', "content", canonicalUrl);
    setMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
    setMetaTag('meta[name="twitter:title"]', "content", seoTitle);
    setMetaTag('meta[name="twitter:description"]', "content", seoDescription);
    setMetaTag('meta[name="twitter:image"]', "content", seoImage);

    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    let jsonLdScript = document.head.querySelector("#blog-article-jsonld");
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.id = "blog-article-jsonld";
      jsonLdScript.type = "application/ld+json";
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: seoTitle,
      description: seoDescription,
      image: seoImage,
      url: canonicalUrl,
      datePublished: blog?.createdAt,
      dateModified: blog?.updatedAt || blog?.createdAt,
      author: {
        "@type": "Person",
        name: authorName,
      },
      publisher: {
        "@type": "Organization",
        name: "Gorkcoder",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
    });

    return () => {
      document.title = previousTitle;
    };
  }, [blog?.title, blog?.createdAt, blog?.updatedAt, seoTitle, seoDescription, seoImage, canonicalUrl, authorName]);

  useEffect(() => {
    if (!allBlogs.length) {
      dispatch(getallBlog());
    }
  }, [allBlogs.length, dispatch]);

  useEffect(() => {
    if (!articleRef.current || !tableOfContents.length) return;

    const headings = articleRef.current.querySelectorAll("h2, h3, h4");
    articleRef.current.querySelectorAll("[data-heading-copy-button='true']").forEach((button) => button.remove());

    headings.forEach((heading, index) => {
      if (tableOfContents[index]?.id) {
        heading.id = tableOfContents[index].id;
      }

      if (!heading.id) return;

      heading.classList.add("blog-heading-copy-target");
      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.dataset.headingCopyButton = "true";
      copyButton.className = "blog-heading-copy-button";
      copyButton.setAttribute("aria-label", `Copy link to ${heading.textContent}`);
      copyButton.innerHTML = "#";
      copyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const headingUrl = `${window.location.origin}${window.location.pathname}#${heading.id}`;
        navigator?.clipboard?.writeText(headingUrl);
        setHeadingCopied(heading.id);
        window.setTimeout(() => setHeadingCopied(""), 1600);
      });
      heading.appendChild(copyButton);
    });
  }, [blog?.description, tableOfContents]);

  useEffect(() => {
    const handleScroll = () => {
      if (!articleRef.current) return;

      const rect = articleRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const current = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setReadingProgress(Math.round((current / Math.max(total, 1)) * 100));

      const headings = Array.from(articleRef.current.querySelectorAll("h2, h3, h4"));
      const currentHeading = headings.findLast((heading) => heading.getBoundingClientRect().top <= 140);
      if (currentHeading?.id) {
        setActiveHeading(currentHeading.id);
      }

      if (storageKey && window.scrollY > 300) {
        window.localStorage.setItem(`blog-resume:${storageKey}`, String(window.scrollY));
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [blog?.description, storageKey]);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    setResumePosition(Number(window.localStorage.getItem(`blog-resume:${storageKey}`) || 0));
    const savedReactions = window.localStorage.getItem(`blog-reactions:${storageKey}`);
    setReactions(savedReactions ? JSON.parse(savedReactions) : {});
  }, [storageKey]);

  useEffect(() => {
    if (!blog?.slug || typeof window === "undefined" || readingProgress < 25) return;

    const milestone = readingProgress >= 95 ? 100 : readingProgress >= 75 ? 75 : readingProgress >= 50 ? 50 : 25;
    const milestoneKey = `blog-read-history:${blog.slug}:${milestone}`;

    if (window.localStorage.getItem(milestoneKey)) return;
    window.localStorage.setItem(milestoneKey, "true");

    axios.post(`${blogApiBase}/${blog.slug}/read-history`, { progress: milestone }).catch(() => {
      window.localStorage.removeItem(milestoneKey);
    });
  }, [blog?.slug, blogApiBase, readingProgress]);

  useEffect(() => {
    if (!articleRef.current) return;
    const root = articleRef.current;

    if (!searchTerm.trim()) {
      clearSearchHighlights(root);
      setSearchResultCount(0);
      return;
    }

    const timer = window.setTimeout(() => {
      setSearchResultCount(highlightSearchTerm(root, searchTerm));
    }, 80);

    return () => window.clearTimeout(timer);
  }, [searchTerm, blog?.description]);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (!text || text.length < 12 || !articleRef.current) {
        setSelectedQuote("");
        return;
      }
      const range = selection.getRangeAt(0);
      if (articleRef.current.contains(range.commonAncestorContainer)) {
        setSelectedQuote(text.slice(0, 240));
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
    };
  }, []);

  const handleFilterClick = (filterType, value) => {
    if (!value) return;
    if (filterType === "category") {
      navigate(`/blogs?category=${encodeURIComponent(value)}`);
    } else if (filterType === "tag") {
      navigate(`/blogs?tag=${encodeURIComponent(value)}`);
    }
  };

  const handleTrackShare = (platform = "copy") => {
    if (!blog?.slug) return;
    axios.post(`${blogApiBase}/${blog.slug}/share`, { platform }).catch(() => {});
  };

  const handleHelpfulVote = (value) => {
    setHelpfulResponse(value);
    if (!blog?.slug) return;
    axios.post(`${blogApiBase}/${blog.slug}/helpful`, { value }).catch(() => {});
  };

  const handleNewsletterSubscribe = async ({ email, name }) => {
    const response = await axios.post(`${blogApiBase}/newsletter/subscribe`, {
      email,
      name,
      source: "blog-detail",
    });

    return response.data;
  };

  const handleReportIssue = async ({ message, email, name }) => {
    const response = await axios.post(`${blogApiBase}/${blog?.slug}/report`, {
      message,
      email,
      name,
    });

    return response.data;
  };

  const handleCopyLink = (platform = "copy") => {
    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      handleTrackShare(platform);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleCopyQuote = () => {
    if (!selectedQuote || typeof window === "undefined" || !navigator?.clipboard) return;
    navigator.clipboard.writeText(`"${selectedQuote}"\n\n${shareUrl}`);
    setQuoteCopied(true);
    window.setTimeout(() => setQuoteCopied(false), 1800);
  };

  const handleResumeReading = () => {
    window.scrollTo({ top: resumePosition, behavior: "smooth" });
  };

  const handleReaction = (key) => {
    if (!storageKey) return;
    const nextReactions = { ...reactions, [key]: (reactions[key] || 0) + 1 };
    setReactions(nextReactions);
    window.localStorage.setItem(`blog-reactions:${storageKey}`, JSON.stringify(nextReactions));
  };

  const handleReadAloud = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${blog?.title}. ${blog?.metaDescription}. ${descriptionText}`);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStopReading = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (isLoading && !blog?._id) {
    return (
      <section className="blog-details relative overflow-hidden pb-20 pt-32">
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
      <section className="blog-details isolate overflow-hidden bg-[#111821] pb-20">
        <div className="fixed left-0 right-0 top-0 z-[999] h-1 bg-white/[0.035]">
          <div className="h-full bg-gradient-to-r from-cyan-300 via-purple-300 to-orange-300 transition-all duration-200" style={{ width: `${readingProgress}%` }}></div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[48rem] overflow-hidden">
          <img src={coverImage} alt={blog?.cover?.fileName || blog?.title || "Blog thumbnail"} className="h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#111821]/50 via-[#111821]/78 to-[#111821]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#111821] via-[#111821]/45 to-[#111821]"></div>
          <div className="absolute inset-0 bg-black/28 backdrop-blur-[1.5px]"></div>
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#111821] to-transparent"></div>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-24 -z-10 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-[120px]"></div>
        <div className="pointer-events-none absolute right-[-12rem] top-[36rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-fuchsia-400/10 blur-[120px]"></div>
        <div className="pointer-events-none absolute left-0 top-[35rem] -z-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

        <div className="container relative z-10 pt-14">
          <div className="mt-10">
            {blog?.category?.title && (
              <button
                onClick={() => handleFilterClick("category", blog?.category?.title)}
                className="group relative mb-6 inline-flex overflow-hidden rounded-full bg-white/[0.055] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ring-white/[0.05] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-teal-50"
              >
                <span className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/45 to-transparent"></span>
                {blog.category.title}
              </button>
            )}
            <h1 className="gardient-text text-3xl font-semibold leading-[1.08] tracking-[-0.05em] md:text-5xl lg:text-6xl">{blog?.title}</h1>
            <p className=" mt-5 text-sm leading-7 textColor opacity-72 md:text-base">{blog?.metaDescription}</p>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <AuthorPill authorName={authorName} authorAvatar={authorAvatar} seed={blog?.user?.name || blog?.name} />
              <MetaPill icon={<IoEye size={14} />} label={`${viewCount} views`} tone="bg-sky-300/10 text-sky-100 ring-sky-200/10" />
              <MetaPill icon={<FaComments size={13} />} label={`${commentCount} comments`} tone="bg-emerald-300/10 text-emerald-100 ring-emerald-200/10" />
              <MetaPill icon={<FaClock size={13} />} label={`${readMinutes} min read`} tone="bg-amber-300/10 text-amber-100 ring-amber-200/10" />
              <MetaPill icon={<FaChartLine size={13} />} label={readingLevel} tone="bg-violet-300/10 text-violet-100 ring-violet-200/10" />
              <MetaPill icon={<FaCalendarAlt size={13} />} label={<DateFormatter date={blog?.createdAt} />} tone="bg-cyan-300/10 text-cyan-100 ring-cyan-200/10" />
              {blog?.updatedAt && blog.updatedAt !== blog.createdAt && (
                <MetaPill
                  icon={<FaCalendarAlt size={13} />}
                  tone="bg-orange-300/10 text-orange-100 ring-orange-200/10"
                  label={
                    <>
                      Updated <DateFormatter date={blog.updatedAt} />
                    </>
                  }
                />
              )}
              <div className="blog-action-group ml-0 md:ml-1">
                <LikeButton resourceType="blog" contentId={blog?._id} initialLikes={blog?.likes || []} showCount className="blog-like-count-button" />
              </div>
              <div className="blog-action-group">
                <FavoriteButton resourceType="Blog" resourceId={blog?._id} initialFavorited={isFavorited} className="blog-bookmark-button" showLabel />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px] xl:grid-cols-[minmax(0,1fr)_340px]">
            <article
              ref={articleRef}
              className="rounded-[2rem]  p-5 md:p-8 lg:p-10  bg-gradient-to-br from-white/[0.09] via-white/[0.035] to-white/[0.018] backdrop-blur-md shadow-[0_22px_70px_rgba(0,0,0,0.22)]"
            >
              <div className="mb-8 flex items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-200/55">Article content</p>
                  <h2 className="mt-2 text-xl font-semibold textColor">Read the full story</h2>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  {resumePosition > 350 && (
                    <button
                      type="button"
                      onClick={handleResumeReading}
                      className="rounded-full bg-cyan-300/[0.09] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-cyan-100/80 ring-1 ring-cyan-200/10 transition hover:-translate-y-0.5 hover:bg-cyan-300/[0.14]"
                    >
                      Resume
                    </button>
                  )}
                  <span className="rounded-full bg-white/[0.055] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.13em] textColor opacity-60">{readMinutes} min read</span>
                </div>
              </div>

              <div className="blog-rich-content textColor">
                <RichTextRenderer content={blog?.description || ""} />
              </div>

              <HelpfulCTA response={helpfulResponse} onVote={handleHelpfulVote} />
              <NewsletterCTA onSubscribe={handleNewsletterSubscribe} />
              <ReportIssueCTA onSubmit={handleReportIssue} />
            </article>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <SidePanel eyebrow="Article tools" title="Reader tools">
                <ReaderTools
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  searchResultCount={searchResultCount}
                  isSpeaking={isSpeaking}
                  onReadAloud={handleReadAloud}
                  onStopReading={handleStopReading}
                  resumePosition={resumePosition}
                  onResume={handleResumeReading}
                />
              </SidePanel>

              <SidePanel eyebrow="React" title="Reactions">
                <ReactionPanel reactions={reactions} onReact={handleReaction} />
              </SidePanel>

              <SidePanel eyebrow="On this page" title="Table of contents">
                <TableOfContents items={tableOfContents} activeHeading={activeHeading} />
              </SidePanel>

              <SidePanel eyebrow="Explore more" title="Tags">
                {blog?.tags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => {
                      const tagValue = tag?.tag || tag?.title || tag?.name || tag;

                      return (
                        <button
                          className="rounded-full bg-white/[0.035] px-4 py-2 text-xs font-semibold text-teal-100/75 ring-1 ring-teal-200/10 transition hover:-translate-y-0.5 hover:bg-teal-300/[0.12] hover:text-teal-50 hover:ring-teal-200/20"
                          key={tag?._id || tagValue}
                          onClick={() => handleFilterClick("tag", tagValue)}
                        >
                          #{tagValue}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <InputLabel className="textColor opacity-55">No tags added yet.</InputLabel>
                )}
              </SidePanel>

              <SidePanel eyebrow="Send this" title="Share blog">
                <ShareBlogPanel blog={blog} coverImage={coverImage} shareUrl={shareUrl} shareText={shareText} copied={copied} onCopy={handleCopyLink} onShare={handleTrackShare} />
              </SidePanel>
            </aside>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-5">
              <AuthorCard authorName={authorName} authorAvatar={authorAvatar} seed={blog?.user?.name || blog?.name} totalBlogs={allBlogs.length} />
              <PrevNextNavigation previousBlog={previousBlog} nextBlog={nextBlog} />
              <BlogSeries blogs={blogSeries} category={blog?.category?.title} />
              <RelatedBlogs blogs={relatedBlogs} />
            </div>
          </div>

          {selectedQuote && <QuoteSelectionBar quote={selectedQuote} copied={quoteCopied} onCopy={handleCopyQuote} onClose={() => setSelectedQuote("")} />}
          {headingCopied && <CopyToast label="Heading link copied" />}
          <BackToTopButton visible={readingProgress > 18} />

          {blog?._id && <Comments resourceId={blog._id} resourceType="Posts" />}
        </div>
      </section>
    </>
  );
};

const HelpfulCTA = ({ response, onVote }) => {
  return (
    <div className="mt-10 overflow-hidden rounded-[1.7rem] bg-white/[0.035] p-px">
      <div className="flex flex-col gap-4 rounded-[1.65rem] bg-[#151a21]/78 p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-100 ring-1 ring-cyan-200/10">
            <FaThumbsUp size={15} />
          </span>
          <div>
            <p className="text-sm font-semibold textColor">Was this article helpful?</p>
            <p className="mt-1 text-xs leading-5 textColor opacity-52">Your feedback helps me improve future guides and examples.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Yes", "Not yet"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onVote(item)}
              className={`h-9 rounded-full px-4 text-xs font-normal ring-1 transition hover:-translate-y-0.5 ${
                response === item ? "bg-white text-black ring-white/20" : "bg-white/[0.045] textColor opacity-75 ring-white/[0.05] hover:bg-white/[0.07] hover:opacity-100"
              }`}
            >
              {response === item ? "Thanks!" : item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const NewsletterCTA = ({ onSubscribe }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");

    if (!email.trim()) {
      setStatus("Please enter your email.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubscribe?.({ email });
      setEmail("");
      setStatus("Subscribed successfully.");
    } catch (error) {
      setStatus(error?.response?.data?.error || error?.response?.data?.message || "Subscription failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-5 overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-cyan-200/[0.12] via-white/[0.045] to-purple-200/[0.06] p-px">
      <div className="relative overflow-hidden rounded-[1.65rem] bg-[#151a21]/86 p-5 backdrop-blur-xl">
        <span className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-cyan-300/[0.08] blur-3xl"></span>
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-300/10 text-teal-100 ring-1 ring-teal-200/10">
              <FaEnvelope size={15} />
            </span>
            <div>
              <p className="text-sm font-semibold textColor">Get new posts in your inbox</p>
              <p className="mt-1 text-xs leading-5 textColor opacity-52">Development notes, course updates, and practical build ideas.</p>
            </div>
          </div>
          <form className="min-w-0" onSubmit={handleSubmit}>
            <div className="flex rounded-full bg-white/[0.045] p-1 ring-1 ring-white/[0.055]">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email address"
                className="h-9 min-w-0 flex-1 bg-transparent px-3 text-xs textColor outline-none placeholder:text-white/30 md:w-48"
              />
              <button type="submit" disabled={isSubmitting} className="h-9 rounded-full bg-white px-4 text-xs font-normal text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? "Saving..." : "Subscribe"}
              </button>
            </div>
            {status && <p className="mt-2 px-2 text-[10px] font-normal text-teal-100/70">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

const ReportIssueCTA = ({ onSubmit }) => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("");

    if (message.trim().length < 8) {
      setStatus("Please write a short note about what needs fixing.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit?.({ message, email });
      setMessage("");
      setEmail("");
      setStatus("Thanks, your suggestion was sent.");
    } catch (error) {
      setStatus(error?.response?.data?.error || error?.response?.data?.message || "Could not send right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-5 overflow-hidden rounded-[1.7rem] bg-white/[0.035] p-px">
      <form onSubmit={handleSubmit} className="rounded-[1.65rem] bg-[#151a21]/78 p-5 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-300/10 text-orange-100 ring-1 ring-orange-200/10">
            <FaLightbulb size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold textColor">Suggest an edit or report an issue</p>
            <p className="mt-1 text-xs leading-5 textColor opacity-52">Found a typo, broken example, or outdated step? Send it directly from here.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-[minmax(0,1fr)_220px]">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="What should be fixed?"
            rows={3}
            className="min-h-[76px] rounded-[1.1rem] bg-white/[0.045] px-4 py-3 text-xs leading-5 textColor outline-none ring-1 ring-white/[0.045] placeholder:text-white/28 focus:ring-orange-200/15"
          />
          <div className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="email optional"
              className="h-10 rounded-full bg-white/[0.045] px-4 text-xs textColor outline-none ring-1 ring-white/[0.045] placeholder:text-white/28 focus:ring-orange-200/15"
            />
            <button type="submit" disabled={isSubmitting} className="h-10 rounded-full bg-white px-4 text-xs font-normal text-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Sending..." : "Send suggestion"}
            </button>
          </div>
        </div>
        {status && <p className="mt-3 px-1 text-[10px] font-normal text-orange-100/70">{status}</p>}
      </form>
    </div>
  );
};

const CopyToast = ({ label }) => {
  return (
    <div className="fixed bottom-24 left-1/2 z-[999] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-normal text-black shadow-[0_16px_44px_rgba(0,0,0,0.28)]">
      {label}
    </div>
  );
};

const BackToTopButton = ({ visible }) => {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-[998] flex size-11 items-center justify-center rounded-full bg-white/[0.08] textColor shadow-[0_16px_44px_rgba(0,0,0,0.28)] ring-1 ring-white/[0.08] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/[0.12]"
      aria-label="Back to top"
    >
      <FaArrowUp size={14} />
    </button>
  );
};

const AuthorPill = ({ authorName, authorAvatar, seed }) => {
  return (
    <div className="inline-flex h-9 items-center gap-2 rounded-full bg-white/[0.055] px-2.5 pr-4 textColor shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] ring-1 ring-white/[0.04] backdrop-blur-2xl">
      {authorAvatar ? (
        <img src={authorAvatar} alt={authorName} className="size-7 rounded-full object-cover ring-1 ring-white/20" />
      ) : (
        <div className="flex size-7 items-center justify-center rounded-full text-xs font-normal text-white ring-1 ring-white/20" style={{ background: generateItemColor(seed || "G") }}>
          {authorName?.charAt(0) || "G"}
        </div>
      )}
      <span className="text-xs font-normal capitalize">{authorName}</span>
    </div>
  );
};

const MetaPill = ({ icon, label, tone = "bg-white/[0.045] text-cyan-100/75 ring-white/[0.055]" }) => {
  return (
    <div className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white/[0.052] px-3 text-xs font-normal textColor opacity-86 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] ring-1 ring-white/[0.04] backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/[0.07] hover:opacity-95">
      {icon && <span className={`flex size-6 items-center justify-center rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ring-1 ${tone}`}>{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

const SidePanel = ({ eyebrow, title, children }) => {
  return (
    <div className="group relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-white/[0.09] via-white/[0.035] to-white/[0.018] p-px shadow-[0_22px_70px_rgba(0,0,0,0.22)]">
      <div className="relative overflow-hidden rounded-[1.7rem] bg-[#161b22]/92 p-5 backdrop-blur-2xl">
        <span className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-cyan-300/[0.07] blur-3xl transition group-hover:bg-cyan-300/[0.1]"></span>
        <span className="pointer-events-none absolute -bottom-16 left-6 size-28 rounded-full bg-fuchsia-300/[0.035] blur-3xl"></span>

        <div className="relative">
          {eyebrow && (
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/[0.035] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-teal-100/55 ring-1 ring-white/[0.045]">
              <span className="size-1.5 rounded-full bg-teal-200/70 shadow-[0_0_14px_rgba(94,234,212,0.45)]"></span>
              {eyebrow}
            </p>
          )}
          <HeadingTwo className="mb-4 !text-base !font-semibold">{title}</HeadingTwo>
          {children}
        </div>
      </div>
    </div>
  );
};

const ReaderTools = ({ searchTerm, setSearchTerm, searchResultCount, isSpeaking, onReadAloud, onStopReading, resumePosition, onResume }) => {
  return (
    <div className="space-y-3.5">
      <div className="rounded-[1.35rem] bg-white/[0.035] p-3 ring-1 ring-white/[0.045]">
        <label className="mb-2 flex items-center justify-between gap-2 px-1 text-[10px] font-semibold uppercase tracking-[0.15em] textColor opacity-50">
          <span className="flex items-center gap-2">Search article</span>
          {searchTerm && <span className="rounded-full bg-cyan-300/10 px-2 py-0.5 text-[9px] text-cyan-100/70">{searchResultCount}</span>}
        </label>
        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={12} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Find words..."
            className="h-11 w-full rounded-2xl bg-black/20 pl-9 pr-3 text-sm textColor outline-none ring-1 ring-white/[0.035] transition placeholder:text-white/25 focus:bg-black/28 focus:ring-cyan-200/18"
          />
        </div>
        {searchTerm && (
          <p className="mt-2 px-1 text-[10px] textColor opacity-55">
            {searchResultCount} {searchResultCount === 1 ? "match" : "matches"} found
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onReadAloud}
          className="group relative flex h-12 items-center justify-center gap-2 overflow-hidden rounded-[1.1rem] bg-gradient-to-b from-cyan-300/[0.12] to-cyan-300/[0.04] text-xs font-semibold text-cyan-50/85 ring-1 ring-cyan-200/[0.1] transition hover:-translate-y-0.5 hover:from-cyan-300/[0.18] hover:to-cyan-300/[0.07]"
        >
          <span className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent"></span>
          <span className="flex size-7 items-center justify-center rounded-full bg-white/[0.06]">{isSpeaking ? <FaPause size={11} /> : <FaPlay size={11} />}</span>
          {isSpeaking ? "Pause" : "Listen"}
        </button>
        <button
          type="button"
          onClick={onStopReading}
          className="flex h-12 items-center justify-center gap-2 rounded-[1.1rem] bg-white/[0.035] text-xs font-semibold textColor opacity-78 ring-1 ring-white/[0.045] transition hover:-translate-y-0.5 hover:bg-white/[0.065] hover:opacity-95"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-white/[0.05]">
            <FaStop size={10} />
          </span>
          Stop
        </button>
      </div>

      {resumePosition > 350 && (
        <button
          type="button"
          onClick={onResume}
          className="relative h-12 w-full overflow-hidden rounded-[1.15rem] bg-white/[0.035] text-left text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/78 ring-1 ring-cyan-200/[0.1] transition hover:-translate-y-0.5 hover:bg-white/[0.06]"
        >
          <span className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-cyan-300 to-purple-300"></span>
          <span className="block px-4 pl-5">Resume where you left</span>
        </button>
      )}
    </div>
  );
};

const ReactionPanel = ({ reactions, onReact }) => {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {reactionOptions.map((reaction) => (
        <button
          key={reaction.key}
          type="button"
          onClick={() => onReact(reaction.key)}
          className="group rounded-[1.25rem] bg-gradient-to-br from-white/[0.055] to-white/[0.025] p-3 text-left ring-1 ring-white/[0.045] transition hover:-translate-y-0.5 hover:bg-white/[0.06] hover:ring-white/[0.09]"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-black/20 text-teal-100/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition group-hover:scale-105 group-hover:text-teal-50">
            {reaction.icon}
          </span>
          <span className="mt-2 block text-xs font-semibold textColor">{reaction.label}</span>
          <span className="mt-1 block text-[10px] textColor opacity-48">{reactions[reaction.key] || 0} reactions</span>
        </button>
      ))}
    </div>
  );
};

const QuoteSelectionBar = ({ quote, copied, onCopy, onClose }) => {
  return (
    <div className="fixed bottom-6 left-1/2 z-[999] w-[min(92vw,720px)] -translate-x-1/2 overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-white/[0.12] via-white/[0.05] to-white/[0.025] p-px shadow-[0_28px_100px_rgba(0,0,0,0.52)]">
      <div className="relative rounded-[1.55rem] bg-[#151a21]/94 p-4 backdrop-blur-2xl">
        <span className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-100/45 to-transparent"></span>
        <div className="flex gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-cyan-300/10 text-cyan-100 ring-1 ring-cyan-200/10">
            <FaQuoteLeft size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm leading-6 textColor opacity-78">"{quote}"</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCopy}
                className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-[0_10px_28px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(255,255,255,0.16)]"
              >
                {copied ? "Copied quote" : "Copy quote"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/[0.055] px-4 py-2 text-xs font-semibold textColor ring-1 ring-white/[0.04] transition hover:-translate-y-0.5 hover:bg-white/[0.085]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableOfContents = ({ items, activeHeading }) => {
  if (!items.length) {
    return <InputLabel className="textColor opacity-55">Headings will appear here when this article has sections.</InputLabel>;
  }

  return (
    <div className="h-full  space-y-1  pr-1">
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={`#${item.id}`}
          className={`relative block rounded-2xl px-3 py-2 text-xs font-semibold leading-5 transition ${activeHeading === item.id ? "bg-cyan-300/10 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.08)]" : "textColor opacity-52 hover:bg-white/[0.035] hover:opacity-85"}`}
          style={{ marginLeft: `${Math.max(item.level - 2, 0) * 12}px` }}
        >
          {activeHeading === item.id && <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-cyan-200/70"></span>}
          {item.text}
        </NavLink>
      ))}
    </div>
  );
};

const AuthorCard = ({ authorName, authorAvatar, seed, totalBlogs }) => {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white/[0.08] via-white/[0.035] to-white/[0.018] p-px">
      <div className="relative rounded-[1.95rem] bg-[#171b22]/94 p-5 backdrop-blur-2xl md:p-6">
        <span className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-teal-300/[0.08] blur-3xl"></span>
        <span className="pointer-events-none absolute -bottom-20 left-20 size-44 rounded-full bg-purple-300/[0.055] blur-3xl"></span>
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {authorAvatar ? (
              <img src={authorAvatar} alt={authorName} className="size-16 rounded-2xl object-cover ring-1 ring-white/10" />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-2xl text-2xl font-semibold text-white ring-1 ring-white/10" style={{ background: generateItemColor(seed || "G") }}>
                {authorName?.charAt(0) || "G"}
              </div>
            )}
            <div>
              <p className="inline-flex rounded-full bg-teal-300/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-teal-100/60 ring-1 ring-teal-200/10">Author</p>
              <h3 className="mt-1 text-xl font-semibold textColor">{authorName}</h3>
              <p className="mt-1 text-sm textColor opacity-55">Full stack developer sharing build notes, lessons, and practical product ideas.</p>
            </div>
          </div>
          <div className="rounded-[1.35rem] bg-white/[0.035] px-5 py-4 text-center ring-1 ring-white/[0.045]">
            <p className="text-2xl font-semibold textColor">{totalBlogs}</p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] textColor opacity-45">Published</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrevNextNavigation = ({ previousBlog, nextBlog }) => {
  if (!previousBlog && !nextBlog) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <BlogNavCard label="Previous article" blog={previousBlog} align="left" />
      <BlogNavCard label="Next article" blog={nextBlog} align="right" />
    </div>
  );
};

const BlogNavCard = ({ label, blog, align }) => {
  if (!blog) {
    return <div className="hidden rounded-[1.75rem] bg-white/[0.018] p-5 ring-1 ring-white/[0.035] md:block"></div>;
  }

  return (
    <NavLink
      to={`/view-blog/${blog.slug}`}
      className={`group relative overflow-hidden rounded-[1.75rem] bg-[#171b22]/94 p-5 ring-1 ring-white/[0.045] transition hover:-translate-y-0.5 hover:bg-[#1b2028] hover:ring-white/[0.08] ${align === "right" ? "text-right" : "text-left"}`}
    >
      <span className={`pointer-events-none absolute top-0 h-px w-32 bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent ${align === "right" ? "right-5" : "left-5"}`}></span>
      <div className={`mb-4 flex items-center gap-2 ${align === "right" ? "justify-end" : "justify-start"}`}>
        <span className="rounded-full bg-white/[0.04] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-teal-100/55 ring-1 ring-white/[0.04]">{label}</span>
      </div>
      <h3 className="line-clamp-2 text-base font-semibold leading-6 textColor transition group-hover:text-teal-200">{blog.title}</h3>
      <p className="mt-2 line-clamp-2 text-xs leading-5 textColor opacity-52">{blog.metaDescription}</p>
    </NavLink>
  );
};

const RelatedBlogs = ({ blogs }) => {
  if (!blogs?.length) return null;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#171b22]/94 p-5 ring-1 ring-white/[0.045] md:p-6">
      <span className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-cyan-300/[0.06] blur-3xl"></span>
      <div className="relative mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="inline-flex rounded-full bg-white/[0.035] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-teal-100/55 ring-1 ring-white/[0.045]">Keep reading</p>
          <h2 className="mt-1 text-xl font-semibold textColor">Related blogs</h2>
        </div>
      </div>
      <div className="relative grid gap-4 md:grid-cols-3">
        {blogs.map((blog) => (
          <NavLink
            key={blog?._id || blog?.slug}
            to={`/view-blog/${blog.slug}`}
            className="group overflow-hidden rounded-[1.45rem] bg-white/[0.03] p-2.5 ring-1 ring-white/[0.035] transition hover:-translate-y-0.5 hover:bg-white/[0.05] hover:ring-white/[0.07]"
          >
            <div className="relative h-36 overflow-hidden rounded-[1.1rem]">
              <img src={blog?.cover?.filePath || BlogImg} alt={blog?.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111821]/75 via-transparent to-transparent"></div>
              <span className="absolute bottom-2 left-2 rounded-full bg-black/35 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/75 backdrop-blur-xl">
                {blog?.category?.title || "Article"}
              </span>
            </div>
            <div className="px-2 pb-2 pt-4">
              <h3 className="line-clamp-2 text-sm font-semibold leading-5 textColor">{truncateText(blog?.title, 72)}</h3>
              <p className="mt-2 line-clamp-2 text-[11px] leading-5 textColor opacity-45">{blog?.metaDescription}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const BlogSeries = ({ blogs, category }) => {
  if (!blogs?.length) return null;

  return (
    <div className="rounded-[2rem] bg-[#171b22]/94 p-5 ring-1 ring-white/[0.045] md:p-6">
      <p className="inline-flex rounded-full bg-purple-300/[0.08] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-purple-100/60 ring-1 ring-purple-200/10">Series</p>
      <h2 className="mt-1 text-xl font-semibold textColor">More from {category}</h2>
      <div className="mt-5 space-y-2.5">
        {blogs.map((blogItem, index) => (
          <NavLink
            key={blogItem?._id || blogItem?.slug}
            to={`/view-blog/${blogItem.slug}`}
            className="group flex items-center gap-3 rounded-[1.2rem] bg-white/[0.03] p-3 ring-1 ring-white/[0.035] transition hover:bg-white/[0.055] hover:ring-white/[0.07]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.055] text-xs font-semibold textColor opacity-75 transition group-hover:bg-cyan-300/10 group-hover:text-cyan-100">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="line-clamp-1 text-sm font-semibold textColor">{blogItem.title}</span>
              <span className="mt-1 block text-[10px] textColor opacity-45">Part {index + 1} in this topic</span>
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const ShareBlogPanel = ({ blog, coverImage, shareUrl, shareText, copied, onCopy, onShare }) => {
  const encodedUrl = encodeURIComponent(shareUrl || "");
  const encodedText = encodeURIComponent(shareText || "");
  const previewUrl = shareUrl ? shareUrl.replace(/^https?:\/\//, "") : "localhost/blog";

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
      <div className="overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-white/[0.065] to-white/[0.025] p-px">
        <div className="overflow-hidden rounded-[1.3rem] bg-black/20">
          <div className="relative h-32 overflow-hidden">
            <img src={coverImage} alt={blog?.title || "Share preview"} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151a21] via-[#151a21]/25 to-transparent"></div>
            <span className="absolute right-3 top-3 rounded-full bg-black/35 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-white/70 backdrop-blur-xl">Preview</span>
          </div>
          <div className="p-3">
            <p className="line-clamp-2 text-sm font-semibold leading-5 textColor">{blog?.title || "Gorkcoder Blog"}</p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-4 textColor opacity-55">{blog?.metaDescription || "Read this blog on Gorkcoder."}</p>
            <p className="mt-3 truncate rounded-full bg-white/[0.035] px-3 py-2 text-[10px] font-medium text-teal-100/60 ring-1 ring-white/[0.035]">{previewUrl}</p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.3rem] bg-black/18 p-3 ring-1 ring-white/[0.04]">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] textColor opacity-45">Post preview</p>
          <span className="rounded-full bg-white/[0.055] px-3 py-1 text-[9px] font-semibold textColor opacity-55">Social</span>
        </div>
        <p className="line-clamp-4 whitespace-pre-line text-xs leading-5 textColor opacity-78">{shareText}</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {socialLinks.map((item) =>
          item.href ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => onShare?.(item.label.toLowerCase())}
              className="group flex items-center gap-3 rounded-[1.15rem] bg-white/[0.035] p-2.5 ring-1 ring-white/[0.035] transition hover:bg-white/[0.06] hover:ring-white/[0.075]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">{item.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold textColor">{item.label}</span>
                <span className="block text-[10px] textColor opacity-45">{item.caption}</span>
              </span>
              <span className="text-xs textColor opacity-35 transition group-hover:translate-x-0.5 group-hover:opacity-70">Open</span>
            </a>
          ) : (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                onCopy?.(item.label.toLowerCase());
              }}
              className="group flex items-center gap-3 rounded-[1.15rem] bg-white/[0.035] p-2.5 text-left ring-1 ring-white/[0.035] transition hover:bg-white/[0.06] hover:ring-white/[0.075]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">{item.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold textColor">{item.label}</span>
                <span className="block text-[10px] textColor opacity-45">{item.caption}</span>
              </span>
              <span className="text-xs textColor opacity-35 transition group-hover:opacity-70">Copy</span>
            </button>
          ),
        )}
      </div>

      <ActionButton className="blog-glass-action flexC !h-11 w-full gap-2 !px-4">
        <AiOutlineLink size={18} className="text-gray-200" />
        <button type="button" onClick={() => onCopy?.("copy")}>
          {copied ? "Copied link" : "Copy link"}
        </button>
      </ActionButton>
    </div>
  );
};
