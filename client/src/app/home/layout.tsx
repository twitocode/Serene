import { AppSidebar } from "@/components/home/sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="h-screen" suppressHydrationWarning>
        <SidebarProvider defaultOpen>
          <AppSidebar />
          <section className="p-4 w-full">
            <SidebarTrigger className="-ml-1" />
            {children}
          </section>
        </SidebarProvider>
      </body>
    </html>
  );
}
