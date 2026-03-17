import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const locales = ["ko", "en", "ja", "zh"] as const;
const defaultLocale = "ko";
const localeHeaderName = "X-NEXT-INTL-LOCALE";

const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: "as-needed",
});

export default function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 루트 경로는 locale 처리를 하지 않도록 통과
    if (pathname === "/") {
        return NextResponse.next();
    }

    // 기본 locale 경로가 내부 rewrite로 다시 proxy를 타면
    // /login -> /ko/login -> /login 루프가 생길 수 있어 그대로 통과시킨다.
    if (pathname === `/${defaultLocale}`) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith(`/${defaultLocale}/`)) {
        const headers = new Headers(request.headers);
        headers.set(localeHeaderName, defaultLocale);

        return NextResponse.next({
            request: {
                headers,
            },
        });
    }

    // /console 경로는 /console/login으로 리다이렉트
    if (pathname === "/console") {
        return NextResponse.redirect(new URL("/console/login", request.url));
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: [
        // /console만 포함하고 /console/*는 제외, health는 제외
        "/((?!api|_next|_vercel|console/|popup|health|.*\\..*).*)",
    ],
};
