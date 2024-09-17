import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import Script from "next/script";
import "./globals.css";
import "antd/dist/reset.css";

export const metadata: Metadata = {
  title: "German Foundations | Henophilia Funding",
  description:
    "Discover the most relevant funding opportunities for your project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={`antialiased`}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
