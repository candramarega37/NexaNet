"use client";

import { useLanguage } from "@/components/LanguageProvider";

export function useTranslation() {
  const { t, locale } = useLanguage();
  return { t, locale };
}