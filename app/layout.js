export const metadata = {
  title: "Sclass Elite Recipe App",
  description: "Combined dessert and savory builder for Sclass Fitness",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
