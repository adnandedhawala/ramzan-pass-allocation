/* eslint-disable sonarjs/cognitive-complexity */
import { SignInLayout } from "layouts/signIn";
import { useGlobalContext } from "context/global";
import { message } from "antd";
import { useState } from "react";
import { verifyFileAndGetMemberDataHelper } from "fe/helpers/passes";
import { HodVerificationForm, PassCards } from "components";

export default function PassPage() {
  const { toggleLoader } = useGlobalContext();

  const [stepStatus, setStepStatus] = useState({
    verify: "process",
    view: "wait"
  });
  const [fileMembers, setFileMembers] = useState([]);

  const handleVerify = (values, form) => {
    toggleLoader(true);
    verifyFileAndGetMemberDataHelper({
      endFn: () => {
        toggleLoader(false);
      },
      errorFn: error => {
        message.error(error);
      },
      successFn: responseData => {
        setFileMembers(
          responseData.data
            .filter(value => value.member_details.misaq === "Done")
            .filter(value => value.member_details.gender === "Male")
        );
        form.resetFields();
        setStepStatus({ ...stepStatus, verify: "finish", view: "process" });
      },
      data: { ...values }
    });
  };

  return (
    <>
      <h2 className="text-3xl text-center font-semibold mb-2">
        Sherullah 1444
      </h2>

      {stepStatus.verify === "process" ? (
        <>
          <div className="w-full mt-4">
            <p className="text-red-500 text-center text-sm">
              Enter HOF ITS and File Number to view Pass
            </p>
            <HodVerificationForm handleSubmit={handleVerify} />
          </div>
        </>
      ) : null}
      {stepStatus.view === "process" ? (
        <div className="w-full mt-4">
          <PassCards memberData={fileMembers} />
        </div>
      ) : null}
    </>
  );
}

PassPage.PageLayout = SignInLayout;
