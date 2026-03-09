import { Bike } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <Bike className="h-8 w-8 text-primary" />
        <span className="text-2xl font-bold">BiSRide</span>
      </div>
      <RegisterForm />
    </div>
  );
}
