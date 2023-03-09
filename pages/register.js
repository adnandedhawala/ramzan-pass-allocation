import { RegisterForm } from "components/forms/register";
import { SignInLayout } from "layouts/signIn";

export default function Register() {
  return (
    <>
      <h2 className="text-3xl font-semibold mb-2">
        Register For Pass Allocation
      </h2>
      <div className="w-full">
        <RegisterForm />
      </div>
    </>
  );
}

Register.PageLayout = SignInLayout;
