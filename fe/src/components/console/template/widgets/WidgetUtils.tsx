import React from "react";
import { Widget, WidgetStyle, ElementStyle } from "@/types/console/template";

export const formatUnit = (val: any, unit: string = "px") => {
  if (val === undefined || val === null || val === "") return undefined;
  if (typeof val === "number") return `${val}${unit}`;
  if (typeof val === "string") {
    // If it's already a string with a unit (px, rem, %, etc.), return as is
    if (isNaN(Number(val)) && val.trim() !== "") return val;
    // If it's a numeric string, append the unit
    if (val.trim() === "") return undefined;
    return `${val}${unit}`;
  }
  return val;
};

export const useWidgetStyle = (style?: WidgetStyle) => {
  return {
    paddingTop: formatUnit(style?.paddingTop),
    paddingBottom: formatUnit(style?.paddingBottom),
    marginTop: formatUnit(style?.marginTop),
    marginBottom: formatUnit(style?.marginBottom),
    backgroundColor: style?.backgroundColor,
    backgroundImage: style?.backgroundImage
      ? `url(${style.backgroundImage})`
      : undefined,
    backgroundSize: style?.backgroundSize || "cover",
    backgroundPosition: style?.backgroundPosition || "center",
    backgroundRepeat: style?.backgroundRepeat || "no-repeat",
    color: style?.textColor,
    textAlign: style?.textAlign || "left",
    gap: formatUnit(style?.gap),
  } as React.CSSProperties;
};

export const getElementStyle = (
  style?: ElementStyle,
  viewport: "mobile" | "tablet" | "desktop" = "desktop",
) => {
  if (!style) return { maxWidth: "100%" };

  let fontSize =
    viewport === "mobile" && style.fontSizeMobile
      ? formatUnit(style.fontSizeMobile)
      : formatUnit(style.fontSize);

  const result = {
    fontSize,
    fontWeight: style.fontWeight,
    color: style.color,
    backgroundColor: style.backgroundColor,
    borderColor: style.borderColor,
    borderWidth: style.borderColor ? style.borderWidth || "1px" : undefined,
    borderStyle: style.borderColor ? "solid" : undefined,
    textAlign: style.textAlign,
    width: style.width ? formatUnit(style.width) : undefined,
    height: style.height ? formatUnit(style.height) : undefined,
    objectFit: style.objectFit,
    borderRadius: style.borderRadius
      ? formatUnit(style.borderRadius)
      : undefined,
    maxWidth: "100%",
    cursor: "pointer",
    display: (style as any).isHidden ? "none" : undefined,
  } as React.CSSProperties;

  Object.keys(result).forEach(
    (key) => (result as any)[key] === undefined && delete (result as any)[key],
  );

  return result;
};

/**
 * getImageUrl helper to handle responsive image sources
 */
export const getImageUrl = (
  style?: ElementStyle,
  viewport: "mobile" | "tablet" | "desktop" = "desktop",
  defaultUrl: string = "https://placehold.co/600x400",
) => {
  if (!style) return defaultUrl;

  const styleAny = style as any;

  // 1. Mobile view: Only use srcMobile if it exists.
  if (viewport === "mobile") {
    if (styleAny.srcMobile) return styleAny.srcMobile;
    // Fallback to PC image if mobile image is not set
    if (styleAny.src) return styleAny.src;
  }

  // 2. Default/PC view: Use src if it exists, else defaultUrl
  return styleAny.src || defaultUrl;
};

// Safe HTML Component with placeholder support for empty content
export const SafeHtml: React.FC<{
  html?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
  as?: string;
  placeholder?: string;
}> = ({
  html,
  className,
  style,
  onClick,
  onDoubleClick,
  as = "div",
  placeholder = "텍스트를 입력하세요",
}) => {
  const Tag = as as any;
  const isEditMode = !!onDoubleClick;

  // All hooks must be called before any conditional returns (React hooks rules)
  // Check if content is empty (empty string, only whitespace, or empty HTML tags)
  const isEmpty = React.useMemo(() => {
    if (!html || typeof html !== "string") return true;
    const stripped = html
      .replace(/<br\s*\/?>/gi, "")
      .replace(/<p><\/p>/gi, "")
      .replace(/&nbsp;/gi, "")
      .replace(/<[^>]*>/g, "")
      .trim();
    return stripped === "";
  }, [html]);

  // Remove inline styles from the HTML content so that the outer style prop takes precedence
  const cleanHtml = React.useMemo(() => {
    if (!html || typeof html !== "string") return "";
    return html;
  }, [html]);

  // Edit mode + empty content = show placeholder
  if (isEmpty && isEditMode) {
    return (
      <Tag
        className={className}
        style={{
          ...style,
          color: "#9CA3AF",
          fontStyle: "italic",
          minWidth: "100px",
          minHeight: "1em",
        }}
      >
        {placeholder || "텍스트를 입력하세요"}
      </Tag>
    );
  }

  if (isEmpty) {
    return null;
  }

  return (
    <Tag
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    />
  );
};

// Media detection helpers
export const isYouTubeUrl = (url: string) => {
  return url.includes("youtube.com") || url.includes("youtu.be");
};

export const isVimeoUrl = (url: string) => {
  return url.includes("vimeo.com");
};

