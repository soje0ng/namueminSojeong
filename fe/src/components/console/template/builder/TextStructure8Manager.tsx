"use client";
import React, { useState } from "react";
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

export type Section8Type = "image" | "text" | "features" | "basicText";

export interface Section8FeatItem {
  id: string;
  title: string;
  desc: string;
}

export interface Section8Item {
  id: string;
  type: Section8Type;
  // image
  imageUrl?: string;
  imageHeight?: string;
  // text / basicText
  subTitle?: string;
  content?: string;
  // features
  items?: Section8FeatItem[];
}

const SECTION_LABELS: Record<Section8Type, string> = {
  image: "이미지 영역",
  text: "텍스트 영역",
  features: "프로그램 특징",
  basicText: "기본 텍스트",
};

const SECTION_COLORS: Record<Section8Type, string> = {
  image: "bg-blue-100 text-blue-700",
  text: "bg-gray-100 text-gray-700",
  features: "bg-orange-100 text-orange-700",
  basicText: "bg-green-100 text-green-700",
};

function createDefaultSection(type: Section8Type): Section8Item {
  const id = `s8-${type}-${Date.now()}`;
  if (type === "image") {
    return {
      id,
      type: "image",
      imageUrl: "/images/placeholder/wide-image.jpg",
      imageHeight: "288",
    };
  }
  if (type === "text") {
    return {
      id,
      type: "text",
      subTitle: "서브 타이틀 입력",
      content: "내용을 입력하세요.",
    };
  }
  if (type === "features") {
    return {
      id,
      type: "features",
      items: [
        { id: `f8-${Date.now()}-1`, title: "첫째. 타이틀", desc: "설명 텍스트를 입력하세요." },
        { id: `f8-${Date.now()}-2`, title: "둘째. 타이틀", desc: "설명 텍스트를 입력하세요." },
      ],
    };
  }
  return { id, type: "basicText", content: "내용을 입력하세요." };
}

interface Props {
  widgetId: string;
  sections: Section8Item[];
  updateWidgetData: (id: string, data: any) => void;
}

