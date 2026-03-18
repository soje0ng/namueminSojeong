"use client";
import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
} from "lucide-react";
import ImgUploadPop from "@/components/console/popup/ImgUploadPop";

export interface Section10Card {
  id: string;
  type: string;
  opacity?: string;
  number: string;
  numberStyle?: {
    isHidden?: boolean;
  };
  title: string;
  titleStyle?: {
    isHidden?: boolean;
  };
  iconUrl: string;
  iconUrlStyle?: {
    isHidden?: boolean;
  };
  subTitle: string;
  subTitleStyle?: {
    isHidden?: boolean;
  };
  desc: string;
  descStyle?: {
    isHidden?: boolean;
  };
  checkTitle: string;
  checkTitleStyle?: {
    isHidden?: boolean;
  };
  checkIconUrl: string;
  checkIconUrlStyle?: {
    isHidden?: boolean;
  };
  badges: { id: string; text: string; active: boolean }[];
  badgesStyle?: {
    isHidden?: boolean;
  };
}

interface Props {
  widgetId: string;
  sections: Section10Card[];
  updateWidgetData: (id: string, data: any) => void;
  autoExpandSectionId?: string | null;
}

const TextStructure10Manager: React.FC<Props> = ({
  widgetId,
  sections,
  updateWidgetData,
  autoExpandSectionId = null,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!autoExpandSectionId) return;
    const exists = sections.some((section) => section.id === autoExpandSectionId);
    if (exists) setExpandedId(autoExpandSectionId);
  }, [autoExpandSectionId, sections]);

  const update = (newSections: Section10Card[]) => {
    updateWidgetData(widgetId, { sections10: newSections });
  };

  const updateSection = (id: string, patch: Partial<Section10Card>) => {
    update(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const toggleSectionHidden = (
    id: string,
    key: "numberStyle" | "titleStyle" | "iconUrlStyle" | "subTitleStyle" | "descStyle" | "checkTitleStyle" | "checkIconUrlStyle" | "badgesStyle",
  ) => {
    const target = sections.find((section) => section.id === id);
    if (!target) return;
    updateSection(id, {
      [key]: {
        ...(target[key] || {}),
        isHidden: !(target[key]?.isHidden ?? false),
      },
    });
  };

  const moveSection = (idx: number, dir: "up" | "down") => {
    const arr = [...sections];
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    update(arr);
  };

  const deleteSection = (id: string) => {
    if (sections.length <= 1) return;
    update(sections.filter((s) => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const addSection = () => {
    const newCard: Section10Card = {
      id: `s10-card-${Date.now()}`,
      type: "card",
      number: `${(sections.length + 1).toString().padStart(2, "0")}.`,
      title: "프로그램 특징",
      iconUrl: "/images/placeholder/textcard10.png",
      subTitle: "서브 타이틀 입력",
      subTitleStyle: { isHidden: false },
      desc: "내용을 입력하세요.",
      descStyle: { isHidden: false },
      checkTitle: "타이틀",
      checkTitleStyle: { isHidden: false },
      checkIconUrl: "/images/placeholder/card_img6.png",
      badges: [
        { id: `b-${Date.now()}-0`, text: "우선심사", active: true },
        { id: `b-${Date.now()}-1`, text: "I-956F", active: false },
        { id: `b-${Date.now()}-2`, text: "높은 고용창출", active: false },
      ],
      badgesStyle: { isHidden: false },
    };
    update([...sections, newCard]);
    setExpandedId(newCard.id);
  };

  const badgeRawRef = React.useRef<Record<string, string>>({});

  const getBadgeInputValue = (section: Section10Card) => {
    if (badgeRawRef.current[section.id] !== undefined) {
      return badgeRawRef.current[section.id];
    }
    return (section.badges || [])
      .map((badge) => badge.text || "")
      .filter((text) => text.trim().length > 0)
      .join(", ");
  };

  const updateBadges = (sectionId: string, value: string) => {
    badgeRawRef.current[sectionId] = value;

    const texts = value
      .split(",")
      .map((text) => text.trim())
      .filter((text) => text.length > 0);

    const nextBadges = texts.length
      ? texts.map((text, idx) => ({
          id: `b-${sectionId}-${idx}`,
          text,
          active: idx === 0,
        }))
      : [];

    updateSection(sectionId, { badges: nextBadges });
  };

  const handleBadgeBlur = (sectionId: string) => {
    delete badgeRawRef.current[sectionId];
  };

  const toTextareaValue = (value?: string) =>
    (value || "").replace(/<br\s*\/?>/gi, "\n");

  const toHtmlBreakValue = (value: string) => value.replace(/\n/g, "<br/>");

  const toPreviewText = (value?: string) =>
    (value || "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]*>/g, "")
      .trim();

  const normalizeOpacityValue = (value: string) => {
    if (value === "") return "";
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return "";
    return String(Math.max(0, Math.min(100, parsed)));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
        카드 리스트 관리
      </label>

      <div className="space-y-1.5">
        {sections.map((section, idx) => {
          const isExpanded = expandedId === section.id;
          return (
            <div
              key={section.id}
              className={`border rounded-xl overflow-hidden transition-colors ${
                isExpanded ? "border-blue-500" : "border-gray-200"
              }`}
            >
              {/* Header row */}
              <div
                className={`flex items-center gap-1 p-2 cursor-pointer ${
                  isExpanded ? "bg-blue-50/70" : "bg-gray-50/80"
                }`}
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 bg-blue-100 text-blue-700">
                  카드 {idx + 1}
                </span>
                <span className="text-[10px] text-gray-400 truncate flex-1">
                  {toPreviewText(section.title)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSection(idx, "up");
                  }}
                  disabled={idx === 0}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-white disabled:opacity-30"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSection(idx, "down");
                  }}
                  disabled={idx === sections.length - 1}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-white disabled:opacity-30"
                >
                  <ArrowDown size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSection(section.id);
                  }}
                  className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-white"
                >
                  <Trash2 size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedId(isExpanded ? null : section.id);
                  }}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-white"
                >
                  {isExpanded ? (
                    <ChevronUp size={12} />
                  ) : (
                    <ChevronDown size={12} />
                  )}
                </button>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="p-3 space-y-3 border-t border-gray-100 bg-white">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 w-16 shrink-0">
                      카드 투명도
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs text-center font-mono focus:ring-2 focus:ring-blue-100 outline-none"
                      value={section.opacity || ""}
                      onChange={(e) =>
                        updateSection(section.id, {
                          opacity: normalizeOpacityValue(e.target.value),
                        })
                      }
                    />
                    <span className="text-[10px] text-gray-400">%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          번호
                        </label>
                        <button
                          type="button"
                          className="text-[10px] text-gray-500 font-semibold"
                          onClick={() =>
                            toggleSectionHidden(section.id, "numberStyle")
                          }
                        >
                          {section.numberStyle?.isHidden ? "보이기" : "숨기기"}
                        </button>
                      </div>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                        value={section.number || ""}
                        onChange={(e) =>
                          updateSection(section.id, { number: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          타이틀
                        </label>
                        <button
                          type="button"
                          className="text-[10px] text-gray-500 font-semibold"
                          onClick={() =>
                            toggleSectionHidden(section.id, "titleStyle")
                          }
                        >
                          {section.titleStyle?.isHidden ? "보이기" : "숨기기"}
                        </button>
                      </div>
                      <textarea
                        className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                        rows={2}
                        value={toTextareaValue(section.title)}
                        onChange={(e) =>
                          updateSection(section.id, {
                            title: toHtmlBreakValue(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[10px] text-gray-400 font-semibold">
                        메인 이미지
                      </label>
                      <button
                        type="button"
                        className="text-[10px] text-gray-500 font-semibold"
                        onClick={() =>
                          toggleSectionHidden(section.id, "iconUrlStyle")
                        }
                      >
                        {section.iconUrlStyle?.isHidden ? "보이기" : "숨기기"}
                      </button>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                        value={section.iconUrl || ""}
                        onChange={(e) =>
                          updateSection(section.id, { iconUrl: e.target.value })
                        }
                      />
                      <ImgUploadPop
                        button={
                          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 shrink-0">
                            <ImageIcon size={12} />
                          </button>
                        }
                        onSelect={(url) =>
                          updateSection(section.id, { iconUrl: url })
                        }
                      />
                    </div>
                  </div>

	                  <div className="space-y-1">
	                    <div className="flex items-center justify-between gap-2">
	                      <label className="text-[10px] text-gray-400 font-semibold">
	                        서브타이틀
	                      </label>
	                      <button
	                        type="button"
	                        className="text-[10px] text-gray-500 font-semibold"
	                        onClick={() =>
	                          toggleSectionHidden(section.id, "subTitleStyle")
	                        }
	                      >
	                        {section.subTitleStyle?.isHidden ? "보이기" : "숨기기"}
	                      </button>
	                    </div>
	                    <textarea
	                      className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
	                      rows={2}
	                      value={toTextareaValue(section.subTitle)}
	                      onChange={(e) =>
	                        updateSection(section.id, {
	                          subTitle: toHtmlBreakValue(e.target.value),
	                        })
	                      }
	                    />
	                  </div>

	                  <div className="space-y-1">
	                    <div className="flex items-center justify-between gap-2">
	                      <label className="text-[10px] text-gray-400 font-semibold">
	                        설명
	                      </label>
	                      <button
	                        type="button"
	                        className="text-[10px] text-gray-500 font-semibold"
	                        onClick={() =>
	                          toggleSectionHidden(section.id, "descStyle")
	                        }
	                      >
	                        {section.descStyle?.isHidden ? "보이기" : "숨기기"}
	                      </button>
	                    </div>
	                    <textarea
	                      className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
	                      rows={3}
	                      value={toTextareaValue(section.desc)}
	                      onChange={(e) =>
	                        updateSection(section.id, {
	                          desc: toHtmlBreakValue(e.target.value),
	                        })
	                      }
	                    />
	                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[10px] text-gray-400 font-semibold">
                        체크리스트 타이틀
	                      </label>
	                      <button
	                        type="button"
	                        className="text-[10px] text-gray-500 font-semibold"
	                        onClick={() =>
	                          toggleSectionHidden(section.id, "checkTitleStyle")
	                        }
	                      >
	                        {section.checkTitleStyle?.isHidden ? "보이기" : "숨기기"}
	                      </button>
	                    </div>
	                    <div className="flex gap-1.5">
		                      <textarea
		                        className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
		                        rows={2}
		                        value={toTextareaValue(section.checkTitle)}
	                        onChange={(e) =>
	                          updateSection(section.id, {
	                            checkTitle: toHtmlBreakValue(e.target.value),
	                          })
	                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-[10px] text-gray-400 font-semibold">
                        체크 아이콘
                      </label>
                      <button
                        type="button"
                        className="text-[10px] text-gray-500 font-semibold"
                        onClick={() =>
                          toggleSectionHidden(section.id, "checkIconUrlStyle")
                        }
                      >
                        {section.checkIconUrlStyle?.isHidden ? "보이기" : "숨기기"}
                      </button>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                        value={section.checkIconUrl || ""}
                        onChange={(e) =>
                          updateSection(section.id, {
                            checkIconUrl: e.target.value,
                          })
                        }
                      />
                      <ImgUploadPop
                        button={
                          <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 shrink-0">
                            <ImageIcon size={12} />
                          </button>
                        }
                        onSelect={(url) =>
                          updateSection(section.id, { checkIconUrl: url })
                        }
                      />
                    </div>
                  </div>

	                  <div className="space-y-1">
	                    <div className="flex items-center justify-between gap-2">
	                      <label className="text-[10px] text-gray-400 font-semibold">
	                        배지 관리
	                      </label>
	                      <button
	                        type="button"
	                        className="text-[10px] text-gray-500 font-semibold"
	                        onClick={() =>
	                          toggleSectionHidden(section.id, "badgesStyle")
	                        }
	                      >
	                        {section.badgesStyle?.isHidden ? "보이기" : "숨기기"}
	                      </button>
	                    </div>
	                    <input
	                      type="text"
	                      className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                      value={getBadgeInputValue(section)}
                      onChange={(e) =>
                        updateBadges(section.id, e.target.value)
                      }
                      onBlur={() => handleBadgeBlur(section.id)}
                      placeholder="우선심사, I-956F, 높은 고용창출"
                    />
                    <p className="text-[10px] text-gray-400 leading-tight">
                      쉼표로 구분해서 입력하면 첫 번째 배지는 파란색, 나머지는 회색으로 표시됩니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 영역 추가 버튼 */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={addSection}
          className="w-full flex items-center justify-center gap-1.5 p-3 rounded-xl border-2 border-dashed border-gray-200 text-xs font-bold text-gray-400 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all font-['Pretendard']"
        >
          <Plus size={14} />
          카드 리스트 항목 추가
        </button>
      </div>
    </div>
  );
};

export default TextStructure10Manager;
