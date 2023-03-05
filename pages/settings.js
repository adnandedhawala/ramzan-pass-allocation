import { USER_ROLES } from "appConstants";
import { useMainLayoutContext } from "context/mainLayout";
import { Mainlayout } from "layouts/main";
import { useEffect } from "react";

export default function Settings() {
  const { setShowBack, resetPage } = useMainLayoutContext();
  useEffect(() => {
    setShowBack(true);
    return () => {
      resetPage();
    };
  }, []);

  return (
    <>
      <h1>Settings Page</h1>
    </>
  );
}

Settings.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: [USER_ROLES.Admin] } // will be passed to the page component as props
  };
}
