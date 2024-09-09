"use client";
import CardWrapper from "./cardWrapper";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { LoginSchema } from "@/schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FormError from "./formError";
import FormSuccess from "./formSuccess";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
interface LoginResponse {
  error?: string;
  success?: string;
}

const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with diffrent provider!!"
      : "";

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(data)
        .then((res) => {
          if (res?.error) {
            form.reset();
            setError(res.error);
          }
          if (res?.success) {
            form.reset();
            setSuccess(res.success);
          }
          if (res?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => {
          setError("Something went wrong!!");
        });
    });
  };

  const ToggleEyeInPassword = (e: any) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };
  return (
    <CardWrapper
      headerLabel="Login page"
      backButtonLabel="Don't have an account"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form className=" space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            {showTwoFactor && (
              <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      
                      {...field}
                      placeholder="123456"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          type="email"
                          {...field}
                          placeholder="example.ex@gmail.com"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex gap-1 justify-center items-center">
                          <Input
                            disabled={isPending}
                            type={showPassword ? "text" : "password"}
                            {...field}
                            placeholder="********"
                          />
                          <button onClick={ToggleEyeInPassword}>
                            {showPassword ? <IoEye /> : <IoMdEyeOff />}
                          </button>
                        </div>
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset">Forgot Password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={urlError || error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            { showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
