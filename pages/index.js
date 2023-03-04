import { SignInLayout } from "layouts/signIn";
import { LoginForm } from "components";
import { useGlobalContext } from "context/global";
import { saveAuthToken } from "fe/utlis";
import { message } from "antd";
import { login } from "fe";

export default function Home() {
  const { toggleLoader } = useGlobalContext();

  const handleLogin = (values, form) => {
    toggleLoader(true);
    login(values)
      .then(response => {
        saveAuthToken(response.data);
        message.success("Logged in successfully!");
        form.resetFields();
      })
      .catch(error => {
        message.error(error);
      })
      .finally(() => {
        toggleLoader(false);
      });
  };
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
