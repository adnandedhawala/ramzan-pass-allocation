import { useState } from "react";
import { Form, Input, Button, Checkbox, Steps } from "antd";
import { verify } from "fe/services/register";

const { Step } = Steps;

const StepOne = ({ onFinish }) => {
  const [form] = Form.useForm();

  const handleVerify = async values => {
    verify(values);
    onFinish();
  };

  return (
    <>
      <Form
        name="login"
        layout="vertical"
        onFinish={handleVerify}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label={<span>HOF ID</span>}
          name="hofId"
          rules={[
            {
              required: true,
              message: "Please enter HOF ID!"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<span>File Number</span>}
          name="fileNumber"
          rules={[
            {
              required: true,
              message: "Please enter File Number!"
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item className="text-center">
          <Button
            className="mt-8 w-full uppercase"
            type="primary"
            htmlType="submit"
          >
            Verify
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

const StepTwo = ({ onFinish }) => {
  const [form] = Form.useForm();

  const handleFinish = values => {
    onFinish(values);
  };

  return (
    <Form form={form} onFinish={handleFinish}>
      <Form.Item name="checkbox" valuePropName="checked">
        <Checkbox></Checkbox>
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
};

export const RegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleStepChange = step => {
    setCurrentStep(step);
  };

  const handleStepOneFinish = () => {
    setCurrentStep(1);
  };

  const handleStepTwoFinish = values => {
    setFormData(values);
    setCurrentStep(2);
  };

  return (
    <div>
      {currentStep === 0 && <StepOne onFinish={handleStepOneFinish} />}
      {currentStep === 1 && <StepTwo onFinish={handleStepTwoFinish} />}
      {currentStep === 2 && (
        <div>
          <h2>Thank you for submitting the form!</h2>
          <p>Here is the data you submitted:</p>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
      <Steps current={currentStep} size={"small"} onChange={handleStepChange}>
        <Step title="Verify Details" disabled />
        <Step title="Allocation" disabled />
        <Step title="Success" disabled />
      </Steps>
    </div>
  );
};
