"use client";

import { useState } from "react";
import { CheckCircle2, CircleDashed, ChevronRight, RefreshCw, HelpCircle, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/lib/components/ui/button";
import { Progress } from "@/lib/components/ui/progress";

const QUESTIONS = [
	{
		id: "q1",
		question: "How would you describe your current mood?",
		options: [
			{ label: "Stable / Coping well", score: 0 },
			{ label: "Stressed / Overwhelmed", score: 1 },
			{ label: "Low / Anxious for several days", score: 2 },
			{ label: "In crisis / Immediate danger", score: 3 }
		]
	},
	{
		id: "q2",
		question: "How has your sleep been lately?",
		options: [
			{ label: "Consistent and restful", score: 0 },
			{ label: "Having some trouble sleeping", score: 1 },
			{ label: "Very poor / Irregular", score: 2 }
		]
	},
	{
		id: "q3",
		question: "Are you struggling with daily tasks (work, school, self-care)?",
		options: [
			{ label: "Not at all", score: 0 },
			{ label: "A little bit", score: 1 },
			{ label: "Significant difficulty", score: 2 }
		]
	}
];

export function SelfScreeningTool() {
	const [currentStep, setCurrentStep] = useState(-1); // -1 is intro
	const [answers, setAnswers] = useState<number[]>([]);
	const [isFinished, setIsFinished] = useState(false);

	const handleStart = () => setCurrentStep(0);
	
	const handleAnswer = (score: number) => {
		const newAnswers = [...answers, score];
		setAnswers(newAnswers);
		
		if (currentStep < QUESTIONS.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			setIsFinished(true);
		}
	};

	const handleReset = () => {
		setCurrentStep(-1);
		setAnswers([]);
		setIsFinished(false);
	};

	const totalScore = answers.reduce((a, b) => a + b, 0);
	const progress = ((currentStep) / QUESTIONS.length) * 100;

	return (
		<div className="card-glass relative p-6 shadow-md overflow-hidden mb-8 transition-all duration-200">
			<div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/10 blur-3xl animate-breathe" />
			<div
				className="pointer-events-none absolute -bottom-16 -left-12 size-44 rounded-full bg-warm/10 blur-2xl animate-breathe"
				style={{ animationDelay: "3s" }}
			/>
			<AnimatePresence mode="wait">
				{currentStep === -1 ? (
					<motion.div
						key="intro"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-6"
					>
						<div className="flex items-center gap-4">
							<div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lime/15 to-lime/5 text-lime ring-1 ring-lime/20 shadow-sm">
								<HelpCircle className="size-7" strokeWidth={1.5} />
							</div>
							<div className="space-y-0.5">
								<h3 className="font-serif text-2xl font-semibold text-foreground">Wellness Check-in</h3>
								<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick triage</p>
							</div>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Not sure where to start? Take this quick 30-second check-in to see which McMaster resources might be best for you right now.
						</p>
						<Button onClick={handleStart} size="lg" className="btn-playful w-full gap-2 text-base font-medium group">
							Start Check-in
							<ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
						</Button>
					</motion.div>
				) : isFinished ? (
					<motion.div
						key="results"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="space-y-6"
					>
						<div className="flex items-center gap-4">
							<div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lime/15 to-lime/5 text-lime ring-1 ring-lime/20 shadow-sm">
								<CheckCircle2 className="size-7" strokeWidth={1.5} />
							</div>
							<div className="space-y-0.5">
								<h3 className="font-serif text-2xl font-semibold text-foreground">Recommended Support</h3>
								<p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Based on your input</p>
							</div>
						</div>
						
						<div className="space-y-4">
							{totalScore >= 3 ? (
								<div className="card-glass flex gap-4 p-4 border-l-2 border-l-destructive/60">
									<div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 ring-1 ring-destructive/15">
										<ShieldAlert className="size-5 text-destructive" strokeWidth={1.5} />
									</div>
									<div className="space-y-1">
										<h4 className="font-semibold text-foreground leading-tight">Direct Support Recommended</h4>
										<p className="text-sm text-muted-foreground leading-relaxed">
											Based on your answers, we recommend contacting the Student Wellness Centre for an initial consultation.
										</p>
									</div>
								</div>
							) : (
								<div className="card-glass flex gap-4 p-4 border-l-2 border-l-primary/60">
									<div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
										<CheckCircle2 className="size-5 text-primary" strokeWidth={1.5} />
									</div>
									<div className="space-y-1">
										<h4 className="font-semibold text-foreground leading-tight">Wellness & Peer Support</h4>
										<p className="text-sm text-muted-foreground leading-relaxed">
											You seem to be managing, but could benefit from peer support or wellness workshops. Check out the Student Success Centre.
										</p>
									</div>
								</div>
							)}
							
							<div className="grid grid-cols-2 gap-3">
								<Button variant="outline" onClick={handleReset} className="gap-2 text-xs h-10 rounded-xl">
									<RefreshCw className="size-3.5" />
									Retake
								</Button>
								<Button className="text-xs h-10 rounded-xl" asChild>
									<a href="#resources">View Resources</a>
								</Button>
							</div>
						</div>
					</motion.div>
				) : (
					<motion.div
						key={`q-${currentStep}`}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						className="space-y-6 py-2"
					>
						<div className="space-y-4">
							<div className="flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-widest">
								<span>Question {currentStep + 1} of {QUESTIONS.length}</span>
								<span>{Math.round(progress)}%</span>
							</div>
							<Progress value={progress} className="h-1.5" />
						</div>

						<h4 className="text-lg font-bold font-serif leading-tight">
							{QUESTIONS[currentStep].question}
						</h4>

						<div className="grid gap-3">
							{QUESTIONS[currentStep].options.map((option, i) => (
								<Button
									key={i}
									variant="outline"
									className="justify-start h-auto py-4 px-5 text-left text-sm whitespace-normal hover:border-primary/50 hover:bg-primary/5 rounded-2xl"
									onClick={() => handleAnswer(option.score)}
								>
									{option.label}
								</Button>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