export const isDirectVideoUrl = (url: string) => {
  return (
    url.match(/\.(mp4|webm|ogg|mov)(\?|$)/i) !== null ||
    url.startsWith("data:video/") ||
    url.includes("#video")
  );
};

export const isVideoUrl = (url: string) => {
  return isYouTubeUrl(url) || isVimeoUrl(url) || isDirectVideoUrl(url);
};

export const getYouTubeEmbedUrl = (
  url: string,
  autoPlayEnabled?: boolean,
  mutedEnabled?: boolean,
  loopEnabled?: boolean,
) => {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtube.com/embed/")) {
    const parts = url.split("embed/");
    if (parts[1]) videoId = parts[1].split("?")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  } else {
    videoId = url;
  }
  if (!videoId) return url;
  let embed = `https://www.youtube.com/embed/${videoId}?rel=0`;
  if (autoPlayEnabled) embed += "&autoplay=1";
  if (loopEnabled) embed += "&loop=1&playlist=" + videoId;
  if (mutedEnabled || autoPlayEnabled) embed += "&mute=1";
  return embed;
};

export const getVimeoEmbedUrl = (
  url: string,
  autoPlayEnabled?: boolean,
  mutedEnabled?: boolean,
  loopEnabled?: boolean,
) => {
  if (!url) return "";
  let videoId = "";
  const match = url.match(
    /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/,
  );
  if (match && match[3]) videoId = match[3];
  else videoId = url;

  let embed = `https://player.vimeo.com/video/${videoId}`;
  const params = [];
  if (autoPlayEnabled) params.push("autoplay=1");
  if (loopEnabled) params.push("loop=1");
  if (mutedEnabled || autoPlayEnabled) params.push("muted=1");

  if (params.length > 0) embed += "?" + params.join("&");
  return embed;
};

// Universal Media Spinner/Renderer
export const UniversalMedia: React.FC<{
  url: string;
  mediaType?: "image" | "video"; // Explicit hint
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onDoubleClick?: (e: React.MouseEvent) => void;
}> = ({
  url,
  mediaType,
  className,
  style,
  alt = "",
  autoPlay = false,
  muted = false,
  loop = false,
  onDoubleClick,
}) => {
  if (!url) return null;

  const isVideo =
    mediaType === "video" || (mediaType !== "image" && isVideoUrl(url));
  const isEditor = !!onDoubleClick;

  const renderMedia = () => {
    // Shared media styles for consistent object-fit and full-content scaling
    const mediaStyle: React.CSSProperties = {
      width: "100%",
      height: style?.height === "auto" ? "auto" : "100%",
      objectFit: (style?.objectFit as any) || "cover",
      borderRadius: style?.borderRadius || "inherit",
      display: "block",
      border: "none",
      outline: "none",
      backgroundColor: "transparent",
    };

    if (isYouTubeUrl(url)) {
      return (
        <iframe
          className="absolute inset-0 w-full h-full border-0"
          src={getYouTubeEmbedUrl(url, !isEditor && autoPlay, muted, loop)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            borderRadius: style?.borderRadius,
            pointerEvents: isEditor ? "none" : "auto",
          }}
        />
      );
    }

    if (isVimeoUrl(url)) {
      return (
        <iframe
          className="absolute inset-0 w-full h-full border-0"
          src={getVimeoEmbedUrl(url, !isEditor && autoPlay, muted, loop)}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{
            borderRadius: style?.borderRadius,
            pointerEvents: isEditor ? "none" : "auto",
          }}
        />
      );
    }

    if (isDirectVideoUrl(url)) {
      return (
        <video
          src={url}
          className="w-full h-full"
          style={{
            ...mediaStyle,
            height: "100%",
            pointerEvents: isEditor ? "none" : "auto",
          }}
          controls={!isEditor}
          autoPlay={!isEditor && autoPlay}
          muted={muted || autoPlay}
          loop={loop}
        />
      );
    }

    return (
      <img src={url} className="w-full h-full" style={mediaStyle} alt={alt} />
    );
  };

  // Container gets dimensions and alignment; Child media handles object-fit
  const containerStyle: React.CSSProperties = {
    ...style,
    position: "relative",
    overflow: "hidden",
    display:
      style?.display === "none"
        ? "none"
        : style?.width && style.width !== "100%"
          ? "inline-block"
          : "block",
    maxWidth: "100%",
    // If it's a video and no height is provided, use aspect-video
    aspectRatio:
      isVideo && (!style?.height || style.height === "auto")
        ? style?.aspectRatio || "16/9"
        : style?.aspectRatio,
  };

  return (
    <div className={className} style={containerStyle}>
      {renderMedia()}

      {/* Editor Shield: Captures clicks to prevent video interaction/play in editor */}
      {isEditor && (
        <div
          className="absolute inset-0 z-[50] cursor-pointer bg-transparent"
          onDoubleClick={onDoubleClick}
          onClick={(e) => {
            // Prevent single clicks from doing anything (like playing video or following links)
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      )}
    </div>
  );
};

export interface WidgetRendererProps<T = Widget> {
  widget: T;
  onElementSelect?: (elementKey: string, itemId?: string) => void;
  viewport?: "mobile" | "tablet" | "desktop";
  onItemReorder?: (draggedId: string, targetId: string) => void;
}
