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
              Sagla Mumeneen / Mumenaat ne Magrib Namaaz waste register karvu
              zaroori che.
            </li>
            <li className="mb-2">
              Saifee Masjid-Marol ane Masjid Al Zahra-Jamea ma register thanar
              mumineen nej pass allot thase.
            </li>
            <li className="mb-2">
              Je sagla chair par namaaz padhta hoi yeh, Rahat Block ma register
              thai.
            </li>
            <li className="mb-2">
              ⁠Mumeneen / Mumenaat jehne Masjid Al Zahra ni pass allocate
              thaase, ehne Saifee Masjid Marol ni pass allocate nahi thai.
            </li>
            <li className="mb-2">
              Kam allocation hova na sabab agar Masjid Al Zahra-Jamea nu
              allotment full thai jaase toh aapne Saifee Masjid ma pass allot
              thase.
            </li>
            <li className="mb-2">
              ⁠Sagla Mumineen Mardo, Bairo, Mehmaan ane Bacchao ne Saifee Masjid
              Marol ma AQA MOULA taraf si niyaaz nu izaan che (je ne Masjid Al
              Zahra-Jamea pass allot thai che ehne bhi)
            </li>
            <li className="mb-2">
              <span className="mr-1">
                In case of any difficulty please contact us at
              </span>
              <a href="mailto:aemsherullah@gmail.com">aemsherullah@gmail.com</a>
              <span className="ml-1">or Jamaat Office.</span>
            </li>
          </ul>
        </div>
      )}
    </Form>
  );
};
