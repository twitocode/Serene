<script lang="ts">
	import '../app.css';
	import '@fontsource/ibm-plex-mono';
	import '@fontsource-variable/playfair-display';
	import '@fontsource-variable/outfit';

	let { children } = $props();
</script>

<div class="font-sans">
	{@render children()}
</div>
