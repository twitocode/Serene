import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/lib/components/ui/sidebar";
import { useUserQuery } from "@/lib/hooks/queries/use-user";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  title: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any;
  role: string;
};

export type NavSection = {
  label?: string;
  items: NavItem[];
};

function isNavActive(pathname: string, url: string) {
  if (url === "/home") {
    return pathname === "/home" || pathname === "/home/";
  }
  return pathname === url || pathname.startsWith(`${url}/`);
}

export default function NavMain({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { data: user } = useUserQuery();

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup
          key={section.label ?? section.items[0]?.url ?? "nav"}
          className="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-1.5"
        >
          {section.label ? (
            <SidebarGroupLabel className="px-1 text-[0.65rem] uppercase tracking-widest text-muted-foreground/90">
              {section.label}
            </SidebarGroupLabel>
          ) : null}
          <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
            {section.items.map((item) => {
              if (item.role === "Admin" && !user?.roles.includes("Admin")) {
                return null;
              }
              const active = isNavActive(pathname, item.url);
              return (
                <Link
                  href={item.url}
                  key={item.title}
                  className="block min-w-0 w-full group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-auto"
                  onClick={() => isMobile && setOpenMobile(false)}
                >
                  <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        "rounded-xl transition-colors group-data-[collapsible=icon]:justify-center",
                        active
                          ? "bg-primary/15 text-primary shadow-sm hover:bg-primary/20 hover:text-primary"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      {item.icon && <item.icon className="size-4 shrink-0" />}
                      <span className="font-medium group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
