<script lang="ts">
  import "@fontsource-variable/outfit";
  import "@fontsource-variable/playfair-display";
  import "@fontsource/ibm-plex-mono";
	import "../app.css";

	let { children } = $props();
</script>

<div class="font-sans">
	{@render children()}
</div>
<style>
  :global(body) {
    font-family: "Outfit", sans-serif;
  }
</style>