import { SignInLayout } from "layouts/signIn";
import { LoginForm } from "components";
import { useGlobalContext } from "context/global";
import { saveAuthToken } from "fe/utlis";
import { message } from "antd";
import { login, verifyUser } from "fe";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { USER_ROLES } from "appConstants";

export default function Home() {
  const router = useRouter();
  const { toggleLoader } = useGlobalContext();

  const redirectBasedOnUser = () => {
    router.push("/allocation");
  };

  const handleLogin = (values, form) => {
    toggleLoader(true);
    login(values)
      .then(response => {
        saveAuthToken(response.data);
        message.success("Logged in successfully!");
        form.resetFields();
        redirectBasedOnUser();
      })
      .catch(error => {
        message.error(error);
      })
      .finally(() => {
        toggleLoader(false);
      });
  };

  useEffect(() => {
    verifyUser().then(user => {
      if (user.userRole.includes(USER_ROLES.Admin)) redirectBasedOnUser();
    });
  }, []);

  return (
    <>
      <h2 className="text-3xl font-semibold mb-2">Log In</h2>
      <div className="w-full">
        <LoginForm handleSubmit={handleLogin} />
      </div>
    </>
  );
}

Home.PageLayout = SignInLayout;
