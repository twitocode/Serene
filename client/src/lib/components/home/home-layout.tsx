"use client";
import AppSidebar from "@/lib/components/common/sidebar/app-sidebar";
import { Button } from "@/lib/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/lib/components/ui/sidebar";
import { usePreferencesQuery } from "@/lib/hooks/queries/use-preferences";
import { usePasswordLockStore } from "@/lib/hooks/stores/lock-store";
import { Lock } from "lucide-react";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";

interface Props {}

export default function HomeLayout({ children }: PropsWithChildren<Props>) {
  const { setLockState, isLocked } = usePasswordLockStore();
  const { data: prefs } = usePreferencesQuery();

  return !isLocked ? (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4 justify-between w-full">
            <SidebarTrigger className="-ml-1" />

            {prefs?.passwordLock != null && (
              <div className="">
                <Toaster />
                <Button
                  className="hover:bg-red-300"
                  variant="outline"
                  onClick={() => {
                    setLockState(true);
                  }}
                >
                  <Lock /> Lock Page
                </Button>
              </div>
            )}
          </div>
        </header>
        <div className="px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  ) : (
    <></>
  );
}
