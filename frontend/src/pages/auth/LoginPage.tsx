import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthLayout } from "./AuthLayout";
import { Button, Field, Input } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api-client";

interface FormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  // const { signin, googleSigninUrl } = useAuth();
  const { signin, googleSigninUrl, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      // await signin(values);
      // navigate("/app/documents");
 const result = await signin(values);

if (result.isAdmin) {
  navigate("/admin");
} else {
  navigate("/app/documents");
}
    } catch (err) {
      setServerError(getApiErrorMessage(err, "Couldn't sign you in. Check your details and try again."));
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to reach your documents and secrets.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            {...register("email", { required: "Enter your email" })}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password", { required: "Enter your password" })}
          />
        </Field>

        {serverError && <p className="text-sm text-danger">{serverError}</p>}

        <Button type="submit" loading={isSubmitting} className="w-full">
          Sign in
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs text-muted">or</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <a href={googleSigninUrl}>
        <Button type="button" variant="secondary" className="w-full">
          <GoogleIcon />
          Continue with Google
        </Button>
      </a>

      <p className="mt-8 text-sm text-muted">
        Don't have an account?{" "}
        <Link to="/signup" className="font-medium text-ink underline underline-offset-2">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}

export function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4.2h6.5c-.1 1.1-.9 2.7-2.6 3.8l4 3.1c2.4-2.2 3.6-5.4 3.6-8.9z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1 7.9-2.8l-4-3.1c-1.1.7-2.4 1.2-3.9 1.2-3 0-5.6-2-6.5-4.8l-4.1 3.2C3.5 21.4 7.4 24 12 24z"
      />
      <path fill="#FBBC05" d="M5.5 14.5c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2l-4.1-3.2C.5 8.5 0 10.2 0 12s.5 3.5 1.4 5.1z" />
      <path
        fill="#EA4335"
        d="M12 4.8c1.7 0 3.3.6 4.4 1.7l3.4-3.4C17.9 1.1 15.2 0 12 0 7.4 0 3.5 2.6 1.4 6.9l4.1 3.2c.9-2.8 3.5-4.8 6.5-4.8z"
      />
    </svg>
  );
}
