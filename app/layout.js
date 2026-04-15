export const metadata = {
  title: "Sclass Master Elite App",
  description: "Dessert + Savory master app for Sclass Fitness",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
