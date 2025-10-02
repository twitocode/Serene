<script lang="ts">
	import { constants } from "@/lib/constants";

  const affirmations = constants.dailyAffirmations;
  const randomIndex = Math.floor(Math.random() * affirmations.length);

  const affirmation = affirmations[randomIndex];
</script>

<div class="h-15 w-full flex items-center justify-center shadow-background">
	<p class="text-primary text-xl">{affirmation}</p>
</div>
