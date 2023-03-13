/* eslint-disable sonarjs/cognitive-complexity */
import { Button, Card, Divider, Form, message, Radio } from "antd";

const handleFormFail = () => {
  message.error("Please check the form for errors");
};

const getInitValues = memberData => {
  let initObject = {};
  memberData.map(({ is_registered, registration, is_rahat, _id, gender }) => {
    if (is_registered) {
      if (gender === "Male") {
        initObject[_id + "_allDaska"] = registration.d1.toString();
      } else {
        initObject[_id + "_d1"] = registration.d1.toString();
        initObject[_id + "_d2"] = registration.d2.toString();
        initObject[_id + "_d3"] = registration.d3.toString();
      }
      initObject[_id + "_isRahat"] = is_rahat.toString();
    }
  });
  return initObject;
};

export const RegisterFileMemberForm = ({ handleSubmit, memberData }) => {
  const [form] = Form.useForm();
  const onFinish = values => {
    handleSubmit(values, form);
  };

  const selectError = "Select yes or no!";
  const selectDaskaError = "Please select yes for only 2 daska!";

  const handleRadioChange = its => {
    form.validateFields([its + "_d1", its + "_d2", its + "_d3"]);
  };

  return (
    <Form
      form={form}
      name="registerFileMemebers"
      onFinish={onFinish}
      onFinishFailed={handleFormFail}
      initialValues={getInitValues(memberData)}
    >
      {memberData.map(({ _id, full_name, gender }) => {
        return (
          <Card className="mb-4 register-member-card" key={_id}>
            <div className="flex flex-col items-start">
              <div className="flex flex-col items-center w-full">
                <p className="mb-1 text-lg text-center">{full_name}</p>
                <div className="flex justify-between font-light">
                  <span>{_id}</span>
                </div>
              </div>
              <Divider className="my-4" />
              {gender === "Male" ? (
                <div className="mb-2">
                  <p className="mb-2">
                    Register for Daska 1, Daska 2 and Daska 3
                  </p>
                  <Form.Item
                    rules={[{ required: true, message: selectError }]}
                    name={_id + "_allDaska"}
                    className="mb-0"
                  >
                    <Radio.Group
                      optionType="button"
                      buttonStyle="solid"
                      size="small text-sm"
                    >
                      <Radio value="true">Yes</Radio>
                      <Radio value="false">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              ) : null}
              {gender === "Female" ? (
                <>
                  <div className="mb-2">
                    <p className="mb-2">Register for Daska 1</p>
                    <Form.Item
                      name={_id + "_d1"}
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
                  </div>
                  <div className="mb-2">
                    <p className="mb-2">Register for Daska 2</p>
                    <Form.Item
                      name={_id + "_d2"}
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
                  </div>
                  <div className="mb-2">
                    <p className="mb-2">Register for Daska 3</p>
                    <Form.Item
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
                      name={_id + "_d3"}
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
                  </div>
                </>
              ) : null}
              <div className="mb-2 mt-4">
                <p className="mb-2 text-gray-700">Request Rahat Block</p>
                <Form.Item className="mb-0" name={_id + "_isRahat"}>
                  <Radio.Group
                    optionType="button"
                    buttonStyle="solid"
                    size="small text-sm"
                  >
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>
          </Card>
        );
      })}

      <Form.Item className="text-center">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
