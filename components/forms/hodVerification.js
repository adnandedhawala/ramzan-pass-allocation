import { Button, Form, Input } from "antd";

export const HodVerificationForm = ({
  handleSubmit,
  disabled,
  showText,
  hof_label = "HOF ITS"
}) => {
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
        label={<span>{hof_label}</span>}
        name="hof_id"
        rules={[
          {
            required: true,
            message: "Please enter its!"
          },
          {
            pattern: /^\d{8}$/,
            message: "invalid ITS!"
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
      {disabled || !showText ? null : (
        <div className="px-4">
          <p className="text-lg mb-2">Please note that :</p>
          <ul className="list-disc">
            <li className="mb-2">
              Registration is compulsory for All Gents and Ladies who wish to
              attend Maghrib Namaaz in either Saifee Masjid-Marol or Masjid Al
              Zahra (Al-Jamea TUS Saifiyah).
            </li>
            <li className="mb-2">
              Mumineen should select Rahat Block to obtain masalla in the Rahat
              block.
            </li>
            <li className="mb-2">
              Those who require chair are strictly required to register for the
              Rahat block.
            </li>
            <li className="mb-2">
              In case of any difficulty please contact us at
              <a href="mailto:aemsherullah@gmail.com">
                {" "}
                aemsherullah@gmail.com
              </a>
            </li>
          </ul>
        </div>
      )}
    </Form>
  );
};
