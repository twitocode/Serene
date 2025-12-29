import { AuthNavbar } from "@/lib/components/common/auth-navbar";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" mx-40 mt-5">
      <AuthNavbar />
      {children}
    </div>
  );
}
