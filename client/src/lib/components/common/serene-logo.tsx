interface Props {
  noText?: boolean;
  sidebar?: boolean;
}
export default function SereneLogo({ noText, sidebar }: Props) {
  return <div className="font-semibold text-xl">Serene</div>;
}
