export const metadata = {
  title: "Kai Webber Portfolio",
  description: "Kai Webber's personal website.",
  keywords: "Kai Webber, Northeastern University, NEU, Computer Science, Computer Engineering, Portfolio, Kai, Webber, Student",
  author: "Kai Webber",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon_io/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon_io/favicon-16x16.png" />
        <link rel="manifest" href="/assets/favicon_io/site.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  );
}
