import { Card, Divider } from "antd";
import { SignInLayout } from "layouts/signIn";
import { verifyUser } from "fe";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const redirectBasedOnUser = () => {
    router.push("/task/list");
  };

  useEffect(() => {
    verifyUser().then(user => {
      if (user.user_role) redirectBasedOnUser();
    });
  }, []);

  return (
    <Card className="w-full sm:w-10/12 md:w-8/12 lg:w-5/12">
      <h1 className="text-6xl text-center">LOGO</h1>
      <Divider className="text-gray-800" />
    </Card>
  );
}

Home.PageLayout = SignInLayout;
