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

export type Section5Type = "image" | "text" | "checklist" | "labelList" | "imageBanner";

export interface ChecklistItem {
  id: string;
  title: string;
  desc: string;
  iconUrl?: string;
  opacity?: string;
}

export interface LabelListItem {
  id: string;
  label: string;
  content: string;
  iconUrl?: string;
  opacity?: string;
}

export interface Section5Item {
  id: string;
  type: Section5Type;
  opacity?: string;
  // image
  columns?: number;
  images?: string[];
  imageOpacities?: string[];
  imageHeight?: string;
  // text
  subTitle?: string;
  content?: string;
  // checklist
  bojoTitle?: string;
  items?: ChecklistItem[] | LabelListItem[];
  // labelList
  imageUrl?: string;
  // imageBanner
  bannerSubTitle?: string;
  bannerDesc?: string;
  desc?: string; // legacy imageBanner field fallback
}

const SECTION_LABELS: Record<Section5Type, string> = {
  image: "이미지 영역",
  text: "기본텍스트 영역",
  checklist: "체크리스트 영역",
  labelList: "라벨리스트 영역",
  imageBanner: "이미지 배너 영역",
};

const SECTION_COLORS: Record<Section5Type, string> = {
  image: "bg-blue-100 text-blue-700",
  text: "bg-gray-100 text-gray-700",
  checklist: "bg-cyan-100 text-cyan-700",
  labelList: "bg-green-100 text-green-700",
  imageBanner: "bg-purple-100 text-purple-700",
};

