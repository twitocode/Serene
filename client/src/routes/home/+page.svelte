<script lang="ts">
	import DailyAffirmation from "$lib/components/home/daily-affirmation.svelte";
	import { Button } from "$lib/components/ui/button";
	import type { User } from "$lib/types";
	import { ArrowRight } from "@lucide/svelte";
	import { getContext } from "svelte";

	const user = getContext<User>("user");

	function getGreetingTime() {
		let currentHour = new Date().getHours();
		let greeting;

		if (currentHour >= 18 && currentHour < 24) {
			greeting = "Evening";
		} else if (currentHour >= 12 && currentHour < 18) {
			greeting = "Afternoon";
		} else {
			greeting = "Morning";
		}

		return greeting;
	}
</script>

<main class="flex flex-col gap-8">
	<section class="flex flex-col items-center justify-center">
		<DailyAffirmation />
		<h1 class="text-center font-serif text-5xl font-light">
			Good {getGreetingTime()}
			{user.firstName}
		</h1>
	</section>
	<section></section>
	<section class="grid grid-cols-2 gap-4">
		<div class="items-left flex w-full flex-col justify-between bg-primary-400 border-20 rounded-lg border-primary p-4">
			<div>
        <h1 class="font-bold ">Talk about how you are currently feeling right now</h1>
      </div>
			<Button variant="outline" href="/home/reflect" class="max-w-4/5 w-auto">
				<ArrowRight />
      </Button>
		</div>
		<div class="items-left flex w-full flex-col justify-between bg-gray-400 p-4">
			<Button
        href="/home/ambience"
				class="group relative flex h-80 w-80 items-center justify-center overflow-hidden rounded-full bg-primary shadow-lg"
			>
				<!-- Outer Layer Glow -->
				<span
					class="absolute inset-0 rounded-full bg-primary opacity-50 transition group-hover:opacity-70"
				></span>

				<!-- Middle Layer (border effect) -->
				<span class="absolute inset-2 rounded-full border-4 border-red-300"></span>

				<!-- Inner Circle -->
				<span class="relative flex h-40 w-40 items-center justify-center rounded-full bg-red-500">
					<!-- Play Icon (Triangle) -->
					<svg class="h-80 w-80 text-white" fill="currentColor" viewBox="0 0 24 24">
						<path d="M8 5v14l11-7z" />
					</svg>
				</span>
			</Button>
		</div>

		<div class="max-h-40 w-full bg-gray-400">Hey</div>
	</section>
</main>
