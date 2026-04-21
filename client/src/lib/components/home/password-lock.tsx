import { Lock, Unlock } from "iconsax-reactjs";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import { Input } from "@/lib/components/ui/input";
import { useSettingsQuery } from "@/lib/hooks/queries/use-settings";
import { usePasswordLockStore } from "@/lib/hooks/stores/lock-store";

export default function PasswordLock() {
	const { setLockState } = usePasswordLockStore();
	const [isUnlocking, setIsUnlocking] = React.useState(false);
	const { data: settings } = useSettingsQuery();

	const handleUnlock = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value === settings?.passwordLock && !isUnlocking) {
			setIsUnlocking(true);

			// Trigger unlock animation sequence
			setTimeout(() => {
				setLockState(false);
			}, 600); // Wait for animation to complete
		}
	};

	return (
		<motion.span
			className="flex items-center space-x-4"
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{
				opacity: isUnlocking ? 0 : 1,
				scale: isUnlocking ? 1.2 : 1,
			}}
			transition={{ duration: 0.5, ease: "easeInOut" }}
		>
			<AnimatePresence mode="wait">
				{!isUnlocking ? (
					<motion.div
						key="lock"
						initial={{ rotate: 0 }}
						animate={{ rotate: [0, -5, 5, 0] }}
						exit={{ rotate: 360, scale: 0 }}
						transition={{
							duration: 0.5,
							repeat: Infinity,
							repeatDelay: 3,
						}}
					>
						<Lock variant="Bulk" size={32} color="currentColor" />
					</motion.div>
				) : (
					<motion.div
						key="unlock"
						initial={{ rotate: -360, scale: 0 }}
						animate={{ rotate: 0, scale: 1 }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					>
						<Unlock variant="Bulk" size={32} color="currentColor" />
					</motion.div>
				)}
			</AnimatePresence>
			{!isUnlocking && (
				<motion.div
					initial={{ width: 0, opacity: 0 }}
					animate={{ width: "auto", opacity: 1 }}
					exit={{ width: 0, opacity: 0 }}
					transition={{ delay: 0.1, duration: 0.3 }}
					whileFocus={{ scale: 1.02 }}
					className="flex items-center"
				>
					<Input
						type="password"
						className="font-bold text-2xl bg-secondary h-auto py-2"
						onChange={handleUnlock}
						onFocus={(e) => {
							e.target.parentElement?.classList.add("scale-105");
						}}
						onBlur={(e) => {
							e.target.parentElement?.classList.remove("scale-105");
						}}
					/>
				</motion.div>
			)}
		</motion.span>
	);
}
