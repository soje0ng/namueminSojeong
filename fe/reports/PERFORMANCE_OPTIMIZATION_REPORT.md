# Vercel React Best Practices 성능 최적화 보고서

**작성일**: 2026-01-20
**적용 대상**: fe 폴더 전체
**참조 가이드라인**: Vercel React Best Practices

---

## 변경 파일 목록

### 1차 적용 (Dynamic Import, memo, useCallback)
1. `src/components/console/form/MonacoHtmlEditor.tsx`
2. `src/components/console/statistics/chart/Chart.tsx`
3. `src/components/user/main/-components/MainBanner.tsx`

### 2차 적용 (memo, useCallback 확대)
4. `src/components/console/board/post/PostList.tsx`
5. `src/components/console/member/MemberList.tsx`
6. `src/components/console/design/banner/BannerList.tsx`
7. `src/components/console/design/popup/PopupList.tsx`
8. `src/components/console/member/MemberForm.tsx`
9. `src/components/console/design/banner/BannerForm.tsx`

---

## 1. MonacoHtmlEditor.tsx

**파일 경로**: `src/components/console/form/MonacoHtmlEditor.tsx`

### 적용된 규칙

| 규칙 | 우선순위 | 설명 |
|------|----------|------|
| `bundle-dynamic-imports` | CRITICAL | next/dynamic으로 무거운 컴포넌트 지연 로딩 |
| `rerender-functional-setstate` | MEDIUM | useCallback으로 안정적인 콜백 참조 |

### 변경 전

```tsx
"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";

// ...

<Editor
    height="500px"
    defaultLanguage="html"
    value={value}
    onChange={val => onChange(val || "")}  // 인라인 함수
    // ...
/>
```

### 변경 후

```tsx
"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

// Dynamic import for Monaco Editor (~500KB bundle reduction)
const Editor = dynamic(() => import("@monaco-editor/react").then(mod => mod.default), {
    ssr: false,
    loading: () => <div className="flex h-[500px] items-center justify-center bg-gray-50">에디터 로딩중...</div>,
});

// ...

// Memoize onChange handler
const handleEditorChange = useCallback(
    (val: string | undefined) => {
        onChange(val || "");
    },
    [onChange],
);

// ...

<Editor
    height="500px"
    defaultLanguage="html"
    value={value}
    onChange={handleEditorChange}  // 메모이제이션된 핸들러
    // ...
/>
```

### 개선 효과

| 항목 | 개선 내용 |
|------|----------|
| **번들 크기** | Monaco Editor (~500KB)가 초기 번들에서 제외되어 필요할 때만 로드 |
| **초기 로딩** | 에디터 페이지 방문 전까지 Monaco 코드가 다운로드되지 않음 |
| **리렌더링** | onChange 핸들러가 매 렌더링마다 재생성되지 않음 |
| **UX** | 로딩 중 placeholder UI 표시로 레이아웃 시프트 방지 |

---

## 2. Chart.tsx

**파일 경로**: `src/components/console/statistics/chart/Chart.tsx`

### 적용된 규칙

| 규칙 | 우선순위 | 설명 |
|------|----------|------|
| `bundle-dynamic-imports` | CRITICAL | next/dynamic으로 recharts 지연 로딩 |
| `rerender-memo` | MEDIUM | memo()로 컴포넌트 메모이제이션 |
| `rerender-functional-setstate` | MEDIUM | useCallback으로 안정적인 콜백 |
| `js-cache-function-results` | LOW-MEDIUM | useMemo로 데이터 변환 결과 캐싱 |

### 변경 전

```tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { z } from "zod";

// ...

export default function Chart() {
    // ...

    // 매 렌더링마다 함수 재생성
    const transformChartData = (data: ChartData) => {
        if (!data?.labels || !data?.datasets) return [];
        return data.labels.map((label: string, index: number) => {
            // ...
        });
    };

    // 매 렌더링마다 함수 재생성
    const handleSearch = () => {
        // ...
    };

    // 매 렌더링마다 함수 재생성
    const handleLegendClick = (dataKey: string) => {
        if (activeSeries.includes(dataKey)) {
            setActiveSeries(activeSeries.filter(el => el !== dataKey));
        } else {
            setActiveSeries(prev => [...prev, dataKey]);
        }
    };

    return (
        // ...
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transformChartData(chartData)}>
                {/* ... */}
            </LineChart>
        </ResponsiveContainer>
        // ...
        <button onClick={() => reset(initialValues)}>초기화</button>
    );
}
```

