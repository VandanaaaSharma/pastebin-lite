import "./globals.css";

export const metadata = {
  title: "Pastebin Lite",
  // description: "Share text with friendly limits",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #f3e8ff 0%, #e0f2fe 50%, #ecfeff 100%)",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif",
          color: "#1f2937",
        }}
      >
        {children}
      </body>
    </html>
  );
}
