<script>
	import Footer from "$lib/components/common/footer.svelte";
	import Navbar from "$lib/components/common/navbar.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
</script>

<Navbar />
<div class="mt-12 space-y-24">
	<section class="hero-content text-center md:mx-48">
		<div class="hero flex flex-col items-center space-y-16">
			<div class="flex flex-col items-center space-y-4">
				<h1 class="font-noto flex-1 text-5xl font-bold">Your mental wellness, made simple.</h1>
				<p>Put some random text here i dunno</p>
			</div>
			<div class="flex space-x-2">
				<Button>
					<a class="" href="/signup"> Sign up </a>
				</Button>
				<Button href="/login">Or Login</Button>
			</div>
			<!--&lt;!&ndash; Put a proper screenshot here later &ndash;&gt;-->
			<div class="mockup-browser border-base-300 w-full border">
				<div class="mockup-browser-toolbar">
					<div class="input">https://serene.vercel.app</div>
				</div>
				<div class="border-base-300 grid h-[40rem] place-content-center border-t">
					Serene applications here!
				</div>
			</div>
		</div>
	</section>
	<Footer />
</div>