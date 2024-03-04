/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable security/detect-object-injection */
import { Button, Divider, Form, Input, Modal, Table, Tooltip } from "antd";
import { SEAT_LOCATIONS } from "appConstants";
import { groupBy, max, min } from "lodash";
import { useMemo, useState } from "react";

const inputITS = "Please input ITS!";
const invalidITS = "invalid ITS!";

export const SeatNumberTableV2 = ({
  masallahListWithUser,
  currentLocation,
  setMasallahUser
}) => {
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [currentSeat, setCurrentSeat] = useState(null);

  const [form] = Form.useForm();

  const handleModalCancel = () => {
    setCurrentSeat(null);
    setShowSeatModal(false);
  };

  const handleSeatClick = seat => {
    setCurrentSeat(seat);
    setShowSeatModal(true);
    form.setFieldValue("d1", seat?.d1?.member_details?._id || "");
    form.setFieldValue("d2", seat?.d2?.member_details?._id || "");
    form.setFieldValue("d3", seat?.d3?.member_details?._id || "");
  };

  const handleFormFinish = values => {
    setMasallahUser(values, currentSeat._id, () => {
      form.resetFields();
      setCurrentSeat(null);
      setShowSeatModal(false);
    });
  };

  const coordinateList = useMemo(() => {
    return masallahListWithUser
      .filter(value => value.location === currentLocation)
      .map(value => {
        const prefix =
          value.group.location === SEAT_LOCATIONS.FIRST_FLOOR
            ? "FF_"
            : value.group.location === SEAT_LOCATIONS.SECOND_FLOOR
            ? "SF_"
            : "";
        const updatedSeatNumber = prefix + value.seat_number;
        return {
          ...value.position,
          ...value,
          seat_number: updatedSeatNumber
        };
      });
  }, [currentLocation, masallahListWithUser]);

  const getColumns = () => {
    const coordinateListX = coordinateList.map(value => value.x);
    const minX = min(coordinateListX);
    const maxX = max(coordinateListX);
    let columns = [];
    for (let index = minX; index <= maxX; index++) {
      columns.push({
        title: index,
        dataIndex: index,
        key: index,
        render: value => {
          const showTooltip =
            currentLocation === SEAT_LOCATIONS.MASJID
              ? !!value.d1
              : value.d1 || value.d2 || value.d3;
          return {
            props: {
              style: {
                padding: 0
              }
            },
            children: (
              <>
                <div
                  className="p-1 font-bold text-[12px] flex items-center flex-col w-14 h-9"
                  style={{
                    backgroundColor: value.group.color,
                    border: "1px solid #999999"
                  }}
                  onClick={() => handleSeatClick({ ...value })}
                  key={value._id}
                >
                  {value.seat_number}
                  <div className="flex items-center">
                    {value?.d1 ? (
                      <Tooltip
                        title={
                          showTooltip ? (
                            <div className="flex flex-col items-center text-[12px]">
                              <span className="text-center">
                                {value.seat_number}
                              </span>
                              <span className="text-center">
                                {value?.d1?.hof_id?.tanzeem_file_no}
                              </span>
                              <span className="text-center">
                                {value?.d1?.member_details?._id}
                              </span>
                              <span className="text-center text-[10px]">
                                {value?.d1?.member_details?.full_name}
                              </span>
                            </div>
                          ) : (
                            ""
                          )
                        }
                      >
                        <span className="bg-black h-2 w-2 ml-1 rounded-lg border-2" />
                      </Tooltip>
                    ) : null}
                    {value?.d2 && currentLocation !== SEAT_LOCATIONS.MASJID ? (
                      <Tooltip
                        title={
                          showTooltip ? (
                            <div className="flex flex-col items-center text-[12px]">
                              <span className="text-center">
                                {value.seat_number}
                              </span>
                              <span className="text-center">
                                {value?.d2?.hof_id?.tanzeem_file_no}
                              </span>
                              <span className="text-center">
                                {value?.d2?.member_details?._id}
                              </span>
                              <span className="text-center text-[10px]">
                                {value?.d2?.member_details?.full_name}
                              </span>
                            </div>
                          ) : (
                            ""
                          )
                        }
                      >
                        <span className="bg-cyan-900 h-2 w-2 ml-1 rounded-lg border-2" />
                      </Tooltip>
                    ) : null}
                    {value?.d3 && currentLocation !== SEAT_LOCATIONS.MASJID ? (
                      <Tooltip
                        title={
                          showTooltip ? (
                            <div className="flex flex-col items-center text-[12px]">
                              <span className="text-center">
                                {value.seat_number}
                              </span>
                              <span className="text-center">
                                {value?.d3?.hof_id?.tanzeem_file_no}
                              </span>
                              <span className="text-center">
                                {value?.d3?.member_details?._id}
                              </span>
                              <span className="text-center text-[10px]">
                                {value?.d3?.member_details?.full_name}
                              </span>
                            </div>
                          ) : (
                            ""
                          )
                        }
                      >
                        <span className="bg-[#aaaaaa] h-2 w-2 ml-1 rounded-lg border-2" />
                      </Tooltip>
                    ) : null}
                  </div>
                </div>
              </>
            )
          };
        }
      });
    }
    return columns;
  };

  const getData = () => {
    let groupedCoordinateList = groupBy(coordinateList, "y");
    return Object.keys(groupedCoordinateList)
      .map(value => groupedCoordinateList[value])
      .map(row => {
        let dataObject = {};
        row.map(rowValue => {
          dataObject[rowValue.x] = rowValue;
        });
        return dataObject;
      });
  };

  return (
    <>
      <Table
        dataSource={getData()}
        scroll={{ x: "max-content" }}
        columns={getColumns()}
        pagination={false}
        showHeader={false}
      />
      {showSeatModal ? (
        <Modal footer={null} open={showSeatModal} onCancel={handleModalCancel}>
          <div className="flex flex-col text-lg mb-4">
            <span>Location : {currentSeat?.location.replace("_", " ")}</span>
            <span>Seat Number : {currentSeat?.seat_number}</span>
          </div>
          {currentSeat?.d1 ? (
            <div className="flex items-start mb-2">
              <span className="text-lg w-16">
                {currentLocation === SEAT_LOCATIONS.MASJID
                  ? "D1, D2, D3"
                  : "D1"}
              </span>
              <div className="flex flex-col flex-1">
                <span>{currentSeat?.d1?.hof_id?.tanzeem_file_no}</span>
                <span>{currentSeat?.d1?.member_details?._id}</span>
                <span>{currentSeat?.d1?.member_details?.full_name}</span>
              </div>
            </div>
          ) : null}
          {currentSeat?.d2 && currentLocation !== SEAT_LOCATIONS.MASJID ? (
            <div className="flex items-start mb-2">
              <span className="text-lg w-16">D2</span>
              <div className="flex flex-col flex-1">
                <span>{currentSeat?.d2?.hof_id?.tanzeem_file_no}</span>
                <span>{currentSeat?.d2?.member_details?._id}</span>
                <span>{currentSeat?.d2?.member_details?.full_name}</span>
              </div>
            </div>
          ) : null}
          {currentSeat?.d3 && currentLocation !== SEAT_LOCATIONS.MASJID ? (
            <div className="flex items-start mb-2">
              <span className="text-lg w-16">D3</span>
              <div className="flex flex-col flex-1">
                <span>{currentSeat?.d3?.hof_id?.tanzeem_file_no}</span>
                <span>{currentSeat?.d3?.member_details?._id}</span>
                <span>{currentSeat?.d3?.member_details?.full_name}</span>
              </div>
            </div>
          ) : null}
          <Divider />
          <Form
            onFinish={handleFormFinish}
            name="setSeatNumber"
            layout="horizontal"
            form={form}
            size="small"
            requiredMark={false}
          >
            <Form.Item
              label={
                currentLocation === SEAT_LOCATIONS.MASJID ? "D1, D2, D3" : "D1"
              }
              name="d1"
              rules={[
                {
                  required: false,
                  message: inputITS
                },
                {
                  pattern: /^\d{8}$/,
                  message: invalidITS
                }
              ]}
            >
              <Input placeholder="Enter ITS" />
            </Form.Item>
            {currentLocation === SEAT_LOCATIONS.MASJID ? null : (
              <>
                <Form.Item
                  label="D2"
                  name="d2"
                  rules={[
                    {
                      required: false,
                      message: inputITS
                    },
                    {
                      pattern: /^\d{8}$/,
                      message: invalidITS
                    }
                  ]}
                >
                  <Input placeholder="Enter ITS" />
                </Form.Item>
                <Form.Item
                  label="D3"
                  name="d3"
                  rules={[
                    {
                      required: false,
                      message: inputITS
                    },
                    {
                      pattern: /^\d{8}$/,
                      message: invalidITS
                    }
                  ]}
                >
                  <Input placeholder="Enter ITS" />
                </Form.Item>
              </>
            )}

            <Form.Item className="text-center">
              <Button size="middle" type="primary" htmlType="submit">
                Submit
              </Button>
              <p className="mt-2 text-red-400">
                While Submiting if values are blank user will be removed !
              </p>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </>
  );
};
