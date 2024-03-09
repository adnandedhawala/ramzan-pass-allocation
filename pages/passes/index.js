/* eslint-disable sonarjs/cognitive-complexity */
import { SignInLayout } from "layouts/signIn";
import { useGlobalContext } from "context/global";
import { Button, Card, Divider, message } from "antd";
import { useState } from "react";
import { verifyFileAndGetMemberDataHelper } from "fe/helpers/passes";
import { HodVerificationForm } from "components";
import { useRouter } from "next/router";

export default function PassPage() {
  const { toggleLoader } = useGlobalContext();
  const router = useRouter();

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
        setFileMembers(responseData.data);
        form.resetFields();
        setStepStatus({ ...stepStatus, verify: "finish", view: "process" });
      },
      data: { ...values }
    });
  };

  return (
    <>
      <h2 className="text-3xl text-center font-semibold mb-2">
        Sherullah 1445
      </h2>

      {stepStatus.verify === "process" ? (
        <>
          <div className="w-full mt-4">
            <p className="text-red-500 text-center mb-4 text-lg">
              All GENTS Family Members should enter their own ITS Number to view
              Pass
            </p>
            <HodVerificationForm
              hof_label="ITS Number"
              handleSubmit={handleVerify}
            />
          </div>
        </>
      ) : null}
      {stepStatus.view === "process" ? (
        <div className="w-full mt-4">
          {fileMembers.map(value => {
            const { member_details, _id, show_pass, d1 } = value;
            return (
              <Card key={_id} className="mb-4 register-member-card">
                <div className="flex flex-col items-start">
                  <div className="flex flex-col items-center w-full">
                    <p className="mb-2 text-center text-lg flex-1">
                      {member_details.full_name}
                    </p>
                    <span>{member_details._id}</span>
                  </div>
                </div>

                {show_pass ? null : <Divider />}

                {member_details.gender === "Female" ? (
                  <p>
                    This Pass allocation page is for Mumineen Mardo Only. Kindly
                    Login with individual Gents ITS & File Number.
                  </p>
                ) : null}

                {member_details.misaq === "Done" ? null : (
                  <p>
                    You are not in the eligibe list or registered list of marol
                    mumineen.
                  </p>
                )}

                {member_details.gender === "Male" &&
                member_details.misaq === "Done" &&
                show_pass ? (
                  <div className="text-center mt-2">
                    <Button
                      onClick={() =>
                        router.push("/passes/pass/" + d1?.masallah)
                      }
                      size="middle"
                      type="primary"
                    >
                      View Pass
                    </Button>
                  </div>
                ) : null}
                {member_details.gender === "Male" &&
                member_details.misaq === "Done" &&
                !show_pass ? (
                  <p>Pass Allocation is in progress.</p>
                ) : null}
              </Card>
            );
          })}
          <div>
            <Button
              onClick={() =>
                setStepStatus({
                  ...stepStatus,
                  verify: "process",
                  view: "wait"
                })
              }
            >
              Go Back
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

PassPage.PageLayout = SignInLayout;
