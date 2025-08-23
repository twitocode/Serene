<script lang="ts">
	import { getContext, setContext } from "svelte";
	import type { PageProps } from "./$types";
	import DailyAffirmation from "$lib/components/home/daily-affirmation.svelte";
	import type { User } from "$lib/types";

  const user = getContext<User>("user")

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

<main class="flex flex-col gap-4">
  <section class="flex justify-center">
    <DailyAffirmation />
  </section>
  <section>
    <h1 class="text-5xl">Good {getGreetingTime()} {user.firstName}</h1>
  </section>
</main>