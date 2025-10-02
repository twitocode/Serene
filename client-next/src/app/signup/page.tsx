import { GalleryVerticalEndIcon } from "lucide-react";

	import LoginForm from "@/lib/components/auth/login-form.svelte";
	import SuperDebug, { superForm } from "sveltekit-superforms";

export default function page({data}: any) {
	// Client API:
	const formProps = data.form;
  const {SERVER_URL, IS_DEVELOPMENT } = data;

  return (
  <div className="grid min-h-svh lg:grid-cols-2">
	<div className="flex flex-col gap-4 p-6 md:p-10">
		<div className="flex justify-center gap-2 md:justify-start">
			<a href="##" className="flex items-center gap-2 font-medium">
				<div
					className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"
				>
					<GalleryVerticalEndIcon className="size-4" />
				</div>
				Serene
			</a>
		</div>
		<div className="flex flex-1 items-center justify-center">
			<div className="w-full max-w-xs">
				<LoginForm {formProps} {SERVER_URL} {IS_DEVELOPMENT} />
			</div>
		</div>
	</div>
	<div className="bg-muted relative hidden lg:block">
		<img
			src="https://i.pinimg.com/736x/47/6f/43/476f43c454ab1ca44e1ad5dd1a001d3f.jpg"
			alt="placeholder"
			className="absolute inset-0 h-full w-full object-cover"
		/>
	</div>
</div>
  )
}