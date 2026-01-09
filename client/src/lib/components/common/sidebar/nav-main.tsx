import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/lib/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function NavMain(props: any) {
  const pathname = usePathname();

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
      items?: {
        title: string;
        url: string;
      }[];
    }[];
  } = props;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Link href={item.url} key={item.title} >
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                className={cn("text-md",{
                  "bg-primary text-primary-foreground hover:bg-primary/25 transition hover:text-black":
                    item.url.endsWith(pathname),
                })}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
