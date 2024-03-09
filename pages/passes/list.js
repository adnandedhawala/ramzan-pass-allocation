import { Button, message } from "antd";
import { PAGE_LIST, USER_ROLES } from "appConstants";
import { AllocatedGrid } from "components";

import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import {
  editAllocatedRamzanMembersHelper,
  getAllocatedRamzanMembersHelper
} from "fe";

import { Mainlayout } from "layouts/main";
import { useEffect, useState } from "react";

export default function RegistrationList() {
  const { setPageTitle, resetPage } = useMainLayoutContext();
  const { changeSelectedSidebarKey, toggleLoader } = useGlobalContext();

  const [registeredList, setRegisteredList] = useState([]);

  const handleAllocatedDataUpdate = () => {
    toggleLoader(true);
    editAllocatedRamzanMembersHelper({
      data: registeredList.map(value => ({
        _id: value._id,
        show_pass: value.show_pass === "yes"
      })),
      successFn: () => {
        message.success("Member Data updated successfully!");
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      }
    });
  };

  useEffect(() => {
    changeSelectedSidebarKey(PAGE_LIST.ALLOCATION_LIST);
    setPageTitle("Allocation List Page");
    getAllocatedRamzanMembersHelper({
      showRegistered: true,
      successFn: data => {
        setRegisteredList(
          data.data
            .map(value => ({
              ...value.hof_id,
              ...value.member_details,
              is_rahat: value.is_rahat ? "yes" : "no",
              show_pass: value.show_pass ? "yes" : "no",
              has_seen_pass: value.has_seen_pass ? "yes" : "no",
              has_seen_pass_date: value.has_seen_pass_date,
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
      <div className="flex justify-end mb-4">
        <Button onClick={handleAllocatedDataUpdate} type="primary">
          Update Show Pass Status
        </Button>
      </div>
      <AllocatedGrid data={registeredList} setData={setRegisteredList} />
    </>
  );
}

RegistrationList.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: [USER_ROLES.Admin] } // will be passed to the page component as props
  };
}
