import { LoginForm } from "@/components/auth/LoginForm";
export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* ── Left panel: full-bleed image ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="/login.png"
          alt="AutoServe"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        {/* subtle dark gradient so the image edge fades into the right panel */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
      </div>

      {/* ── Right panel: login form ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-white">
        <LoginForm />
      </div>
    </div>
  );
}
