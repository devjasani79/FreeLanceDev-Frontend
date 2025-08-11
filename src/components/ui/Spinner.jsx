export default function Spinner() {
  return (
    <div className="w-full flex justify-center items-center py-12" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
