import { ConfigProvider, Layout } from "antd";
import { FullPageLoader } from "components";
import { useGlobalContext } from "context/global";
import Head from "next/head";

const { Content } = Layout;

const themeToken = {
  colorPrimary: "#0d6696",
  colorInfo: "#0d6696",
  colorTextBase: "#444444",
  fontSize: 16,
  wireframe: true
};

export function SignInLayout({ children }) {
  const { showLoader } = useGlobalContext();
  return (
    <>
      <Head>
        <title>Ramazaan Pass Allocation</title>
        <meta name="description" content="Task Management Application" />
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
          <Content className="flex items-center justify-center p-8">
            {children}
          </Content>
        </Layout>
      </ConfigProvider>
    </>
  );
}
