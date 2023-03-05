import { GlobalProvider } from "context/global";
import { MainLayoutProvider } from "context/mainLayout";
import "styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalProvider>
        <MainLayoutProvider>
          {Component.PageLayout ? (
            <Component.PageLayout {...pageProps}>
              <Component {...pageProps} />
            </Component.PageLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </MainLayoutProvider>
      </GlobalProvider>
    </>
  );
}
