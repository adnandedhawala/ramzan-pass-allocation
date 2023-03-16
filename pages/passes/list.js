import { PAGE_LIST, USER_ROLES } from "appConstants";
import { RegisteredGrid } from "components";

import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import { getRamzanMembersHelper } from "fe";

import { Mainlayout } from "layouts/main";
import { useEffect, useState } from "react";

export default function RegistrationList() {
  const { setPageTitle, resetPage } = useMainLayoutContext();
  const { changeSelectedSidebarKey } = useGlobalContext();

  const [registeredList, setRegisteredList] = useState([]);

  useEffect(() => {
    changeSelectedSidebarKey(PAGE_LIST.REGISTRATION_LIST);
    setPageTitle("Registration List Page");
    getRamzanMembersHelper({
      showRegistered: true,
      successFn: data => {
        setRegisteredList(
          data.data
            .map(value => ({
              ...value.hof_id,
              ...value.member_details,
              is_rahat: value.is_rahat ? "yes" : "no",
              d1: value.registration.d1 ? "yes" : "no",
              d2: value.registration.d2 ? "yes" : "no",
              d3: value.registration.d3 ? "yes" : "no",
              hof_id: value.hof_id._id
            }))
            .sort(
              (a, b) => Number(a.tanzeem_file_no) - Number(b.tanzeem_file_no)
            )
        );
      },
      errorFn: () => {},
      endFn: () => {}
    });
    return () => {
      resetPage();
    };
  }, []);

  return (
    <>
      <RegisteredGrid data={registeredList} />
    </>
  );
}

RegistrationList.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: [USER_ROLES.Admin] } // will be passed to the page component as props
  };
}
