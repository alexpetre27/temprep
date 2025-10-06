import type React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/v0-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/v0-card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/v0-field";
import { Input } from "@/components/ui/v0-input";

interface LoginFormProps extends React.ComponentProps<"div"> {
  onClose?: () => void;
  onSignupRequest?: () => void;
}

export function LoginForm({
  className,
  onClose,
  onSignupRequest,
  ...props
}: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    toast.success("Login Successful!", {
      description: "Welcome back to your budget tracker.",
      duration: 2000,
    });

    if (onClose) {
      onClose();
    }
  };
  const handleSignupLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSignupRequest) {
      onSignupRequest();
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Log In</CardTitle>
          <CardDescription>
            Enter your email below to log in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email-login">Email</FieldLabel>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password-login">Password</FieldLabel>
                <Input id="password-login" type="password" required />
              </Field>

              <Field>
                <Button type="submit">Log In</Button>
                <FieldDescription className="text-center">
                  Don't have an account?{" "}
                  <a href="#" onClick={handleSignupLinkClick}>
                    Sign up
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
