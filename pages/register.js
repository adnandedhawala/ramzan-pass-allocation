import { SignInLayout } from "layouts/signIn";
import { useGlobalContext } from "context/global";
import { HodVerificationForm } from "components";
import { SelectOutlined, SmileOutlined, UserOutlined } from "@ant-design/icons";
import { message, Steps } from "antd";
import { useState } from "react";
import { verifyFileDataHelper } from "fe";

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
        setFileMembers(responseData.data);
        message.success(fileMembers.count);
        form.resetFields();
        setStepStatus({ ...stepStatus, verify: "finish", select: "process" });
      },
      data: { ...values }
    });
  };

  return (
    <>
      <h2 className="text-3xl font-semibold mb-2">
        Registration Form for Ramzaan
      </h2>
      <div className="w-3/4 mt-2">
        <Steps
          items={[
            {
              title: "Verify",
              status: stepStatus.verify,
              icon: <UserOutlined />
            },
            {
              title: "Select",
              status: stepStatus.select,
              icon: <SelectOutlined />
            },
            {
              title: "Done",
              status: stepStatus.done,
              icon: <SmileOutlined />
            }
          ]}
        />
        {stepStatus.verify === "process" ? (
          <div className="w-full mt-4">
            <h2 className="text-medium text-center">Verification</h2>
            <HodVerificationForm handleSubmit={handleVerify} />
          </div>
        ) : null}
        {stepStatus.select === "process" ? (
          <div className="w-full mt-4">
            <h2 className="text-medium text-center">Select Daska</h2>
            {/* <HodVerificationForm handleSubmit={handleVerify} /> */}
          </div>
        ) : null}
      </div>
    </>
  );
}

Home.PageLayout = SignInLayout;
