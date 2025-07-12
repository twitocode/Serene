export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col justify-between h-screen">
        {children}
      </body>
    </html>
  );
}
