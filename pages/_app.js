import "styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
      {Component.PageLayout ? (
        <Component.PageLayout {...pageProps}>
          <Component {...pageProps} />
        </Component.PageLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
