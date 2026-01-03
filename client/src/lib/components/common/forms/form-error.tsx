interface Props {
  error?: string;
}
export default function FormError({ error }: Props) {
  return (
    error && <div className="text-sm text-red-600 text-center">{error}</div>
  );
}
