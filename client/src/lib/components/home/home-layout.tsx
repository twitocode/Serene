"use client";
import AppSidebar from "@/lib/components/common/sidebar/app-sidebar";
import { ThemeToggle } from "@/lib/components/common/theme-toggle";
import { Button } from "@/lib/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/lib/components/ui/sidebar";
import { useSettingsQuery } from "@/lib/hooks/queries/use-settings";
import { useUserQuery } from "@/lib/hooks/queries/use-user";
import { usePasswordLockStore } from "@/lib/hooks/stores/lock-store";
import { Flame, Lock } from "lucide-react";
import { PropsWithChildren } from "react";
import { Toaster } from "sonner";



export default function HomeLayout({ children }: PropsWithChildren) {
  const { setLockState, isLocked } = usePasswordLockStore();
  const { data: settings } = useSettingsQuery();
  const { data: user } = useUserQuery();

  return !isLocked ? (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex flex-col h-full overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background">
          <div className="flex items-center gap-2 px-4 justify-between w-full">
            <SidebarTrigger className="-ml-1" />
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1.5 rounded-full shadow-md">
                <Flame className="w-4 h-4" fill="currentColor" />
                <span className="font-bold text-sm">
                  {user?.profile?.currentStreak || 0} Days
                </span>
              </div>
              <ThemeToggle />
              {!!settings?.passwordLock && (
                <>
                  <Button
                    className="hover:dark:bg-red-800 hover:bg-red-400 hover:text-foreground"
                    variant="outline"
                    onClick={() => {
                      setLockState(true);
                    }}
                  >
                    <Lock /> Lock Page
                  </Button>
                  <Toaster/>

                </>
              )}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  ) : (
    <></>
  );
}
