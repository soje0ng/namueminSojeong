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

const getMobileCappedPaddingValue = (
  val: any,
  fallback: string = "30px",
  max: number = 30,
) => {
  const formatted = formatUnit(val);

  if (!formatted) return fallback;

  const numeric = Number.parseFloat(String(formatted));
  if (!Number.isFinite(numeric) || numeric <= max) {
    return formatted;
  }

  const unitMatch = String(formatted).match(/[a-z%]+$/i);
  const unit = unitMatch?.[0] || "px";
  return `${max}${unit}`;
};

export const useWidgetStyle = (
  style?: WidgetStyle,
  viewport: "mobile" | "tablet" | "desktop" = "desktop",
) => {
  const isMobile = viewport === "mobile";
  const hasExplicitPaddingTop =
    style?.paddingTop !== undefined &&
    style?.paddingTop !== null &&
    String(style.paddingTop).trim() !== "";
  const hasExplicitPaddingBottom =
    style?.paddingBottom !== undefined &&
    style?.paddingBottom !== null &&
    String(style.paddingBottom).trim() !== "";
  const mobilePaddingTop = hasExplicitPaddingTop
    ? getMobileCappedPaddingValue(style?.paddingTop, "0px")
    : "30px";
  const mobilePaddingBottom = hasExplicitPaddingBottom
    ? getMobileCappedPaddingValue(style?.paddingBottom, "0px")
    : "30px";
  return {
    "--widget-padding-top": hasExplicitPaddingTop
      ? formatUnit(style?.paddingTop) || "0px"
      : undefined,
    "--widget-padding-bottom": hasExplicitPaddingBottom
      ? formatUnit(style?.paddingBottom) || "0px"
      : undefined,
    "--widget-mobile-padding-top": mobilePaddingTop,
    "--widget-mobile-padding-bottom": mobilePaddingBottom,
    paddingTop: isMobile ? mobilePaddingTop : formatUnit(style?.paddingTop),
    paddingBottom: isMobile
      ? mobilePaddingBottom
      : formatUnit(style?.paddingBottom),
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
  if (!style) return { maxWidth: "100%", lineHeight: "150%" };

  let fontSize =
    viewport === "mobile" && style.fontSizeMobile
      ? formatUnit(style.fontSizeMobile)
      : style.fontSize
        ? formatUnit(style.fontSize)
        : undefined;

  // No automatic font size adjustments. Respect the explicit fontSize/fontSizeMobile provided.

  const rawBackgroundImage = (style as any).backgroundImage;
  const normalizedBackgroundImage =
    typeof rawBackgroundImage === "string" && rawBackgroundImage.trim()
      ? (() => {
          const trimmed = rawBackgroundImage.trim();
          if (trimmed.toLowerCase() === "none") return "none";
          const isCssBackgroundValue =
            /^url\(/i.test(trimmed) ||
            /gradient\(/i.test(trimmed) ||
            /^var\(/i.test(trimmed);
          return isCssBackgroundValue ? trimmed : `url(${trimmed})`;
        })()
      : undefined;

  const result = {
    fontSize,
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight,
    color: style.color,
    lineHeight: (style as any).lineHeight || "150%",
    backgroundColor: style.backgroundColor,
    backgroundImage: normalizedBackgroundImage,
    backgroundSize:
      normalizedBackgroundImage && normalizedBackgroundImage !== "none"
        ? (style as any).backgroundSize || "cover"
        : undefined,
    backgroundPosition:
      normalizedBackgroundImage && normalizedBackgroundImage !== "none"
        ? (style as any).backgroundPosition || "center"
        : undefined,
    backgroundRepeat:
      normalizedBackgroundImage && normalizedBackgroundImage !== "none"
        ? (style as any).backgroundRepeat || "no-repeat"
        : undefined,
    borderColor: style.borderColor,
    borderWidth: style.borderColor ? style.borderWidth || "1px" : undefined,
    borderStyle: style.borderColor ? "solid" : undefined,
    textAlign: style.textAlign,
    width: style.width ? formatUnit(style.width) : undefined,
    height: style.height ? formatUnit(style.height) : undefined,
    objectFit: style.objectFit,
    borderRadius: getBorderRadiusStyle(viewport, style.borderRadius),
    padding: (style as any).padding
      ? formatUnit((style as any).padding)
      : undefined,
    margin: (style as any).margin
      ? formatUnit((style as any).margin)
      : undefined,
    boxShadow: (style as any).boxShadow,
    opacity: (style as any).opacity,
    cursor: "pointer",
    display: (style as any).isHidden
      ? "none"
      : (style as any).display || "inline-block",
  } as React.CSSProperties;

  Object.keys(result).forEach(
    (key) => (result as any)[key] === undefined && delete (result as any)[key],
  );

  return result;
};

export const mergeTextStyleWithFallback = (
  style?: ElementStyle,
  fallbackStyle: Partial<ElementStyle> = {},
) => {
  const mergedStyle = {
    ...fallbackStyle,
    ...(style || {}),
  } as ElementStyle;

  const hasDesktopFontSize =
    style?.fontSize !== undefined && style.fontSize !== "";
  const hasMobileFontSize =
    style?.fontSizeMobile !== undefined && style.fontSizeMobile !== "";

  if ((mergedStyle as any).fontSizeMobile === "") {
    delete (mergedStyle as any).fontSizeMobile;
  }

  if (hasDesktopFontSize && !hasMobileFontSize) {
    delete (mergedStyle as any).fontSizeMobile;
  }

  return mergedStyle;
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
    if (styleAny.srcMobile !== undefined && styleAny.srcMobile !== "") return styleAny.srcMobile;
    // Fallback to PC image if mobile image is not set
    if (styleAny.src !== undefined && styleAny.src !== "") return styleAny.src;
  }

  // 2. Default/PC view: Use src if it exists, else defaultUrl
  return styleAny.src !== undefined ? styleAny.src : defaultUrl;
};

/**
 * getPaddingClass helper to handle responsive padding based on viewport prop
 * Ensures tablet/mobile have fixed safe padding even in high-res builder preview.
 */
export const getPaddingClass = (
  viewport: string,
  desktopPadding: string = "xl:px-[280px]",
) => {
  if (viewport === "tablet") return "px-6"; // 24px fixed
  if (viewport === "mobile") return "px-5"; // 20px fixed
  return `px-5 md:px-10 ${desktopPadding}`.trim(); // Desktop (Responsive)
};

type WidgetVerticalPaddingFallbacks = {
  desktopTop: string;
  desktopBottom: string;
  tabletTop?: string;
  tabletBottom?: string;
  mobileTop?: string;
  mobileBottom?: string;
};

export const getWidgetVerticalPaddingStyle = (
  style: WidgetStyle | undefined,
  viewport: "mobile" | "tablet" | "desktop" = "desktop",
  fallbacks: WidgetVerticalPaddingFallbacks = {
    desktopTop: "56px",
    desktopBottom: "56px",
    tabletTop: "56px",
    tabletBottom: "56px",
    mobileTop: "30px",
    mobileBottom: "30px",
  },
) => {
  const hasExplicitPaddingTop =
    style?.paddingTop !== undefined &&
    style?.paddingTop !== null &&
    String(style.paddingTop).trim() !== "";
  const hasExplicitPaddingBottom =
    style?.paddingBottom !== undefined &&
    style?.paddingBottom !== null &&
    String(style.paddingBottom).trim() !== "";

  const fallbackTop =
    viewport === "mobile"
      ? fallbacks.mobileTop || "30px"
      : viewport === "tablet"
        ? fallbacks.tabletTop || fallbacks.desktopTop
        : fallbacks.desktopTop;
  const fallbackBottom =
    viewport === "mobile"
      ? fallbacks.mobileBottom || "30px"
      : viewport === "tablet"
        ? fallbacks.tabletBottom || fallbacks.desktopBottom
        : fallbacks.desktopBottom;

  return {
    paddingTop: hasExplicitPaddingTop
      ? viewport === "mobile"
        ? getMobileCappedPaddingValue(style?.paddingTop, "0px")
        : formatUnit(style?.paddingTop) || "0px"
      : fallbackTop,
    paddingBottom: hasExplicitPaddingBottom
      ? viewport === "mobile"
        ? getMobileCappedPaddingValue(style?.paddingBottom, "0px")
        : formatUnit(style?.paddingBottom) || "0px"
      : fallbackBottom,
  } as React.CSSProperties;
};

/**
 * getVerticalPaddingClass helper to handle responsive vertical padding
 * Mobile: 30px, Tablet/Desktop: 56px (py-14) or similar
 */
export const getVerticalPaddingClass = (
  viewport: string,
  desktopPadding: string = "py-14",
) => {
  const nonMobilePaddingClassMap: Record<string, string> = {
    "py-0":
      "pt-[var(--widget-padding-top,0px)] pb-[var(--widget-padding-bottom,0px)]",
    "py-12":
      "pt-[var(--widget-padding-top,48px)] pb-[var(--widget-padding-bottom,48px)]",
    "py-14":
      "pt-[var(--widget-padding-top,56px)] pb-[var(--widget-padding-bottom,56px)]",
    "py-16":
      "pt-[var(--widget-padding-top,64px)] pb-[var(--widget-padding-bottom,64px)]",
    "py-20":
      "pt-[var(--widget-padding-top,80px)] pb-[var(--widget-padding-bottom,80px)]",
    "py-24":
      "pt-[var(--widget-padding-top,96px)] pb-[var(--widget-padding-bottom,96px)]",
    "py-28":
      "pt-[var(--widget-padding-top,112px)] pb-[var(--widget-padding-bottom,112px)]",
    "py-[60px]":
      "pt-[var(--widget-padding-top,60px)] pb-[var(--widget-padding-bottom,60px)]",
  };

  if (viewport === "mobile") {
    return "pt-[var(--widget-mobile-padding-top)] pb-[var(--widget-mobile-padding-bottom)]";
  }
  return nonMobilePaddingClassMap[desktopPadding] ||
    nonMobilePaddingClassMap["py-14"];
};

/**
 * getBorderRadiusClass helper to handle responsive border radius
 */
export const getBorderRadiusClass = (
  viewport: string | undefined,
  radiusClass: string,
) => {
  if (
    !radiusClass ||
    radiusClass === "" ||
    radiusClass.includes("rounded-none") ||
    radiusClass.includes("[0px]") ||
    radiusClass.includes("[0]")
  ) {
    return radiusClass;
  }
  if (viewport === "mobile") return "rounded-lg"; // 8px 고정
  return radiusClass;
};

/**
 * getBorderRadiusStyle helper to handle responsive border radius in inline styles
 */
export const getBorderRadiusStyle = (
  viewport: string | undefined,
  desktopValue: string | number | undefined,
) => {
  const radius = String(desktopValue || "");
  if (
    !radius ||
    radius === "" ||
    radius === "0" ||
    radius === "0px" ||
    radius === "none"
  ) {
    return formatUnit(desktopValue);
  }
  if (viewport === "mobile") return "8px";
  return formatUnit(desktopValue);
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
  const stripInlineTypographyStyles = (sourceHtml?: string) => {
    if (!sourceHtml || typeof sourceHtml !== "string") return "";

    return sourceHtml
      .replace(/style=(['"])(.*?)\1/gi, (_match, quote, styleText) => {
        const cleanedStyle = String(styleText)
          .split(";")
          .map((rule) => rule.trim())
          .filter(Boolean)
          .filter(
            (rule) =>
              !/^(font-size|font-weight|line-height|letter-spacing|font-family)\s*:/i.test(
                rule,
              ),
          )
          .join("; ");

        return cleanedStyle ? `style=${quote}${cleanedStyle}${quote}` : "";
      })
      .replace(/\sstyle=(['"])\1/gi, "");
  };

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
    return stripInlineTypographyStyles(html);
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
        onClick={onClick}
        onDoubleClick={onDoubleClick}
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
      style={{ display: "inline-block", ...style }}
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
  naturalSize?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDoubleClick?: (e: React.MouseEvent) => void;
}> = ({
  url,
  mediaType,
  className,
  style,
  alt = "",
  naturalSize = false,
  autoPlay = false,
  muted = false,
  loop = false,
  onClick,
  onDoubleClick,
}) => {
  const isEditor = !!onDoubleClick || !!onClick;

  if (!url) {
    if (isEditor) {
      return (
        <div
          className="w-full h-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
          style={style}
          onDoubleClick={onDoubleClick}
          onClick={onClick}
        >
          {mediaType === "video" ? "비디오 설정" : "이미지 설정"}
        </div>
      );
    }
    return null;
  }

  const isVideo =
    mediaType === "video" || (mediaType !== "image" && isVideoUrl(url));

  const renderMedia = () => {
    // Shared media styles for consistent object-fit and full-content scaling
    const mediaStyle: React.CSSProperties = {
      width: naturalSize ? (style?.width ? style.width : "auto") : "100%",
      height: naturalSize
        ? style?.height
          ? style.height
          : "auto"
        : style?.height && style.height !== "auto"
          ? style.height
          : "100%",
      objectFit:
        (style?.objectFit as any) || (naturalSize ? "contain" : "cover"),
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
          onDoubleClick={onDoubleClick}
          onClick={onClick}
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
          onDoubleClick={onDoubleClick}
          onClick={onClick}
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
          onDoubleClick={onDoubleClick}
          onClick={onClick}
        />
      );
    }

    return (
      <img
        src={url}
        className={naturalSize ? "max-w-full" : "w-full h-full object-cover"}
        style={
          naturalSize
            ? mediaStyle
            : { ...mediaStyle, height: "100%", width: "100%" }
        }
        alt={alt}
        onDoubleClick={onDoubleClick}
        onClick={onClick}
      />
    );
  };

  // Container gets dimensions and alignment; Child media handles object-fit
  const isVideoMedia = isVideo;
  const showEditorShield = isEditor && isVideoMedia;

  const containerStyle: React.CSSProperties = {
    ...style,
    position: "relative",
    overflow: "hidden",
    display:
      style?.display === "none"
        ? "none"
        : naturalSize
          ? "inline-block"
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
      {showEditorShield && (
        <div
          className="absolute inset-0 z-[50] cursor-pointer bg-transparent"
          onDoubleClick={onDoubleClick}
          onClick={(e) => {
            // Prevent single clicks from doing anything (like playing video or following links)
            e.preventDefault();
            e.stopPropagation();
            onClick?.(e);
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
