export type TransitionType = "slide" | "fade" | "scale";

export const getVariants = (type: TransitionType) => {
	switch (type) {
		case "slide":
			return {
				enter: (direction: number) => ({
					x: direction > 0 ? 1000 : -1000,
					opacity: 0,
				}),
				center: { x: 0, opacity: 1 },
				exit: (direction: number) => ({
					x: direction < 0 ? 1000 : -1000,
					opacity: 0,
				}),
			};
		case "fade":
			return {
				enter: { opacity: 0 },
				center: { opacity: 1 },
				exit: { opacity: 0 },
			};
		case "scale":
			return {
				enter: { opacity: 0, scale: 0.8 },
				center: { opacity: 1, scale: 1 },
				exit: { opacity: 0, scale: 0.8 },
			};
	}
};
