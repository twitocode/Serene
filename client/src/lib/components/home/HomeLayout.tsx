"use client";
import AppSidebar from "@/lib/components/AppSidebar";
import SongPlayer from "@/lib/components/music/SongPlayer";
import { Button } from "@/lib/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/lib/components/ui/sidebar";
import { usePreferencesStore } from "@/lib/stores/preferencesStore";
import { User } from "@/lib/types";
import { Lock } from "lucide-react";
import { PropsWithChildren } from "react";
import { toast, Toaster } from "sonner";

interface Props {
  user: User | undefined;
}

export default function HomeLayout({
  user,
  children,
}: PropsWithChildren<Props>) {
  const preferences = usePreferencesStore();

  return !preferences.isLocked ? (
    <SidebarProvider>
      <AppSidebar user={user!} />
      <SidebarInset>
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4 justify-between w-full">
            <SidebarTrigger className="-ml-1" />
            <div className="">
              <Toaster />
              <Button
                className="hover:bg-red-300"
                variant="outline"
                onClick={() => {
                  toast("See you later...");
                  preferences.setLockState(true);
                }}
              >
                <Lock /> Lock Page
              </Button>
            </div>
          </div>
        </header>
        <div className="px-4">{children}</div>
        <SongPlayer />
      </SidebarInset>
    </SidebarProvider>
  ) : (
    <></>
  );
}
