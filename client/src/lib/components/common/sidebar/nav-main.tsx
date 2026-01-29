import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/lib/components/ui/sidebar";
import { useUserQuery } from "@/lib/hooks/queries/use-user";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavMain(props: any) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: user } = useUserQuery();

  const {
    items,
  }: {
    items: {
      title: string;
      url: string;
      // this should be `Component` after @lucide/svelte updates types
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon?: any;
      isActive?: boolean;
      role: string;
      items?: {
        title: string;
        url: string;
      }[];
    }[];
  } = props;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          if (item.role == "Admin" && user?.roles.includes("Admin")) {
            return (
              <Link
                href={item.url}
                key={item.title}
                onClick={() => isMobile && setOpenMobile(false)}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn("text-md", {
                      "bg-primary text-primary-foreground hover:bg-primary/25 transition hover:text-black":
                        item.url.endsWith(pathname),
                    })}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            );
          } else if (item.role == "User") {
            return (
              <Link
                href={item.url}
                key={item.title}
                onClick={() => isMobile && setOpenMobile(false)}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn("text-md", {
                      "bg-primary text-primary-foreground hover:bg-primary/25 transition hover:text-black":
                        item.url.endsWith(pathname),
                    })}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
