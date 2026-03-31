"use client";

export function MoodScale({
	value,
	onChange,
}: {
	value: number | null;
	onChange: (v: number) => void;
}) {
	return (
		<div className="flex gap-1">
			{Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
				<button
					key={n}
					type="button"
					onClick={() => onChange(n)}
					className={`flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
						value === n
							? "bg-primary text-primary-foreground"
							: "border border-border bg-card text-muted-foreground hover:border-primary/40"
					}`}
				>
					{n}
				</button>
			))}
		</div>
	);
}
