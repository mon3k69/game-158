export const metadata = {
  title: "Gra ZHP",
  description: "Gra terenowa ZHP"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}