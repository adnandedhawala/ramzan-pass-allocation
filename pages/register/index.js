/* eslint-disable sonarjs/cognitive-complexity */
import { SignInLayout } from "layouts/signIn";
import { useGlobalContext } from "context/global";
import { HodVerificationForm, RegisterFileMemberForm } from "components";
import { message, Result } from "antd";
import { useEffect, useState } from "react";
import { registerMembersHelper, verifyFileDataHelper } from "fe";
import { SmileOutlined } from "@ant-design/icons";
import { find } from "lodash";
import { getSettingsHelper } from "fe/helpers/settings";

export default function Register() {
  const { toggleLoader } = useGlobalContext();

  const [stepStatus, setStepStatus] = useState({
    verify: "process",
    select: "wait",
    done: "wait"
  });
  const [isRegistrationOn, setIsRegistrationOn] = useState(false);
  const [isZahraRegistrationOnMale, setIsZahraRegistrationOnMale] =
    useState(false);
  const [isZahraRegistrationOnFemale, setIsZahraRegistrationOnFemale] =
    useState(false);
  const [fileMembers, setFileMembers] = useState([]);
  const [showPage, setShowPage] = useState(false);

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
                registration: registrationInfo.registration,
                masjid: registrationInfo.masjid
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
    // toggleLoader(true);
    const apiData = fileMembers.map(({ _id, gender }) => {
      const memberDetails = {
        _id,
        registration: {},
        is_rahat: values[_id + "_isRahat"] === "true",
        masjid: values[_id + "_masjid"] || ""
      };
      if (gender === "Male") {
        const registrationValue = values[_id + "_register"] === "true";
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

  const getSettingsForPage = () => {
    setShowPage(false);
    getSettingsHelper({
      successFn: data => {
        setIsRegistrationOn(data.data[0].is_registration_on);
        setIsZahraRegistrationOnMale(
          data.data[0].is_zahra_registration_on_male
        );
        setIsZahraRegistrationOnFemale(
          data.data[0].is_zahra_registration_on_female
        );
      },
      errorFn: () => {},
      endFn: () => {
        setShowPage(true);
      }
    });
  };

  useEffect(() => {
    getSettingsForPage();
  }, []);

  if (showPage) {
    return (
      <>
        <h2 className="text-xl text-center font-semibold mb-2">
          Registration Form : Sherullah 1445
        </h2>
        {stepStatus.verify === "process" ? (
          <div className="w-full mt-4">
            <h2
              className={
                isRegistrationOn
                  ? "text-medium text-center"
                  : "text-center text-red-500"
              }
            >
              {isRegistrationOn ? "" : "Registration is closed"}
            </h2>
            {isRegistrationOn ? (
              <>
                <p className="mb-2 font-semibold text-center">
                  Kindly read the below given instructions carefully before
                  proceeding.
                </p>
                <p className="text-red-500 text-center text-sm">
                  Registration will close on Wednesday, 26th Shaban-ul-Karim
                  1445H (6th March 2024) 9pm.
                </p>
              </>
            ) : null}
            <HodVerificationForm
              disabled={!isRegistrationOn}
              handleSubmit={handleVerify}
              showText={true}
            />
          </div>
        ) : null}
        {stepStatus.select === "process" ? (
          <div className="w-full mt-4">
            <RegisterFileMemberForm
              memberData={fileMembers}
              handleSubmit={handleMemberRegistration}
              disabled={!isRegistrationOn}
              isZahraRegistrationOnMale={isZahraRegistrationOnMale}
              isZahraRegistrationOnFemale={isZahraRegistrationOnFemale}
            />
          </div>
        ) : null}

        {stepStatus.done === "finish" ? (
          <Result
            icon={<SmileOutlined />}
            title="Members are successfully registered!"
            status="success"
          />
        ) : null}
      </>
    );
  }

  return <Result icon={null} title="Initializing Registration ..." />;
}

Register.PageLayout = SignInLayout;
