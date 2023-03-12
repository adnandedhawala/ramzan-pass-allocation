import { SignInLayout } from "layouts/signIn";
import { useGlobalContext } from "context/global";
import { HodVerificationForm, RegisterFileMemberForm } from "components";
import { message, Result } from "antd";
import { useState } from "react";
import { registerMembersHelper, verifyFileDataHelper } from "fe";
import { SmileOutlined } from "@ant-design/icons";
import { find } from "lodash";

export default function Home() {
  const { toggleLoader } = useGlobalContext();

  const [stepStatus, setStepStatus] = useState({
    verify: "process",
    select: "wait",
    done: "wait"
  });

  const [fileMembers, setFileMembers] = useState([]);

  const handleVerify = (values, form) => {
    toggleLoader(true);
    verifyFileDataHelper({
      endFn: () => {
        toggleLoader(false);
      },
      errorFn: error => {
        message.error(error);
      },
      successFn: responseData => {
        setFileMembers(
          responseData.data
            .filter(value => value.misaq === "Done")
            .map(value => {
              let registrationInfo = find(responseData.registrationData, {
                _id: value._id
              });
              return {
                ...value,
                is_registered: registrationInfo.is_registered,
                is_rahat: registrationInfo.is_rahat,
                registration: registrationInfo.registration
              };
            })
        );
        form.resetFields();
        setStepStatus({ ...stepStatus, verify: "finish", select: "process" });
      },
      data: { ...values }
    });
  };

  const handleMemberRegistration = (values, form) => {
    toggleLoader(true);
    const apiData = fileMembers.map(({ _id, gender }) => {
      const memberDetails = {
        _id,
        registration: {},
        is_rahat: values[_id + "_isRahat"] === "true"
      };
      if (gender === "Male") {
        const registrationValue = values[_id + "_allDaska"] === "true";
        memberDetails.registration.d1 = registrationValue;
        memberDetails.registration.d2 = registrationValue;
        memberDetails.registration.d3 = registrationValue;
      } else {
        memberDetails.registration.d1 = values[_id + "_d1"] === "true";
        memberDetails.registration.d2 = values[_id + "_d2"] === "true";
        memberDetails.registration.d3 = values[_id + "_d3"] === "true";
      }
      return memberDetails;
    });
    registerMembersHelper({
      data: apiData,
      successFn: () => {
        message.success("Members are registerd successfully !");
        form.resetFields();
        setStepStatus({ ...stepStatus, select: "finish", done: "finish" });
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      }
    });
  };

  return (
    <>
      <h2 className="text-3xl font-semibold mb-2">
        Registration Form for Ramzaan
      </h2>
      {stepStatus.verify === "process" ? (
        <div className="w-full mt-4">
          <h2 className="text-medium text-center">Verification</h2>
          <HodVerificationForm handleSubmit={handleVerify} />
        </div>
      ) : null}
      {stepStatus.select === "process" ? (
        <div className="w-full mt-4">
          <h2 className="text-medium text-center mb-4">Select Daska</h2>
          <RegisterFileMemberForm
            memberData={fileMembers}
            handleSubmit={handleMemberRegistration}
          />
        </div>
      ) : null}

      {stepStatus.done === "finish" ? (
        <Result
          icon={<SmileOutlined />}
          title="Members are successfully registered!"
          status="success"
          // extra={<Button type="primary">Next</Button>}
        />
      ) : null}
    </>
  );
}

Home.PageLayout = SignInLayout;