### 변경 후

```tsx
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

// Dynamic import for recharts (~300KB bundle reduction)
const RechartsComponents = dynamic(
    () =>
        import("recharts").then(mod => ({
            default: ({ data, datasets, activeSeries, onLegendClick }) => (
                <mod.ResponsiveContainer width="100%" height="100%">
                    <mod.LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <mod.CartesianGrid strokeDasharray="3 3" />
                        <mod.XAxis dataKey="name" />
                        <mod.YAxis />
                        <mod.Tooltip />
                        <mod.Legend iconType="circle" onClick={props => onLegendClick(props.dataKey)} />
                        {datasets.map((dataset, index) => (
                            <mod.Line
                                key={dataset.label}
                                hide={activeSeries.includes(dataset.label)}
                                type="monotone"
                                dataKey={dataset.label}
                                stroke={["#8884d8", "#82ca9d", "#ffc658", "#ff7300"][index % 4]}
                                activeDot={{ r: 8 }}
                            />
                        ))}
                    </mod.LineChart>
                </mod.ResponsiveContainer>
            ),
        })),
    {
        ssr: false,
        loading: () => <div className="flex h-full items-center justify-center text-white">차트 로딩중...</div>,
    },
);

// ...

function Chart() {
    // ...

    // useMemo로 데이터 변환 결과 캐싱
    const transformedChartData = useMemo(() => {
        if (!chartData?.labels || !chartData?.datasets) return [];
        return chartData.labels.map((label: string, index: number) => {
            // ...
        });
    }, [chartData]);  // chartData가 변경될 때만 재계산

    // useCallback으로 함수 메모이제이션
    const handleSearch = useCallback(() => {
        // ...
    }, [searchFilterValues.sdate, searchFilterValues.edate, searchFilterValues.type, updateUrlParams]);

    // useCallback + functional setState로 최적화
    const handleLegendClick = useCallback((dataKey: string) => {
        setActiveSeries(prev => (prev.includes(dataKey) ? prev.filter(el => el !== dataKey) : [...prev, dataKey]));
    }, []);

    // useCallback으로 함수 메모이제이션
    const handleReset = useCallback(() => {
        reset(initialValues);
    }, [reset, initialValues]);

    return (
        // ...
        <RechartsComponents
            data={transformedChartData}
            datasets={chartData.datasets}
            activeSeries={activeSeries}
            onLegendClick={handleLegendClick}
        />
        // ...
        <button onClick={handleReset}>초기화</button>
    );
}

export default memo(Chart);  // 컴포넌트 메모이제이션
```

### 개선 효과

| 항목 | 개선 내용 |
|------|----------|
| **번들 크기** | recharts (~300KB)가 초기 번들에서 제외 |
| **데이터 변환** | `transformedChartData`가 chartData 변경 시에만 재계산 |
| **핸들러 안정성** | `handleSearch`, `handleLegendClick`, `handleReset`이 불필요하게 재생성되지 않음 |
| **컴포넌트 리렌더링** | `memo(Chart)`로 props가 같으면 리렌더링 스킵 |
| **setState 최적화** | `setActiveSeries`에서 functional update 사용으로 의존성 제거 |

---

## 3. MainBanner.tsx

**파일 경로**: `src/components/user/main/-components/MainBanner.tsx`

> **참고**: Swiper는 메인 페이지 첫 진입 시 바로 보이는 배너이므로 dynamic import를 적용하지 않았습니다.
> 지연 로딩 시 배너 영역이 로딩 상태로 보이는 것보다 즉시 렌더링되는 것이 UX에 더 좋습니다.

### 적용된 규칙

| 규칙 | 우선순위 | 설명 |
|------|----------|------|
| `rerender-memo` | MEDIUM | memo()로 컴포넌트 메모이제이션 |
| `rerender-functional-setstate` | MEDIUM | useCallback으로 안정적인 콜백 |
| `js-cache-function-results` | LOW-MEDIUM | useMemo로 필터링 결과 캐싱 |

### 변경 전

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// ...

