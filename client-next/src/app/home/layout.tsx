  import AppSidebar from "@/lib/components/AppSidebar";
  import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/lib/components/ui/sidebar";
  import { getUser } from "@/lib/server/getUser";
  import { Result, User } from "@/lib/types";
  import { cookies } from "next/headers";
  import { PropsWithChildren } from "react";

  export default async function layout({
    children,
    data,
  }: PropsWithChildren<any>) {
    async function loadData() {
      const user = await getUser();

      const cookieStore = await cookies();
      const accessToken = cookieStore.get("ACCESS_TOKEN")?.value;

      const res = await fetch(`${process.env.SERVER_URL}/mood/check-in`, {
        method: "GET",
        headers: {
          Cookie: `ACCESS_TOKEN=${accessToken}`,
        },
      });

      if (!res.ok) {
        console.log(await res.json());
      }

      const item = (await res.json()) as Result<boolean>;

      return {
        hasMoodCheckIn: item.value,
        user,
      };
    }

    const { user, hasMoodCheckIn } = await loadData();
    console.log(user);

    return (
      <SidebarProvider>
        <AppSidebar user={user!} />
        <SidebarInset>
          <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 pt-4 px-40">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
