import { Button, Form, Input } from "antd";

export const LoginForm = ({ handleSubmit }) => {
  const [form] = Form.useForm();
  const onFinish = values => {
    handleSubmit(values, form);
  };
  return (
    <Form
      name="login"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      <Form.Item
        label={<span>Email</span>}
        name="email"
        rules={[
          {
            required: true,
            message: "Please enter email!"
          },
          {
            type: "email",
            message: "Please enter a valid email"
          }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={<span>Password</span>}
        name="password"
        rules={[
          {
            required: true,
            message: "Please enter password!"
          }
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item className="text-center">
        <Button
          className="mt-8 w-full uppercase"
          type="primary"
          htmlType="submit"
        >
          Sign In
        </Button>
      </Form.Item>
    </Form>
  );
};
