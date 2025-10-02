<script lang="ts">
	import { buttonVariants } from "@/lib/components/ui/button/index.js";
	import { Calendar } from "@/lib/components/ui/calendar/index.js";
	import * as Popover from "@/lib/components/ui/popover/index.js";
	import { cn } from "@/lib/utils.js";
	import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
	import CalendarIcon from "@lucide/svelte/icons/calendar";

	const df = new DateFormatter("en-US", {
		dateStyle: "long"
	});

	type Props = {
		value: string;
	};

	let { value = $bindable() } = $props();
	let contentRef = $state<HTMLElement | null>(null);
	let date = $state<DateValue>();

	$effect(() => {
		value = date ? date.toString() : "";
	});
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: "outline",
				class: "w-full justify-start text-left font-normal"
			}),
			!value && "text-muted-foreground"
		)}
	>
		<CalendarIcon />
		{date ? df.format(date.toDate(getLocalTimeZone())) : "Pick a date"}
	</Popover.Trigger>
	<Popover.Content bind:ref={contentRef} class="w-auto p-0">
		<Calendar type="single" bind:value={date} />
	</Popover.Content>
</Popover.Root>
