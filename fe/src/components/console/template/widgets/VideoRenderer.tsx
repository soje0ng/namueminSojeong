import React from "react";
import { VideoWidget } from "@/types/console/template";
import { WidgetHeader } from "./WidgetHeader";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  UniversalMedia,
  formatUnit,
} from "./WidgetUtils";

// 💡 [기본 폰트 사이즈 설정 안내]
// 이 영역의 값을 수정하면 비디오 위젯이 처음 추가될 때의 기본 크기가 변경됩니다.
// - PC 버전: fontSize: "36px"
// - 모바일 버전: fontSizeMobile: "28px"
export const VIDEO_DEFAULTS = {
  variant: "grid",
  title: "좌측타이틀영역",
  titleStyle: { fontSize: "36px", fontSizeMobile: "28px", fontWeight: "700" },
  subTitle: "서브타이틀영역입니다.",
  subTitleStyle: { fontSize: "18px" },
  items: [
    {
      id: "v1",
      type: "video",
      url: "https://www.youtube.com/watch?v=jicErY0RiMg",
      title: "영상 제목 1",
      desc: "설명 1",
      itemTitleStyle: { fontSize: "24px", fontSizeMobile: "20px" },
      itemDescStyle: { fontSize: "18px" },
    },
    {
      id: "i1",
      type: "image",
      url: "/images/template/video_thumb.jpg",
      title: "이미지 제목",
      desc: "설명",
      itemTitleStyle: { fontSize: "24px", fontSizeMobile: "20px" },
      itemDescStyle: { fontSize: "18px" },
    },
  ],
  autoPlay: false,
  muted: true,
  layout: "horizontal",
  itemTitleStyle: { fontSize: "24px", fontSizeMobile: "20px" },
  itemDescStyle: { fontSize: "18px" },
};

export const VIDEO_ITEM_DEFAULT = {
  type: "video",
  url: "https://www.youtube.com/watch?v=jicErY0RiMg",
  title: "새 항목",
  desc: "설명",
  itemTitleStyle: { fontSize: "24px", fontSizeMobile: "20px" },
  itemDescStyle: { fontSize: "18px" },
};

export const VideoRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as VideoWidget;
  const style = useWidgetStyle(w.style);
  const layout = w.data.layout || "horizontal";
  const items = w.data.items || [];

  // Grid Columns Logic based on viewport state
  const isSideBySide = layout === "horizontal";
  const itemsPerRow = w.data.itemsPerRow || (isSideBySide ? 2 : 3);
  const isDesktop = viewport === "desktop";
  const isTablet = viewport === "tablet";

  let gridClasses = "grid-cols-1";
  if (isDesktop) {
    const colMap: { [key: number]: string } = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
    };
    gridClasses = colMap[itemsPerRow] || "grid-cols-2";
  } else if (isTablet) {
    gridClasses = "grid-cols-2";
  } else {
    gridClasses = "grid-cols-1";
  }

  return (
    <section style={style} className="w-full h-auto">
      <div className="mx-auto w-full max-w-[1920px]">
        <div
          className={`flex gap-[0px] md:gap-[0px] ${isSideBySide && isDesktop ? "flex-row items-start" : "flex-col"} ${!isSideBySide ? "items-center text-center" : ""}`}
        >
          <WidgetHeader
            title={w.data.title}
            subTitle={w.data.subTitle}
            titleStyle={w.data.titleStyle}
            subTitleStyle={w.data.subTitleStyle}
            viewport={viewport as any}
            onElementSelect={onElementSelect}
            className={`${isSideBySide ? (isDesktop ? "text-left sticky top-[160px] w-[500px] shrink-0" : "text-left w-full mb-6") : "text-center mb-10 flex flex-col items-center w-full"}`}
          />
          <div
            className={`flex-1 w-full grid ${gridClasses} gap-8`}
            style={{ gap: w.style?.gap ? formatUnit(w.style.gap) : undefined }}
          >
            {items.map((item, idx) => (
              <div key={item.id || idx} className="flex flex-col gap-4">
                <div className="relative aspect-video w-full overflow-hidden group">
                  <UniversalMedia
                    url={item.url}
                    autoPlay={item.autoPlay ?? w.data.autoPlay}
                    muted={item.muted ?? w.data.muted}
                    loop={item.loop ?? w.data.loop}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      ...getElementStyle(item.imageStyle, viewport as any),
                    }}
                    alt={item.title}
                    onDoubleClick={
                      onElementSelect
                        ? (e) => {
                            e.stopPropagation();
                            onElementSelect("url", item.id);
                          }
                        : undefined
                    }
                  />
                </div>
                <div className="text-left">
                  <SafeHtml
                    html={item.title}
                    placeholder="제목을 입력하세요"
                    className="font-bold text-[#060606] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded inline-block"
                    style={getElementStyle(
                      { ...w.data.itemTitleStyle, ...item.itemTitleStyle },
                      viewport as any,
                    )}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      onElementSelect?.("itemTitle", item.id);
                    }}
                  />
                  <div className="mt-1">
                    <SafeHtml
                      html={item.desc}
                      placeholder="설명을 입력하세요"
                      className="text-[#666666] hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded"
                      style={getElementStyle(
                        { ...w.data.itemDescStyle, ...item.itemDescStyle },
                        viewport as any,
                      )}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        onElementSelect?.("itemDesc", item.id);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
