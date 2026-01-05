"use client";
import AppSidebar from "@/lib/components/common/sidebar/app-sidebar";
import { ThemeToggle } from "@/lib/components/common/theme-toggle";
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
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="flex flex-col h-full overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-background">
          <div className="flex items-center gap-2 px-4 justify-between w-full">
            <SidebarTrigger className="-ml-1" />
            <div className="flex space-x-2">
              <ThemeToggle />
              {prefs?.passwordLock != null && (
                <>
                  <Toaster />
                  <Button
                    className="hover:dark:bg-red-800 hover:bg-red-400 hover:text-foreground"
                    variant="outline"
                    onClick={() => {
                      setLockState(true);
                    }}
                  >
                    <Lock /> Lock Page
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  ) : (
    <></>
  );
}
