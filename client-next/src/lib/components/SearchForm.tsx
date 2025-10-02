import { Label } from "@/lib/components/ui/label";
import * as Sidebar from "@/lib/components/ui/sidebar";
import { Search as SearchIcon } from "lucide-react";
import { FormHTMLAttributes, useRef } from "react";

type SearchFormProps = FormHTMLAttributes<HTMLFormElement>;

export function SidebarSearchForm(props: SearchFormProps) {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form ref={ref} {...props}>
      <Sidebar.SidebarGroup className="py-0">
        <Sidebar.SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Sidebar.SidebarInput
            id="search"
            placeholder="Search the docs..."
            aria-label="Search the docs"
            className="pl-8"
          />
          <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </Sidebar.SidebarGroupContent>
      </Sidebar.SidebarGroup>
    </form>
  );
}
