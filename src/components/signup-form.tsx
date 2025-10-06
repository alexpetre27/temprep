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

interface SignupFormProps extends React.ComponentProps<"div"> {
  onClose?: () => void;
  onLoginRequest?: () => void;
}

export function SignupForm({
  className,
  onClose,
  onLoginRequest,
  ...props
}: SignupFormProps) {
  const MIN_AGE = 16;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const dobValue = formData.get("dob") as string;
    if (dobValue) {
      const birthDate = new Date(dobValue);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < MIN_AGE) {
        toast.error("Înregistrare eșuată", {
          description: `Trebuie să ai minim ${MIN_AGE} ani pentru a-ți crea un cont.`,
          duration: 4000,
        });
        return;
      }
    } else {
      toast.error("Eroare de validare", {
        description: "Te rugăm să introduci Data Nașterii.",
        duration: 3000,
      });
      return;
    }

    console.log("Înregistrare reușită. Vârsta validată.");
    toast.success("Înregistrare reușită!", {
      description: "Contul tău a fost creat. Bine ai venit!",
      duration: 3000,
    });
    if (onClose) {
      onClose();
    }
  };

  const handleLoginLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLoginRequest) {
      onLoginRequest();
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Enter your details below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input id="lastName" type="text" placeholder="Doe" required />
                </Field>
              </div>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email-signup">Email</FieldLabel>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>

              {/* Data Nașterii */}
              <Field>
                <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
                <Input id="dob" name="dob" type="date" required />
              </Field>

              {/* Parolă */}
              <Field>
                <FieldLabel htmlFor="password-signup">Password</FieldLabel>
                <Input id="password-signup" type="password" required />
              </Field>

              <Field>
                <Button type="submit">Sign Up</Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <a href="#" onClick={handleLoginLinkClick}>
                    Log in
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
