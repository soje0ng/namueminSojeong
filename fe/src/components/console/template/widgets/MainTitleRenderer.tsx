import React from "react";
import { MainTitleWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
  getPaddingClass,
  getBorderRadiusClass,
} from "./WidgetUtils";

// 💡 [기본 폰트 사이즈 설정 안내]
// 이 영역의 값을 수정하면 메인 타이틀 위젯이 처음 추가될 때의 기본 크기가 변경됩니다.
// - PC 버전: fontSize: "80px"
// - 모바일 버전: fontSizeMobile: "28px"
export const MAIN_TITLE_DEFAULTS = {
  mainTitle: "메인 타이틀",
  mainTitleStyle: {
    fontSize: "60px",
    fontSizeMobile: "28px",
    fontWeight: "700",
    color: "#131416",
  },
  subTitle: "서브 타이틀",
  subTitleStyle: {
    fontSize: "18px",
    fontSizeMobile: "18px",
    fontWeight: "500",
    color: "#285DE1",
  },
};

export const MainTitleRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as MainTitleWidget;
  const style = useWidgetStyle(w.style);
  return (
    <section style={style} className="w-full h-auto">
      <div
        className={`mx-auto w-full max-w-[1920px] ${getPaddingClass(viewport)} text-center`}
      >
        <SafeHtml
          html={w.data.subTitle}
          className={`mb-2 hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} transition-all inline-block text-[#666666] font-medium`}
          style={getElementStyle(w.data.subTitleStyle, viewport as any)}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onElementSelect?.("subTitle");
          }}
        />
        <br />
        <SafeHtml
          html={w.data.mainTitle}
          className={`hover:outline-dashed hover:outline-2 hover:outline-blue-400 ${getBorderRadiusClass(viewport, "rounded")} transition-all inline-block font-bold text-[#131416] leading-tight`}
          style={getElementStyle(w.data.mainTitleStyle, viewport as any)}
          onDoubleClick={(e) => {
            e.stopPropagation();
            onElementSelect?.("mainTitle");
          }}
        />
      </div>
    </section>
  );
};
