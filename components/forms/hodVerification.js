import { Button, Form, Input } from "antd";

export const HodVerificationForm = ({ handleSubmit, disabled }) => {
  const [form] = Form.useForm();
  const onFinish = values => {
    handleSubmit(values, form);
  };
  return (
    <Form
      name="register"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      disabled={disabled}
    >
      <Form.Item
        className="mb-2"
        label={<span>HOF ITS</span>}
        name="hof_id"
        rules={[
          {
            required: true,
            message: "Please enter hof id!"
          },
          {
            pattern: /^\d{8}$/,
            message: "invalid hof ITS!"
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        className="mb-2"
        label={<span>File Number</span>}
        name="file_number"
        rules={[
          {
            required: true,
            message: "Please enter file number!"
          },
          {
            pattern: /^(?:[1-9]\d{3}|[1-9]\d{2}|[1-9]\d|[1-9])$/,
            message: "invalid file number! "
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
  );
};
