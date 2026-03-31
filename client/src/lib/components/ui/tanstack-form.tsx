"use client";

import type { AnyFieldApi } from "@tanstack/react-form";
import * as React from "react";

interface TanStackFormFieldContextValue {
	field: AnyFieldApi;
}

const TanStackFormFieldContext =
	React.createContext<TanStackFormFieldContextValue>(
		{} as TanStackFormFieldContextValue,
	);

const Form = ({ children }: { children: React.ReactNode }) => {
	return <>{children}</>;
};

const FormField = ({
	field,
	children,
}: {
	field: AnyFieldApi;
	children: React.ReactNode;
}) => {
	return (
		<TanStackFormFieldContext.Provider value={{ field }}>
			{children}
		</TanStackFormFieldContext.Provider>
	);
};

const useTanStackFormField = () => {
	const context = React.useContext(TanStackFormFieldContext);

	const field = context?.field;
	const firstError = field?.state.meta.errors[0];
	const isTouched = field?.state.meta.isTouched ?? false;
	const isValidating = field?.state.meta.isValidating ?? false;

	const error = React.useMemo(() => {
		if (!firstError) return undefined;

		if (typeof firstError === "string") return firstError;

		if (Array.isArray(firstError)) return String(firstError[0]);

		if (typeof firstError === "object" && firstError !== null) {
			return (firstError as { message?: string }).message || String(firstError);
		}

		return String(firstError);
	}, [firstError]);

	if (!context || !context.field) {
		return {
			field: undefined,
			name: undefined,
			id: undefined,
			formItemId: undefined,
			formDescriptionId: undefined,
			formMessageId: undefined,
			error: undefined,
			isTouched: false,
			isValidating: false,
		};
	}

	return {
		field,
		name: field.name,
		id: field.name,
		formItemId: `${field.name}-form-item`,
		formDescriptionId: `${field.name}-form-item-description`,
		formMessageId: `${field.name}-form-item-message`,
		error,
		isTouched,
		isValidating,
	};
};

type FormItemContextValue = {
	id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
	{} as FormItemContextValue,
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
	const id = React.useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div
				data-slot="form-item"
				className={cn("grid gap-2", className)}
				{...props}
			/>
		</FormItemContext.Provider>
	);
}

import { Slot } from "@radix-ui/react-slot";
import { Label } from "@/lib/components/ui/label";
import { cn } from "@/lib/utils";

function FormLabel({
	className,
	...props
}: React.ComponentProps<typeof Label>) {
	const { error, formItemId, isTouched } = useTanStackFormField();

	return (
		<Label
			data-slot="form-label"
			data-error={isTouched && !!error}
			className={cn("data-[error=true]:text-destructive", className)}
			htmlFor={formItemId}
			{...props}
		/>
	);
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
	const { error, formItemId, formDescriptionId, formMessageId, isTouched } =
		useTanStackFormField();

	return (
		<Slot
			data-slot="form-control"
			id={formItemId}
			aria-describedby={
				!formDescriptionId
					? undefined
					: !(isTouched && error)
						? `${formDescriptionId}`
						: `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={isTouched && !!error}
			{...props}
		/>
	);
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
	const { formDescriptionId } = useTanStackFormField();

	return (
		<p
			data-slot="form-description"
			id={formDescriptionId}
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
	const { error, formMessageId, isValidating, isTouched } =
		useTanStackFormField();

	if (isValidating) {
		return (
			<p
				data-slot="form-message"
				id={formMessageId}
				className={cn("text-muted-foreground text-sm", className)}
			>
				Validating...
			</p>
		);
	}

	if (!isTouched || !error) {
		return null;
	}

	return (
		<p
			data-slot="form-message"
			id={formMessageId}
			className={cn("text-destructive text-sm", className)}
			{...props}
		>
			{error}
		</p>
	);
}

export {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useTanStackFormField,
};
