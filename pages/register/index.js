/* eslint-disable sonarjs/cognitive-complexity */
import { SignInLayout } from "layouts/signIn";
import { useGlobalContext } from "context/global";
import { HodVerificationForm, RegisterFileMemberForm } from "components";
import { Button, message, Result } from "antd";
import { useEffect, useMemo, useState } from "react";
import { registerMembersHelper, verifyFileDataHelper } from "fe";
import { SmileOutlined } from "@ant-design/icons";
import { find } from "lodash";
import { getSettingsHelper } from "fe/helpers/settings";
import moment from "moment";

export default function Register() {
  const { toggleLoader } = useGlobalContext();

  const [stepStatus, setStepStatus] = useState({
    verify: "process",
    select: "wait",
    done: "wait"
  });

  const [summaryData, setSummaryData] = useState([]);

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
    toggleLoader(true);
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
        setSummaryData(apiData);
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

  const summary = useMemo(() => {
    return summaryData.map(({ _id, registration, masjid, is_rahat }) => {
      let masjidName = "";
      if (masjid === "SAIFEE") masjidName = "Saifee Masjid (Marol)";
      if (masjid === "ZAHRA")
        masjidName = "Masjid Al Zahra (Al-Jamea TUS Saifiyah)";

      const memberData = fileMembers.find(element => element._id === _id);
      const hasRegistered = Object.keys(registration).some(
        value => registration[value]
      );
      const registrationString = Object.keys(registration)
        .map(key => {
          if (registration[key]) return "Daska " + key[1];
        })
        .join(", ");

      return (
        <div
          key={_id}
          className="text-[#333333] mb-2 mt-4 w-full text-left text-lg"
        >
          {hasRegistered ? null : (
            <p className="text-red-600">
              <span className="mr-1">{memberData?.full_name}</span>
              <span className="mr-1">({memberData?._id})</span>
              has not requested for a pass
            </p>
          )}
          {hasRegistered && memberData?.gender === "Male" ? (
            <p className="text-green-600">
              <span className="mr-1">{memberData?.full_name}</span>
              <span className="mr-1">({memberData?._id})</span>
              has registered for
              <span className="ml-1">{masjidName}</span>
              {is_rahat ? (
                <span className="ml-1">and has opted for RAHAT BLOCK</span>
              ) : null}
            </p>
          ) : null}
          {hasRegistered && memberData?.gender === "Female" ? (
            <p className="text-green-600">
              <span className="mr-1">{memberData?.full_name}</span>
              <span className="mr-1">({memberData?._id})</span>
              has registered for
              <span className="ml-1 mr-1">{registrationString}</span>
              at
              <span className="ml-1">{masjidName}</span>
              {is_rahat ? (
                <span className="ml-1">and has opted for RAHAT BLOCK</span>
              ) : null}
            </p>
          ) : null}
        </div>
      );
    });
  }, [summaryData]);

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
            subTitle={
              <>
                <p className="text-xl text-[#444444] my-8">
                  Please take a Screen Shot!!
                </p>
                {summary}
                <p>{moment().format("DD-MM-YYYY hh:mm:ss A")}</p>
              </>
            }
            extra={[
              <Button
                onClick={() => {
                  setStepStatus({
                    verify: "process",
                    select: "wait",
                    done: "wait"
                  });
                }}
                key="buy"
                type="primary"
              >
                Go Back to Login
              </Button>
            ]}
          />
        ) : null}
      </>
    );
  }

  return <Result icon={null} title="Initializing Registration ..." />;
}

Register.PageLayout = SignInLayout;
