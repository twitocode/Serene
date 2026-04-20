"use client";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useOnboardingStore } from "@/lib/components/providers/zustand-provider";

export function IntermediateStepTwo() {
	const { name, goNext } = useOnboardingStore((state) => state);
	useEffect(() => {
		const timer = setTimeout(() => {
			goNext();
		}, 1200);

		return () => clearTimeout(timer);
	}, [goNext]);

	return (
		<div className="text-center space-y-8">
			<h1 className="text-3xl font-semibold">
				Hello,{" "}
				<motion.span
					className="text-primary text-shadow-xs"
					animate={{
						scale: [1, 2, 2, 1, 1],
						rotate: [0, 0, 180, 180, 0],
						borderRadius: ["0%", "0%", "50%", "50%", "0%"],
					}}
					transition={{
						duration: 2,
						ease: "easeInOut",
						times: [0, 0.2, 0.5, 0.8, 1],
						repeat: 1,
						repeatDelay: 1,
					}}
				>
					{name}
				</motion.span>
			</h1>
			<div className="animate-pulse text-gray-500 text-sm">
				Getting things ready...
			</div>
		</div>
	);
}
