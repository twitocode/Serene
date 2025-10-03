import AppSidebar from "@/lib/components/AppSidebar";
import * as Sidebar from "@/lib/components/ui/sidebar";
import { PropsWithChildren } from "react";

export default function layout({ children, data }: PropsWithChildren<any>) {
  return (
    <Sidebar.SidebarProvider>
      <AppSidebar />
      <Sidebar.SidebarInset>
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            <Sidebar.SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 pt-4 px-40">{children}</div>
      </Sidebar.SidebarInset>
    </Sidebar.SidebarProvider>
  );
}
