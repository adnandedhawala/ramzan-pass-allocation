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
            pattern: /^[1-9]\d{0,5}$/,
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
              Sagla Mumeneen / Mumenaat ne Magrib Namaaz waaste register karvu
              zaroori che.
            </li>
            <li className="mb-2">
              ⁠Saifee Masjid (Marol) ane Masjid Al Zahra (Jamea) banne Masjid ni
              Passes waaste Register karwu zaroori che, Registered Mumeen nej
              Pass allot thaase.
            </li>
            <li className="mb-2">
              ⁠Mumeneen / Mumenaat jehne Masjid Al Zahra ni pass allocate thaase
              ehne Saifee Masjid Marol ni pass allocate nahi thai.
            </li>
            <li className="mb-2">
              ⁠Kam allocation hova na sabab agar Masjid Al Zahra-Jamea nu
              allotment full thai jaase toh aapne Saifee Masjid ni pass allot
              thaase.
            </li>
            <li className="mb-2">
              Je sagla Mumeneen / Mumenaat chair par Namaaz padhta hoi, yeh
              sagla Registration ma Rahat Block Select kare. Masjid Al
              Zahra-Jamea ma Rahat Block nathi.
            </li>
            <li className="mb-2">
              ⁠Sagla Mumineen / Mumenaat / Farzando / Mehmaano ne Aqa Maula TUS
              taraf si Saifee Masjid Marol ma niyaaz nu izaan che (Jene Masjid
              Al Zahra (Jamea) ni Namaaz pass allot thai che ehne bhi)
            </li>
            <li className="mb-2">
              <span className="mr-1">
                Agar Registration ma koi takleef hoi toh
              </span>
              <a href="mailto:aemsherullah@gmail.com">aemsherullah@gmail.com</a>
              <span className="ml-1">ya Jamaat Office ma Contact kare.</span>
            </li>
          </ul>
        </div>
      )}
    </Form>
  );
};
