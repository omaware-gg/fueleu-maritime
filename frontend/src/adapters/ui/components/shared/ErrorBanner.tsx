interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps): JSX.Element {
  return (
    <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
      <span>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-red-600 hover:text-red-900"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
}
