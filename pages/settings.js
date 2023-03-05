import { Button, message } from "antd";
import { USER_ROLES } from "appConstants";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import { createRamzanMembersHelper } from "fe";
import { Mainlayout } from "layouts/main";
import { useEffect } from "react";

export default function Settings() {
  const { setPageTitle, resetPage } = useMainLayoutContext();
  const { toggleLoader } = useGlobalContext();

  const handleSetRamzanMembers = () => {
    toggleLoader(true);
    createRamzanMembersHelper({
      successFn: () => {
        message.success("Member list updated successfully");
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      }
    });
  };

  useEffect(() => {
    setPageTitle("Settings Page");
    return () => {
      resetPage();
    };
  }, []);

  return (
    <>
      <Button onClick={handleSetRamzanMembers} type="primary">
        Set Ramzan Members
      </Button>
    </>
  );
}

Settings.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: [USER_ROLES.Admin] } // will be passed to the page component as props
  };
}