export default function MainBanner() {
    const router = useRouter();
    // ...
    const [bannerList, setBannerList] = useState<BannerItem[]>([]);

    // useEffect 내에서 필터링 로직 실행 (매번 재계산)
    useEffect(() => {
        if (configBannerData) {
            const list = configBannerData.data.data_list;
            const getDateString = (date: Date) => date.toISOString().slice(0, 10);
            const currentDateStr = getDateString(new Date());
            const updatedList = list.filter((item: BannerItem) => {
                // 필터링 로직...
            });
            setBannerList(updatedList);
        } else {
            setBannerList([]);
        }
    }, [configBannerData]);

    return (
        <>
            {bannerList.length > 0 && (
                <Swiper
                    loop={true}
                    modules={[Autoplay, Pagination]}
                    onSlideChange={swiper => {
                        setActiveIndex(swiper.realIndex);  // 인라인 함수
                    }}
                >
                    {bannerList.map((item, index) => (
                        <SwiperSlide
                            key={`main_banner_${index}`}
                            onClick={() => {  // 인라인 함수
                                if (item.b_url) {
                                    if (item.b_url_target === "2") {
                                        window.open(item.b_url, "_blank", "noopener,noreferrer");
                                    } else {
                                        router.push(item.b_url);
                                    }
                                }
                            }}
                        >
                            {/* ... */}
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </>
    );
}
```

### 변경 후

```tsx
"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

// ...

function MainBanner() {
    const router = useRouter();
    // ...

    // useMemo로 필터링 로직 메모이제이션
    const filteredBannerList = useMemo(() => {
        if (!configBannerData?.data?.data_list) return [];

        const list = configBannerData.data.data_list;
        const getDateString = (date: Date) => date.toISOString().slice(0, 10);
        const currentDateStr = getDateString(new Date());

        return list.filter((item: BannerItem) => {
            // 필터링 로직...
        });
    }, [configBannerData]);  // configBannerData 변경 시에만 재계산

    useEffect(() => {
        setBannerList(filteredBannerList);
    }, [filteredBannerList]);

    // useCallback으로 슬라이드 변경 핸들러 메모이제이션
    const handleSlideChange = useCallback((swiper: SwiperType) => {
        setActiveIndex(swiper.realIndex);
    }, []);

    // useCallback으로 배너 클릭 핸들러 메모이제이션
    const handleBannerClick = useCallback(
        (item: BannerItem) => {
            if (item.b_url) {
                if (item.b_url_target === "2") {
                    window.open(item.b_url, "_blank", "noopener,noreferrer");
                } else {
                    router.push(item.b_url);
                }
            }
        },
        [router],
    );

    if (bannerList.length === 0) return null;  // Early return

    return (
        <Swiper
            loop={true}
            modules={[Autoplay, Pagination]}
            onSlideChange={handleSlideChange}
        >
            {bannerList.map((item, index) => (
                <SwiperSlide
                    key={`main_banner_${index}`}
                    onClick={() => handleBannerClick(item)}
                >
                    {/* ... */}
                </SwiperSlide>
            ))}
        </Swiper>
    );
}

export default memo(MainBanner);  // 컴포넌트 메모이제이션
```

### 개선 효과

| 항목 | 개선 내용 |
|------|----------|
| **필터링 최적화** | `filteredBannerList`가 configBannerData 변경 시에만 재계산 |
| **핸들러 안정성** | `handleSlideChange`, `handleBannerClick`이 불필요하게 재생성되지 않음 |
| **컴포넌트 리렌더링** | `memo(MainBanner)`로 props가 같으면 리렌더링 스킵 |
| **Early return** | 배너가 없으면 즉시 null 반환으로 불필요한 렌더링 방지 |

---

## 총 예상 효과

### 번들 크기 감소

| 라이브러리 | Dynamic Import | 감소량 |
|-----------|----------------|--------|
| Monaco Editor | O | ~500KB |
| recharts | O | ~300KB |
| Swiper | X (즉시 로드 필요) | - |
| **총합** | | **~800KB** |

### 성능 개선

| 항목 | 개선 내용 |
|------|----------|
| **초기 로딩 속도** | 무거운 라이브러리(Monaco, recharts)가 필요한 페이지에서만 로드 |
| **Time to Interactive (TTI)** | 메인 번들 감소로 JavaScript 파싱/실행 시간 단축 |
| **메모리 사용량** | 불필요한 함수/객체 재생성 감소 |
| **리렌더링 횟수** | memo, useCallback, useMemo로 최적화 |

---

## Dynamic Import 적용 기준

| 적용 권장 | 적용하지 않는 경우 |
|----------|-------------------|
| 특정 페이지에서만 사용되는 무거운 라이브러리 | 첫 화면에 바로 보여야 하는 컴포넌트 |
| 관리자 페이지의 에디터/차트 | 메인 배너, 헤더, 네비게이션 |
| 100KB 이상의 라이브러리 | 가벼운 UI 컴포넌트 |

---

## 4. 리스트 컴포넌트 (추가 적용)

### 적용된 규칙

| 규칙 | 우선순위 | 설명 |
|------|----------|------|
| `rerender-memo` | MEDIUM | memo()로 컴포넌트 메모이제이션 |

### 변경 파일

| 파일 | memo | useCallback |
|------|------|-------------|
| `src/components/console/board/post/PostList.tsx` | `PostListPanel`, `PostListItem`, `PostDetailPanel` 서브 컴포넌트 | - |
| `src/components/console/member/MemberList.tsx` | `memo(MemberList)` | `handleChangeCurrentPage`, `handleSearch`, `handleOpenDetail`, `handleLevelChange`, `handleConfirmLevelChange`, `handleDelete`, `handleConfirmDelete`, `handleEditCancel`, `onDeleteComplete` |
| `src/components/console/design/banner/BannerList.tsx` | `memo(BannerList)` | 기존 적용됨 |
| `src/components/console/design/popup/PopupList.tsx` | `memo(PopupList)` | 기존 적용됨 |

### 개선 효과

| 항목 | 개선 내용 |
|------|----------|
| **리렌더링 감소** | 부모 컴포넌트 리렌더링 시 props가 변경되지 않으면 자식 컴포넌트 리렌더링 스킵 |
| **리스트 성능** | 많은 아이템이 있는 리스트에서 개별 아이템 변경 시 전체 리렌더링 방지 |

---

## 5. 폼 컴포넌트 (추가 적용)

### 적용된 규칙

| 규칙 | 우선순위 | 설명 |
|------|----------|------|
| `rerender-memo` | MEDIUM | memo()로 컴포넌트 메모이제이션 |
| `rerender-functional-setstate` | MEDIUM | useCallback으로 안정적인 콜백 참조 |

### 변경 파일

| 파일 | memo | 적용된 핸들러 (useCallback) |
|------|------|---------------------------|
| `src/components/console/member/MemberForm.tsx` | O | `handleChangeMenuAuth`, `onSubmit`, `handleConfirmSave`, `handleDelete`, `handleConfirmDelete` |
| `src/components/console/design/banner/BannerForm.tsx` | O | `handleChangeTab`, `onSubmit`, `handleConfirmSave`, `handleDelete`, `handleConfirmDelete` |

### 개선 효과

| 항목 | 개선 내용 |
|------|----------|
| **컴포넌트 메모이제이션** | memo()로 props가 변경되지 않으면 리렌더링 스킵 |
| **핸들러 안정성** | 매 렌더링마다 핸들러 함수가 재생성되지 않음 |
| **자식 컴포넌트 최적화** | 핸들러를 props로 받는 자식 컴포넌트의 불필요한 리렌더링 방지 |
| **의존성 명확화** | useCallback 의존성 배열로 핸들러가 언제 재생성되는지 명확히 파악 가능 |

---

## 추가 권장 사항

~~아래 컴포넌트들도 동일한 패턴으로 최적화할 수 있습니다:~~

1. ~~**리스트 컴포넌트** - `memo` 적용 권장~~ ✅ 완료
2. ~~**폼 컴포넌트** - `useCallback` 추가 적용 권장~~ ✅ 완료

**모든 권장 사항 적용 완료**

---

## 참고 문서

- [Vercel React Best Practices](https://github.com/vercel/react-best-practices)
- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [React.memo](https://react.dev/reference/react/memo)
- [useCallback](https://react.dev/reference/react/useCallback)
- [useMemo](https://react.dev/reference/react/useMemo)
