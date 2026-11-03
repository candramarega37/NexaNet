import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "NexaNet — Learn. Practice. Troubleshoot.",
  description: "TKJ learning platform for Computer and Network Engineering students.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const saved = cookieStore.get("locale")?.value;
  const initialLocale: Locale = saved === "en" ? "en" : "id";
  return (
    <html
      lang={initialLocale}
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider initialLocale={initialLocale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
