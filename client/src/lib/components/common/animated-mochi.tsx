"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Default from "../../../../public/mochi/Mochi.svg";

interface AnimatedMochiProps {
	className?: string;
}

export function AnimatedMochi({ className }: AnimatedMochiProps) {
	return (
		<motion.div
			className={cn("relative inline-block", className)}
			animate={{
				y: [0, -10, 0],
			}}
			transition={{
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut",
			}}
		>
			<Image
				src={Default}
				alt="Mochi"
				className="w-full h-full object-contain pointer-events-none select-none"
				priority
			/>
		</motion.div>
	);
}