const TextStructure8Manager: React.FC<Props> = ({
  widgetId,
  sections,
  updateWidgetData,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddPicker, setShowAddPicker] = useState(false);

  const update = (newSections: Section8Item[]) => {
    updateWidgetData(widgetId, { sections8: newSections });
  };

  const updateSection = (id: string, patch: Partial<Section8Item>) => {
    update(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const moveSection = (idx: number, dir: "up" | "down") => {
    const arr = [...sections];
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    update(arr);
  };

  const deleteSection = (id: string) => {
    update(sections.filter((s) => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const addSection = (type: Section8Type) => {
    update([...sections, createDefaultSection(type)]);
    setShowAddPicker(false);
  };

  const updateFeatItem = (
    sectionId: string,
    itemIdx: number,
    field: string,
    val: string,
  ) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const items = [...(section.items || [])];
    items[itemIdx] = { ...items[itemIdx], [field]: val };
    updateSection(sectionId, { items });
  };

  const addFeatItem = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const items = [...(section.items || [])];
    items.push({ id: `f8-${Date.now()}`, title: "타이틀", desc: "설명을 입력하세요." });
    updateSection(sectionId, { items });
  };

  const deleteFeatItem = (sectionId: string, itemIdx: number) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const items = (section.items || []).filter((_, i) => i !== itemIdx);
    updateSection(sectionId, { items });
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">
        구조 관리
      </label>

      <div className="space-y-1.5">
        {sections.map((section, idx) => {
          const isExpanded = expandedId === section.id;
          return (
            <div
              key={section.id}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Header row */}
              <div className="flex items-center gap-1 p-2 bg-gray-50/80">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${SECTION_COLORS[section.type]}`}
                >
                  {SECTION_LABELS[section.type]}
                </span>
                <div className="flex-1" />
                <button
                  onClick={() => moveSection(idx, "up")}
                  disabled={idx === 0}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-white disabled:opacity-30"
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  onClick={() => moveSection(idx, "down")}
                  disabled={idx === sections.length - 1}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-white disabled:opacity-30"
                >
                  <ArrowDown size={12} />
                </button>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-white"
                >
                  <Trash2 size={12} />
                </button>
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : section.id)
                  }
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
                  {/* IMAGE */}
                  {section.type === "image" && (
                    <>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 w-16 shrink-0">
                          이미지 높이
                        </label>
                        <input
                          type="number"
                          min={80}
                          max={800}
                          className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs text-center font-mono focus:ring-2 focus:ring-blue-100 outline-none"
                          value={parseInt(section.imageHeight || "288") || 288}
                          onChange={(e) =>
                            updateSection(section.id, {
                              imageHeight: e.target.value,
                            })
                          }
                        />
                        <span className="text-[10px] text-gray-400">px</span>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          이미지
                        </label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="이미지 URL"
                            value={section.imageUrl || ""}
                            onChange={(e) =>
                              updateSection(section.id, {
                                imageUrl: e.target.value,
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
                              updateSection(section.id, { imageUrl: url })
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* TEXT */}
                  {section.type === "text" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          서브타이틀
                        </label>
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                          value={section.subTitle || ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              subTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">
                          본문 내용
                        </label>
                        <textarea
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                          rows={4}
                          value={section.content || ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              content: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}

                  {/* FEATURES */}
                  {section.type === "features" && (
                    <div className="space-y-2">
                      {(section.items || []).map((item, itemIdx) => (
                        <div
                          key={item.id || itemIdx}
                          className="p-2 bg-gray-50 rounded-lg space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-gray-400 font-semibold">
                              항목 {itemIdx + 1}
                            </span>
                            <button
                              onClick={() =>
                                deleteFeatItem(section.id, itemIdx)
                              }
                              className="p-0.5 rounded text-red-400 hover:text-red-600"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                          <input
                            type="text"
                            className="w-full bg-white border-none p-1.5 rounded text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="타이틀"
                            value={item.title || ""}
                            onChange={(e) =>
                              updateFeatItem(
                                section.id,
                                itemIdx,
                                "title",
                                e.target.value,
                              )
                            }
                          />
                          <textarea
                            className="w-full bg-white border-none p-1.5 rounded text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                            rows={2}
                            placeholder="설명"
                            value={item.desc || ""}
                            onChange={(e) =>
                              updateFeatItem(
                                section.id,
                                itemIdx,
                                "desc",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => addFeatItem(section.id)}
                        className="w-full flex items-center justify-center gap-1 p-1.5 rounded-lg border border-dashed border-gray-300 text-[10px] font-semibold text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all"
                      >
                        <Plus size={10} />
                        항목 추가
                      </button>
                    </div>
                  )}

                  {/* BASIC TEXT */}
                  {section.type === "basicText" && (
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-400 font-semibold">
                        내용
                      </label>
                      <textarea
                        className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                        rows={4}
                        value={section.content || ""}
                        onChange={(e) =>
                          updateSection(section.id, {
                            content: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add section */}
      <div className="relative">
        <button
          onClick={() => setShowAddPicker(!showAddPicker)}
          className="w-full flex items-center justify-center gap-1.5 p-2.5 rounded-xl border-2 border-dashed border-gray-200 text-xs font-semibold text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
        >
          <Plus size={13} />
          영역 추가
        </button>
        {showAddPicker && (
          <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-10 grid grid-cols-2 gap-1.5">
            {(
              ["image", "text", "features", "basicText"] as Section8Type[]
            ).map((type) => (
              <button
                key={type}
                onClick={() => addSection(type)}
                className={`text-xs font-semibold p-2 rounded-lg text-left transition-all hover:opacity-80 ${SECTION_COLORS[type]}`}
              >
                {SECTION_LABELS[type]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextStructure8Manager;
