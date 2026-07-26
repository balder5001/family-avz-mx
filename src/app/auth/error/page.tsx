export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="text-xl font-semibold">Sign-in failed</h1>
      <p className="text-neutral-500">
        Something went wrong finishing sign-in. Please try again.
      </p>
    </div>
  );
}
