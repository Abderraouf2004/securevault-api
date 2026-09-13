import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthLayout } from "./AuthLayout";
import { Button, Field, Input } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/lib/api-client";
import {GoogleIcon} from "./LoginPage"
interface FormValues {
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const { signup, googleSigninUrl } = useAuth();
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
      await signup(values);
      navigate("/app/documents");
    } catch (err) {
      setServerError(getApiErrorMessage(err, "Couldn't create your account."));
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Full name" htmlFor="name" error={errors.name?.message}>
          <Input
            id="name"
            placeholder="Jane Doe"
            {...register("name", { required: "Enter your name", minLength: { value: 3, message: "At least 3 characters" } })}
          />
        </Field>
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
            placeholder="At least 8 characters"
            {...register("password", { required: "Choose a password", minLength: { value: 8, message: "At least 8 characters" } })}
          />
        </Field>

        {serverError && <p className="text-sm text-danger">{serverError}</p>}

        <Button type="submit" loading={isSubmitting} className="w-full">
          Create account
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
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-ink underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