function createDefaultSection(type: Section5Type): Section5Item {
  const id = `s5-${type}-${Date.now()}`;
  if (type === "image") {
    return {
      id,
      type: "image",
      columns: 2,
      images: [
        "/images/placeholder/card-sm.jpg",
        "/images/placeholder/card-sm.jpg",
      ],
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
  if (type === "checklist") {
    return {
      id,
      type: "checklist",
      bojoTitle: "보조 타이틀 문구 입력",
      items: [
        {
          id: `cl-${Date.now()}-1`,
          title: "프로그램 특징",
          desc: "프로그램 특징 내용 입력",
          iconUrl: "/images/placeholder/ts_checklist_icon.png",
        },
        {
          id: `cl-${Date.now()}-2`,
          title: "프로그램 특징",
          desc: "프로그램 특징 내용 입력",
          iconUrl: "/images/placeholder/ts_checklist_icon.png",
        },
        {
          id: `cl-${Date.now()}-3`,
          title: "프로그램 특징",
          desc: "프로그램 특징 내용 입력",
          iconUrl: "/images/placeholder/ts_checklist_icon.png",
        },
      ] as ChecklistItem[],
    };
  }
  if (type === "labelList") {
    return {
      id,
      type: "labelList",
      imageUrl: "/images/placeholder/card-sm.jpg",
      items: [
        { id: `ll-${Date.now()}-1`, label: "라벨명", content: "프로그램 특징 내용 입력" },
        { id: `ll-${Date.now()}-2`, label: "라벨명", content: "프로그램 특징 내용 입력" },
        { id: `ll-${Date.now()}-3`, label: "라벨명", content: "프로그램 특징 내용 입력" },
        { id: `ll-${Date.now()}-4`, label: "라벨명", content: "프로그램 특징 내용 입력" },
      ] as LabelListItem[],
    };
  }
  // imageBanner
  return {
    id,
    type: "imageBanner",
    imageUrl: "/images/placeholder/card-sm.jpg",
    bannerSubTitle: "서브 타이틀 입력",
    bannerDesc: "내용을 입력하세요.",
  };
}

interface Props {
  widgetId: string;
  sections: Section5Item[];
  updateWidgetData: (id: string, data: any) => void;
  autoExpandSectionId?: string | null;
}

const TextStructure5Manager: React.FC<Props> = ({
  widgetId,
  sections,
  updateWidgetData,
  autoExpandSectionId = null,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddPicker, setShowAddPicker] = useState(false);
  useEffect(() => {
    if (!autoExpandSectionId) return;
    const exists = sections.some((section) => section.id === autoExpandSectionId);
    if (exists) setExpandedId(autoExpandSectionId);
  }, [autoExpandSectionId, sections]);
  const resolveImageInputs = (section: Section5Item) => {
    const cols = section.columns || 2;
    const images = [...(section.images || [])];
    while (images.length < cols) {
      images.push("/images/placeholder/card-sm.jpg");
    }
    return images.slice(0, cols);
  };

  const update = (newSections: Section5Item[]) => {
    updateWidgetData(widgetId, { sections5: newSections });
  };

  const updateSection = (id: string, patch: Partial<Section5Item>) => {
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

  const addSection = (type: Section5Type) => {
    update([...sections, createDefaultSection(type)]);
    setShowAddPicker(false);
  };

  const updateImageCount = (section: Section5Item, cols: number) => {
    const current = section.images || [];
    const placeholder = "/images/placeholder/card-sm.jpg";
    let images: string[];
    if (cols > current.length) {
      images = [...current, ...Array(cols - current.length).fill(placeholder)];
    } else {
      images = current.slice(0, cols);
    }
    updateSection(section.id, { columns: cols, images });
  };

  const addChecklistItem = (section: Section5Item) => {
    const items = [...((section.items as ChecklistItem[]) || [])];
    items.push({
      id: `cl-${Date.now()}`,
      title: "프로그램 특징",
      desc: "프로그램 특징 내용 입력",
      iconUrl: "/images/placeholder/ts_checklist_icon.png",
    });
    updateSection(section.id, { items });
  };

  const removeChecklistItem = (section: Section5Item, idx: number) => {
    const items = [...((section.items as ChecklistItem[]) || [])];
    items.splice(idx, 1);
    updateSection(section.id, { items });
  };

  const updateChecklistItem = (section: Section5Item, idx: number, patch: Partial<ChecklistItem>) => {
    const items = [...((section.items as ChecklistItem[]) || [])];
    items[idx] = { ...items[idx], ...patch };
    updateSection(section.id, { items });
  };

  const addLabelItem = (section: Section5Item) => {
    const items = [...((section.items as LabelListItem[]) || [])];
    items.push({ id: `ll-${Date.now()}`, label: "라벨명", content: "프로그램 특징 내용 입력" });
    updateSection(section.id, { items });
  };

  const removeLabelItem = (section: Section5Item, idx: number) => {
    const items = [...((section.items as LabelListItem[]) || [])];
    items.splice(idx, 1);
    updateSection(section.id, { items });
  };

  const updateLabelItem = (section: Section5Item, idx: number, patch: Partial<LabelListItem>) => {
    const items = [...((section.items as LabelListItem[]) || [])];
    items[idx] = { ...items[idx], ...patch };
    updateSection(section.id, { items });
  };

  const normalizeOpacityValue = (value: string) => {
    if (value === "") return "";
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return "";
    return String(Math.max(0, Math.min(100, parsed)));
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
                  onClick={() => setExpandedId(isExpanded ? null : section.id)}
                  className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-white"
                >
                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>

              {/* Column selector - image only */}
              {section.type === "image" && (
                <div className="flex items-center gap-2 px-2 pb-2 bg-gray-50/80">
                  <span className="text-[10px] text-gray-400 shrink-0">열 수</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4].map((col) => (
                      <button
                        key={col}
                        className={`w-7 h-5 text-[10px] font-bold rounded transition-all ${
                          (section.columns || 2) === col
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
                        }`}
                        onClick={() => updateImageCount(section, col)}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expanded content */}
              {isExpanded && (
                <div className="p-3 space-y-3 border-t border-gray-100 bg-white">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 w-16 shrink-0">
                      영역 투명도
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
                  {/* IMAGE */}
                  {section.type === "image" && (
                    <>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 w-16 shrink-0">이미지 높이</label>
                        <input
                          type="number"
                          min={80}
                          max={800}
                          className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs text-center font-mono focus:ring-2 focus:ring-blue-100 outline-none"
                          value={section.imageHeight || ""}
                          onChange={(e) => updateSection(section.id, { imageHeight: e.target.value })}
                        />
                        <span className="text-[10px] text-gray-400">px</span>
                      </div>
                      {resolveImageInputs(section).map((img, imgIdx) => (
                          <div key={imgIdx} className="space-y-1">
                            <label className="text-[10px] text-gray-400 font-semibold">이미지 {imgIdx + 1}</label>
                            <div className="flex gap-1.5">
                            <input
                              type="text"
                              className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                              placeholder="section-image.jpg"
                              value={img}
                              onChange={(e) => {
                                const imgs = resolveImageInputs(section);
                                imgs[imgIdx] = e.target.value;
                                updateSection(section.id, { images: imgs });
                              }}
                            />
                            <ImgUploadPop
                              button={
                                <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 shrink-0">
                                  <ImageIcon size={12} />
                                </button>
                              }
                              onSelect={(url) => {
                                const imgs = resolveImageInputs(section);
                                imgs[imgIdx] = url;
                                updateSection(section.id, { images: imgs });
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] text-gray-400 w-16 shrink-0">
                              이미지 투명도
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              className="flex-1 bg-gray-50 border-none p-1.5 rounded text-xs text-center font-mono focus:ring-2 focus:ring-blue-100 outline-none"
                              value={section.imageOpacities?.[imgIdx] || ""}
                              onChange={(e) => {
                                const imageOpacities = [
                                  ...(section.imageOpacities || []),
                                ];
                                imageOpacities[imgIdx] = normalizeOpacityValue(
                                  e.target.value,
                                );
                                updateSection(section.id, { imageOpacities });
                              }}
                            />
                            <span className="text-[10px] text-gray-400">%</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* BASIC TEXT */}
                  {section.type === "text" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">서브타이틀</label>
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                          value={section.subTitle || ""}
                          onChange={(e) => updateSection(section.id, { subTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">본문 내용</label>
                        <textarea
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                          rows={4}
                          value={section.content || ""}
                          onChange={(e) => updateSection(section.id, { content: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {/* CHECKLIST */}
                  {section.type === "checklist" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">보조 타이틀</label>
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                          value={section.bojoTitle || ""}
                          onChange={(e) => updateSection(section.id, { bojoTitle: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-400 font-semibold">항목 목록</label>
                        {((section.items as ChecklistItem[]) || []).map((item, itemIdx) => (
                          <div key={item.id || itemIdx} className="border border-gray-100 rounded-lg p-2 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-gray-400">항목 {itemIdx + 1}</span>
                              <button
                                onClick={() => removeChecklistItem(section, itemIdx)}
                                className="p-0.5 rounded text-red-400 hover:text-red-600"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-[10px] text-gray-400 w-16 shrink-0">
                                항목 투명도
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                className="flex-1 bg-gray-50 border-none p-1.5 rounded text-xs text-center font-mono focus:ring-2 focus:ring-blue-100 outline-none"
                                value={item.opacity || ""}
                                onChange={(e) =>
                                  updateChecklistItem(section, itemIdx, {
                                    opacity: normalizeOpacityValue(
                                      e.target.value,
                                    ),
                                  })
                                }
                              />
                              <span className="text-[10px] text-gray-400">%</span>
                            </div>
                            <input
                              type="text"
                              className="w-full bg-gray-50 border-none p-1.5 rounded text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                              placeholder="제목"
                              value={item.title || ""}
                              onChange={(e) => updateChecklistItem(section, itemIdx, { title: e.target.value })}
                            />
                            <input
                              type="text"
                              className="w-full bg-gray-50 border-none p-1.5 rounded text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                              placeholder="내용"
                              value={item.desc || ""}
                              onChange={(e) => updateChecklistItem(section, itemIdx, { desc: e.target.value })}
                            />
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                className="flex-1 bg-gray-50 border-none p-1.5 rounded text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                                placeholder="아이콘 URL"
                                value={item.iconUrl || ""}
                                onChange={(e) =>
                                  updateChecklistItem(section, itemIdx, {
                                    iconUrl: e.target.value,
                                  })
                                }
                              />
                              <ImgUploadPop
                                button={
                                  <button className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 shrink-0">
                                    <ImageIcon size={10} />
                                  </button>
                                }
                                onSelect={(url) =>
                                  updateChecklistItem(section, itemIdx, {
                                    iconUrl: url,
                                  })
                                }
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addChecklistItem(section)}
                          className="w-full flex items-center justify-center gap-1 p-1.5 rounded-lg border border-dashed border-gray-200 text-[10px] text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-all"
                        >
                          <Plus size={10} /> 항목 추가
                        </button>
                      </div>
                    </>
                  )}

                  {/* LABEL LIST */}
                  {section.type === "labelList" && (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">우측 이미지</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="section-image.jpg"
                            value={section.imageUrl || ""}
                            onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })}
                          />
                          <ImgUploadPop
                            button={
                              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 shrink-0">
                                <ImageIcon size={12} />
                              </button>
                            }
                            onSelect={(url) => updateSection(section.id, { imageUrl: url })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-400 font-semibold">라벨 항목</label>
                        {((section.items as LabelListItem[]) || []).map((item, itemIdx) => (
                          <div key={item.id || itemIdx} className="bg-gray-50/50 rounded-lg p-2 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-gray-400">행 {itemIdx + 1}</span>
                              <button
                                onClick={() => removeLabelItem(section, itemIdx)}
                                className="p-0.5 rounded text-red-400 hover:text-red-600"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <label className="text-[10px] text-gray-400 w-16 shrink-0">
                                항목 투명도
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                className="flex-1 bg-gray-50 border-none p-1.5 rounded text-xs text-center font-mono focus:ring-2 focus:ring-blue-100 outline-none"
                                value={item.opacity || ""}
                                onChange={(e) =>
                                  updateLabelItem(section, itemIdx, {
                                    opacity: normalizeOpacityValue(
                                      e.target.value,
                                    ),
                                  })
                                }
                              />
                              <span className="text-[10px] text-gray-400">%</span>
                            </div>
                            <input
                              type="text"
                              className="w-full bg-gray-50 border-none p-1.5 rounded text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                              placeholder="라벨명"
                              value={item.label || ""}
                              onChange={(e) => updateLabelItem(section, itemIdx, { label: e.target.value })}
                            />
                            <input
                              type="text"
                              className="w-full bg-gray-50 border-none p-1.5 rounded text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                              placeholder="내용"
                              value={item.content || ""}
                              onChange={(e) => updateLabelItem(section, itemIdx, { content: e.target.value })}
                            />
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                className="flex-1 bg-gray-50 border-none p-1.5 rounded text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                                placeholder="아이콘 URL"
                                value={item.iconUrl || ""}
                                onChange={(e) =>
                                  updateLabelItem(section, itemIdx, {
                                    iconUrl: e.target.value,
                                  })
                                }
                              />
                              <ImgUploadPop
                                button={
                                  <button className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 shrink-0">
                                    <ImageIcon size={10} />
                                  </button>
                                }
                                onSelect={(url) =>
                                  updateLabelItem(section, itemIdx, {
                                    iconUrl: url,
                                  })
                                }
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addLabelItem(section)}
                          className="w-full flex items-center justify-center gap-1 p-1.5 rounded-lg border border-dashed border-gray-200 text-[10px] text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-all"
                        >
                          <Plus size={10} /> 행 추가
                        </button>
                      </div>
                    </>
                  )}

                  {/* IMAGE BANNER */}
                  {section.type === "imageBanner" && (
                    <>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-500 w-16 shrink-0">배너 높이</label>
                        <input
                          type="number"
                          min={80}
                          max={800}
                          className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs text-center font-mono focus:ring-2 focus:ring-blue-100 outline-none"
                          value={section.imageHeight || ""}
                          onChange={(e) =>
                            updateSection(section.id, { imageHeight: e.target.value })
                          }
                        />
                        <span className="text-[10px] text-gray-400">px</span>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">좌측 이미지</label>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            className="flex-1 bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                            placeholder="strip-banner.jpg"
                            value={section.imageUrl || ""}
                            onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })}
                          />
                          <ImgUploadPop
                            button={
                              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 shrink-0">
                                <ImageIcon size={12} />
                              </button>
                            }
                            onSelect={(url) => updateSection(section.id, { imageUrl: url })}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">제목</label>
                        <input
                          type="text"
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none"
                          value={section.bannerSubTitle ?? section.subTitle ?? ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              bannerSubTitle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-semibold">설명</label>
                        <textarea
                          className="w-full bg-gray-50 border-none p-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                          rows={3}
                          value={section.bannerDesc ?? section.desc ?? ""}
                          onChange={(e) =>
                            updateSection(section.id, {
                              bannerDesc: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
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
            {(["image", "text", "checklist", "labelList", "imageBanner"] as Section5Type[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => addSection(type)}
                  className={`text-xs font-semibold p-2 rounded-lg text-left transition-all hover:opacity-80 ${SECTION_COLORS[type]}`}
                >
                  {SECTION_LABELS[type]}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextStructure5Manager;
