interface BadgeProps {
  compliant: boolean;
}

export default function Badge({ compliant }: BadgeProps): JSX.Element {
  return compliant ? (
    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
      Compliant
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
      Non-compliant
    </span>
  );
}
