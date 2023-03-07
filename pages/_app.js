import { GlobalProvider } from "context/global";
import { MainLayoutProvider } from "context/mainLayout";
import { MasallahProvider } from "context/masallah";
import "styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalProvider>
        <MainLayoutProvider>
          <MasallahProvider>
            {Component.PageLayout ? (
              <Component.PageLayout {...pageProps}>
                <Component {...pageProps} />
              </Component.PageLayout>
            ) : (
              <Component {...pageProps} />
            )}
          </MasallahProvider>
        </MainLayoutProvider>
      </GlobalProvider>
    </>
  );
}
