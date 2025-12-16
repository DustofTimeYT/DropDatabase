import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-[#3f3f52] text-center">
          Welcome 👋
        </h1>
        <p className="text-sm text-[#6b6b80] text-center mt-2 mb-8">
          Sign in to start discovering ideas
        </p>

        {/* Auth buttons */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-[#dedef2] hover:bg-[#c9c8e2] text-[#3f3f52] font-medium transition-all duration-200"
          >
            <FontAwesomeIcon icon={faGoogle} />
            Continue with Google
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-[#dedef2] hover:bg-[#c9c8e2] text-[#3f3f52] font-medium transition-all duration-200"
          >
            <FontAwesomeIcon icon={faGithub} />
            Continue with GitHub
          </button>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#e5e5f0]" />
          <span className="text-xs text-[#8a8aa3]">Secure login</span>
          <div className="flex-1 h-px bg-[#e5e5f0]" />
        </div>

        <p className="text-xs text-[#6b6b80] text-center leading-relaxed">
          We don’t store your passwords. Authentication is handled securely by
          external service.
        </p>

        <p className="text-xs text-[#6b6b80] text-center mt-4">
          New here? An account will be created automatically.
        </p>
      </div>
    </div>
  )
}
