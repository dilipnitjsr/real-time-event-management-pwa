"use client";

import * as z from "zod";
import { Suspense, useState, useTransition } from "react";
import { logout } from "@/actions/logout";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";
import { IoEye, IoSettings } from "react-icons/io5";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingsSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FormSuccess from "@/components/auth/formSuccess";
import FormError from "@/components/auth/formError";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { IoMdEyeOff } from "react-icons/io";

const SettingsPage = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      role:user?.role || undefined,
      isTwoFactorEnabled:user?.isTwoFactorEnabled || undefined
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((response) => {
          if (response.error) {
            setError(response.error);
          }
          if (response.success) {
            update();
            setSuccess(response.success);
          }
        })
        .catch(() => setError("Something went wrong!!"));
    });
  };

  const ToggleEyeInPassword = (e: any) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  return (
    <Card className=" w-[600px]">
      <CardHeader>
        <p className=" text-2xl gap-1 font-semibold flex justify-center items-center text-center">
          <IoSettings /> Settings
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
            <div className=" space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="example@gmail.com"
                        disabled={isPending}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage/>
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
                        {...field}
                        placeholder="******"
                        disabled={isPending}
                        type="password"
                      />
                      <button onClick={ToggleEyeInPassword}>
                            {showPassword ? <IoEye /> : <IoMdEyeOff />}
                          </button>
                        </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                    <div className="flex gap-1 justify-center items-center">
                      <Input
                        {...field}
                        placeholder="******"
                        disabled={isPending}
                        type="password"
                      />
                      <button onClick={ToggleEyeInPassword}>
                            {showPassword ? <IoEye /> : <IoMdEyeOff />}
                          </button>
                        </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              </>
            )}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>
                          Admin
                        </SelectItem>
                        <SelectItem value={UserRole.USER}>
                          User
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className=" flex flex-row items-center justify-between 
                   rounded-lg border p-3 shadow-md ">
                    <div className=" space-y-0.5">
                      <FormLabel>Two Factor Authentication</FormLabel>
                      <FormDescription>
                        Enable two factor authenticatio for 
                        your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              )}
            </div>
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button disabled={isPending} type="submit">
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;
