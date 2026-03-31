function SectionLabel({ children }: { children: string }) {
	return (
		<p className="mb-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
			{children}
		</p>
	);
}

export { SectionLabel };
