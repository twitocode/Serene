"use client";

import * as React from "react";
import type { AnyFieldApi } from "@tanstack/react-form";

interface TanStackFormFieldContextValue {
  field: AnyFieldApi;
}

const TanStackFormFieldContext = React.createContext<TanStackFormFieldContextValue>(
  {} as TanStackFormFieldContextValue
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
  
  if (!context) {
    throw new Error("useTanStackFormField should be used within <FormField>");
  }

  const { field } = context;
  const error = field.state.meta.errors[0];
  const isTouched = field.state.meta.isTouched;
  const isValidating = field.state.meta.isValidating;

  return {
    field,
    name: field.name,
    id: field.name,
    formItemId: `${field.name}-form-item`,
    formDescriptionId: `${field.name}-form-item-description`,
    formMessageId: `${field.name}-form-item-message`,
    error: error ? String(error) : undefined,
    isTouched,
    isValidating,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={`grid gap-2 ${className || ''}`}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

import { Label } from "@/lib/components/ui/label";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useTanStackFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useTanStackFormField();

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
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
  const { error, formMessageId, isValidating } = useTanStackFormField();
  
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

  if (!error) {
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