import { Radio } from "antd";
import { SEAT_LOCATIONS } from "appConstants";

export const AllocationLocationRadioGroup = ({ value, handleChange }) => {
  return (
    <Radio.Group
      buttonStyle="solid"
      value={value}
      onChange={handleChange}
      className="mb-4"
    >
      <Radio.Button value={SEAT_LOCATIONS.MASJID}>Masjid</Radio.Button>
      <Radio.Button value={SEAT_LOCATIONS.FIRST_FLOOR}>
        First Floor
      </Radio.Button>
      <Radio.Button value={SEAT_LOCATIONS.SECOND_FLOOR}>
        Second Floor
      </Radio.Button>
    </Radio.Group>
  );
};
