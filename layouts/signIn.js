import { Card, ConfigProvider, Layout } from "antd";
import { FullPageLoader } from "components";
import { useGlobalContext } from "context/global";
import Head from "next/head";
import Image from "next/image";

const { Content } = Layout;

const themeToken = {
  colorTextBase: "#444444",
  fontSize: 16,
  wireframe: true
};

export function SignInLayout({ children }) {
  const { showLoader } = useGlobalContext();
  return (
    <>
      <Head>
        <title>Sherullah 1444 AEM Marol</title>
        <meta name="description" content="Pass Allocation  Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfigProvider
        space={{ size: "small" }}
        componentSize="large"
        theme={{ token: themeToken }}
      >
        <Layout className="min-h-screen bg-[#1E293B]">
          {showLoader ? <FullPageLoader /> : null}
          <Content className="flex items-center justify-center p-0">
            <Card className="w-full sm:w-10/12 md:w-8/12 lg:w-5/12">
              <div className="flex flex-col items-center">
                <Image
                  src="/jamaatLogo.png"
                  alt="logo"
                  width={100}
                  height={100}
                />
                {children}
              </div>
            </Card>
          </Content>
        </Layout>
      </ConfigProvider>
    </>
  );
}
