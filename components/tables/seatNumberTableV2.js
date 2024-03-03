/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable security/detect-object-injection */
import { Table, Tooltip } from "antd";
import { SEAT_LOCATIONS } from "appConstants";
import { groupBy, max, min } from "lodash";
import { useMemo } from "react";

export const SeatNumberTableV2 = ({
  masallahListWithUser,
  currentLocation
}) => {
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
                  className="p-1 font-bold text-[12px] flex items-center flex-col"
                  style={{
                    backgroundColor: value.group.color,
                    border: "1px solid #999999"
                  }}
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
                        <span className="bg-black h-2 w-2 ml-1 rounded-lg border-2" />
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
                        <span className="bg-black h-2 w-2 ml-1 rounded-lg border-2" />
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
    <Table
      dataSource={getData()}
      scroll={{ x: "max-content" }}
      columns={getColumns()}
      pagination={false}
      showHeader={false}
    />
  );
};
