import React from "react";
import { FaqWidget } from "@/types/console/template";
import {
  useWidgetStyle,
  getElementStyle,
  SafeHtml,
  WidgetRendererProps,
} from "./WidgetUtils";

// 💡 [기본 폰트 사이즈 설정 안내]
// 이 영역의 값을 수정하면 위젯이 처음 추가될 때의 기본 크기가 변경됩니다.
// - fontSize: PC(데스크탑) 화면에서의 크기
// - fontSizeMobile: 모바일 화면에서의 크기
export const FAQ_DEFAULTS = {
  subTitle: "( 서브타이틀 )",
  subTitleStyle: { fontSize: "20px", fontWeight: "500", color: "#285DE1" },
  title: "타이틀명 입력",
  titleStyle: { fontSize: "36px", fontWeight: "700", color: "#111827" },
  desc: "이민 프로그램명 입력",
  descStyle: { fontSize: "20px", fontWeight: "500", color: "#6b7280" },
  items: [
    {
      id: "1",
      question: "FAQ용 질문을 입력하는 부분",
      answer: "답변을 입력하는 부분입니다.",
      questionStyle: { fontSize: "30px", fontWeight: "500", color: "#09090b" },
      answerStyle: { fontSize: "18px", fontWeight: "400", color: "#6b7280" },
    },
  ],
};

export const FaqRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  onElementSelect,
  viewport = "desktop",
}) => {
  const w = widget as FaqWidget;
  const style = useWidgetStyle(w.style);
  // Initialize with current item IDs
  const [openIds, setOpenIds] = React.useState<string[]>(
    w.data.items.map((i) => i.id),
  );

  // Sync openIds when items change (e.g. adding a new FAQ item in the builder)
  React.useEffect(() => {
    const currentIds = w.data.items.map((i) => i.id);
    setOpenIds((prev) => {
      const addedIds = currentIds.filter((id) => !prev.includes(id));
      if (addedIds.length > 0) return [...prev, ...addedIds];
      return prev;
    });
  }, [w.data.items]);

  const toggleFaq = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((oid) => oid !== id) : [...prev, id],
    );
  };

  return (
    <section style={style} className="w-full h-auto bg-white">
      <div className="mx-auto w-full max-w-[1920px]">
        <div className="self-stretch px-5 xl:px-72 py-14 inline-flex flex-col justify-start items-center gap-10 w-full hover:ring-2 hover:ring-transparent transition-all">
          {/* Header Area */}
          <div className="flex flex-col justify-start items-center text-center w-full">
            {!w.data.subTitleStyle?.isHidden && (
              <SafeHtml
                html={w.data.subTitle || "( 서브타이틀 )"}
                className="text-center justify-start text-[#285DE1] text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={{
                  ...getElementStyle(w.data.subTitleStyle, viewport),
                  color: "#285DE1",
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("subTitle");
                }}
              />
            )}
            {!w.data.titleStyle?.isHidden && (
              <SafeHtml
                html={w.data.title || "타이틀명 입력"}
                className="justify-start text-시안-mode-gray95 text-4xl font-bold font-['Pretendard'] leading-[60px] break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text my-1"
                style={getElementStyle(w.data.titleStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("title");
                }}
              />
            )}
            {!w.data.descStyle?.isHidden && (
              <SafeHtml
                html={w.data.desc || "이민 프로그램명 입력"}
                className="text-center justify-start text-시안-mode-gray50 text-xl font-medium font-['Pretendard'] leading-8 hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded transition-all cursor-text break-keep"
                style={getElementStyle(w.data.descStyle, viewport)}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onElementSelect?.("desc");
                }}
              />
            )}
          </div>

          {/* FAQ Items Area */}
          <div className="self-stretch flex flex-col justify-start items-start w-full">
            {w.data.items.map((item, index) => {
              const isOpen = openIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="self-stretch px-5 xl:px-10 py-4 bg-시안-mode-gray0 border-t border-시안-mode-gray95 flex flex-col justify-start items-start gap-3 w-full hover:bg-시안-mode-gray5 transition-all group"
                >
                  <div className="self-stretch inline-flex justify-start items-start gap-6 w-full">
                    <div className="flex-1 inline-flex flex-col justify-center items-start gap-4">
                      <div
                        className="inline-flex justify-start items-center gap-3 w-full cursor-pointer"
                        onClick={(e) => toggleFaq(item.id, e)}
                      >
                        <div
                          className={`w-14 h-14 rounded-full flex justify-center items-center gap-2.5 shrink-0 transition-all ${isOpen ? "bg-시안-mode-Primary50" : "bg-시안-mode-Primary5 outline outline-1 outline-offset-[-1px] outline-시안-mode-Primary50"}`}
                        >
                          <div
                            className={`text-center justify-start text-3xl font-bold font-['Pretendard'] leading-10 ${isOpen ? "text-시안-mode-gray0" : "text-[#285DE1]"}`}
                          >
                            Q
                          </div>
                        </div>
                        <SafeHtml
                          html={item.question || "FAQ용 질문을 입력하는 부분"}
                          className="justify-start text-zinc-950 text-2xl xl:text-3xl font-medium font-['Pretendard'] leading-tight xl:leading-10 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded flex-1 cursor-text"
                          style={getElementStyle(item.questionStyle, viewport)}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onElementSelect?.("faqQuestion", item.id);
                          }}
                        />
                        <div className="w-10 h-10 relative shrink-0">
                          <div
                            className={`w-4 h-2 left-[12px] top-[16px] absolute outline outline-4 outline-offset-[-2px] outline-시안-mode-gray20 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          ></div>
                        </div>
                      </div>
                      {isOpen && item.answer && (
                        <div
                          className="w-full pl-[68px] cursor-default"
                          onClick={(e) => e.stopPropagation()}
                          onDoubleClick={(e) => e.stopPropagation()}
                        >
                          <SafeHtml
                            html={item.answer || "답변을 입력하는 부분입니다."}
                            className="justify-start text-시안-mode-gray50 text-base xl:text-lg font-normal font-['Pretendard'] leading-relaxed xl:leading-7 break-keep hover:outline-dashed hover:outline-2 hover:outline-blue-400 rounded w-full cursor-text"
                            style={getElementStyle(item.answerStyle, viewport)}
                            onClick={(e) => e.stopPropagation()}
                            onDoubleClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onElementSelect?.("faqAnswer", item.id);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
