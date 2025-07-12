import type { AnyFieldApi } from "@tanstack/react-form";

export default function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
       <>{field.state.meta.errors.map((error: {message: string}) => <p className="text-red-400">{error.message}</p>)}</>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}
