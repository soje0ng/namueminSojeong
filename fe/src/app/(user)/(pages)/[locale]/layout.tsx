import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import Layout from "@/components/user/layout/Layout";
import UserPopup from "@/components/user/popup/Popup";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/constants/common/site";
import { fetchSiteMetadata } from "@/lib/fetchSiteMetadata";

// 지원하는 locale 목록
const supportedLocales = ["ko", "en", "ja", "zh"];

// 동적 메타데이터 생성 (locale 기반)
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const language = locale
        ? LANGUAGES.find(lang => lang.locale === locale)?.code || DEFAULT_LANGUAGE
        : DEFAULT_LANGUAGE;

    return await fetchSiteMetadata(language);
}

export default async function UserLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // 유효하지 않은 locale인 경우 404 반환 (.well-known 등 시스템 경로 방어)
    if (!supportedLocales.includes(locale)) {
        notFound();
    }

    const messages = await getMessages({ locale });

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <Layout>{children}</Layout>
            <UserPopup />
        </NextIntlClientProvider>
    );
}
