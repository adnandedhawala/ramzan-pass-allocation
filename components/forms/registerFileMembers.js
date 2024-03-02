/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable sonarjs/cognitive-complexity */
import { Button, Card, Divider, Form, message, Radio } from "antd";
import { useEffect, useMemo, useState } from "react";

const handleFormFail = () => {
  message.error("Please check the form for errors");
};

const getInitValues = (
  memberData,
  isZahraRegistrationOnMale,
  isZahraRegistrationOnFemale
) => {
  let initObject = {};
  memberData.map(
    ({ is_registered, registration, is_rahat, _id, gender, masjid }) => {
      let currentMasjid = "";
      if (isZahraRegistrationOnMale && gender === "Male") {
        currentMasjid = masjid || "";
      } else if (!isZahraRegistrationOnMale && gender === "Male") {
        currentMasjid = !masjid || masjid === "" ? "SAIFEE" : masjid;
      } else if (isZahraRegistrationOnFemale && gender === "Female") {
        currentMasjid = masjid || "";
      } else if (!isZahraRegistrationOnFemale && gender === "Female") {
        currentMasjid = !masjid || masjid === "" ? "SAIFEE" : masjid;
      }
      if (is_registered) {
        if (gender === "Male") {
          initObject[_id + "_register"] = registration.d1.toString();
        } else {
          initObject[_id + "_register"] =
            registration.d1 || registration.d2 || registration.d3
              ? "true"
              : "false";
          initObject[_id + "_d1"] = registration.d1.toString();
          initObject[_id + "_d2"] = registration.d2.toString();
          initObject[_id + "_d3"] = registration.d3.toString();
        }
        initObject[_id + "_isRahat"] = is_rahat.toString();
      }
      initObject[_id + "_masjid"] = currentMasjid;
    }
  );
  return initObject;
};

export const RegisterFileMemberForm = ({
  handleSubmit,
  memberData,
  isZahraRegistrationOnMale,
  isZahraRegistrationOnFemale
}) => {
  const [form] = Form.useForm();
  const [showRegistrationForm, setShowRegistrationForm] = useState(
    memberData.reduce((object, item) => {
      object[item._id + "_register"] = false;
      object[item._id + "_masjid"] = "";
      return object;
    }, {})
  );
  const onFinish = values => {
    handleSubmit(values, form);
  };

  const selectError = "Select yes or no!";
  const selectDaskaError = "Please select yes for only 2 daska!";

  const initialValues = useMemo(
    () =>
      getInitValues(
        memberData,
        isZahraRegistrationOnMale,
        isZahraRegistrationOnFemale
      ),
    [isZahraRegistrationOnMale, isZahraRegistrationOnFemale, memberData]
  );

  const handleRadioChange = its => {
    form.validateFields([its + "_d1", its + "_d2", its + "_d3"]);
  };

  const handleAllDaskaRadioChange = (value, its) => {
    setShowRegistrationForm(previous => ({
      ...previous,
      [its + "_register"]: value === "true"
    }));
  };

  const handleSelectMasjid = (value, its) => {
    setShowRegistrationForm(previous => ({
      ...previous,
      [its + "_masjid"]: value
    }));
  };

  useEffect(() => {
    Object.keys(showRegistrationForm).forEach(value => {
      let temporaryObject = {};
      if (value.includes("_masjid")) {
        temporaryObject[value] = initialValues[value];
      }
      if (value.includes("_register")) {
        temporaryObject[value] = initialValues[value] === "true";
      }
      setShowRegistrationForm(previous => ({
        ...previous,
        ...temporaryObject
      }));
    });
  }, [initialValues]);

  const getZahraExtraText = gender => {
    if (gender === "Male") {
      return isZahraRegistrationOnMale
        ? ""
        : "Registration for Masjid ul Zahra for Mardo is closed.";
    } else {
      return isZahraRegistrationOnFemale
        ? ""
        : "Registration for Masjid ul Zahra for Bairao is closed.";
    }
  };

  const getZahraDisabled = gender => {
    return gender === "Male"
      ? !isZahraRegistrationOnMale
      : !isZahraRegistrationOnFemale;
  };

  return (
    <Form
      form={form}
      name="registerFileMemebers"
      onFinish={onFinish}
      onFinishFailed={handleFormFail}
      initialValues={initialValues}
      requiredMark={false}
      layout="horizontal"
    >
      {memberData.map(({ _id, full_name, gender }) => {
        return (
          <Card className="mb-4 register-member-card" key={_id}>
            <div className="flex flex-col items-start">
              <p className="mb-1 text-lg flex-1">{full_name}</p>
              <p className="flex justify-between text-sm mr-4">{_id}</p>
              <Divider className="mt-4 mb-4" />
              <Form.Item
                rules={[{ required: true, message: selectError }]}
                name={_id + "_register"}
                className="mb-0"
                label="Register for Pass"
              >
                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  size="small"
                  onChange={event =>
                    handleAllDaskaRadioChange(event.target.value, _id)
                  }
                >
                  <Radio value="true">Yes</Radio>
                  <Radio value="false">No</Radio>
                </Radio.Group>
              </Form.Item>
              {showRegistrationForm[_id + "_register"] ? (
                <Form.Item
                  rules={[{ required: true, message: "Please select masjid!" }]}
                  name={_id + "_masjid"}
                  className="mb-0"
                  label="Select Masjid"
                  extra={getZahraExtraText(gender)}
                >
                  <Radio.Group
                    size="small"
                    onChange={event =>
                      handleSelectMasjid(event.target.value, _id)
                    }
                    disabled={getZahraDisabled(gender)}
                  >
                    <Radio value="SAIFEE">Saifee Masjid</Radio>
                    <Radio value="ZAHRA">Masjid ul Zahra</Radio>
                  </Radio.Group>
                </Form.Item>
              ) : null}
              {showRegistrationForm[_id + "_register"] &&
              showRegistrationForm[_id + "_masjid"] === "SAIFEE" ? (
                <>
                  {gender === "Female" ? (
                    <>
                      <Form.Item
                        name={_id + "_d1"}
                        label="Select Daska 1"
                        rules={[
                          {
                            required: true,
                            message: selectError
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const d2 = getFieldValue(_id + "_d2");
                              const d3 = getFieldValue(_id + "_d3");
                              if (
                                value === "true" &&
                                d2 === "true" &&
                                d3 === "true"
                              ) {
                                return Promise.reject(selectDaskaError);
                              }
                              return Promise.resolve();
                            }
                          })
                        ]}
                        className="mb-0"
                      >
                        <Radio.Group
                          optionType="button"
                          buttonStyle="solid"
                          size="small text-sm"
                          onChange={() => handleRadioChange(_id)}
                        >
                          <Radio value="true">Yes</Radio>
                          <Radio value="false">No</Radio>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        name={_id + "_d2"}
                        label="Select Daska 2"
                        rules={[
                          {
                            required: true,
                            message: selectError
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const d1 = getFieldValue(_id + "_d1");
                              const d3 = getFieldValue(_id + "_d3");
                              if (
                                value === "true" &&
                                d1 === "true" &&
                                d3 === "true"
                              ) {
                                return Promise.reject(selectDaskaError);
                              }
                              return Promise.resolve();
                            }
                          })
                        ]}
                        className="mb-0"
                      >
                        <Radio.Group
                          optionType="button"
                          buttonStyle="solid"
                          size="small text-sm"
                          onChange={() => handleRadioChange(_id)}
                        >
                          <Radio value="true">Yes</Radio>
                          <Radio value="false">No</Radio>
                        </Radio.Group>
                      </Form.Item>

                      <Form.Item
                        name={_id + "_d3"}
                        label="Select Daska 3"
                        rules={[
                          {
                            required: true,
                            message: selectError
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const d1 = getFieldValue(_id + "_d1");
                              const d2 = getFieldValue(_id + "_d2");
                              if (
                                value === "true" &&
                                d1 === "true" &&
                                d2 === "true"
                              ) {
                                return Promise.reject(selectDaskaError);
                              }
                              return Promise.resolve();
                            }
                          })
                        ]}
                        className="mb-0"
                      >
                        <Radio.Group
                          optionType="button"
                          buttonStyle="solid"
                          size="small text-sm"
                          onChange={() => handleRadioChange(_id)}
                        >
                          <Radio value="true">Yes</Radio>
                          <Radio value="false">No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </>
                  ) : null}
                  <div className="mb-2 flex-col w-full">
                    <Form.Item
                      className="mb-0"
                      name={_id + "_isRahat"}
                      label="Rahat Block"
                    >
                      <Radio.Group
                        optionType="button"
                        buttonStyle="solid"
                        size="small"
                      >
                        <Radio value="true">Yes</Radio>
                        <Radio value="false">No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                </>
              ) : null}
            </div>
          </Card>
        );
      })}

      <Form.Item className="text-center">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
      <div>
        <p className="text-lg mb-2">Please note that :</p>
        <ul className="list-disc">
          <li className="mb-2">
            The name of each Male family member will be displayed under which
            you can Register for Pass by selecting Yes
          </li>
          <li className="mb-2">
            If you wish to get allocation in Rahat block, select Yes for Rahat
            block for that member only.
          </li>
          <li className="mb-2">
            Once all the Gents members selection is done, you click the Submit
            button.
          </li>
          <li className="mb-2">
            If after you have registered, you wish to change any of your
            choices, you can do so by following the same steps as above.
          </li>
          <li className="mb-2">
            In case of any difficulty please contact us at
            <a href="mailto:aemsherullah@gmail.com"> aemsherullah@gmail.com</a>
          </li>
        </ul>
      </div>
    </Form>
  );
};
