/* eslint-disable security/detect-object-injection */
import { Table, Tooltip } from "antd";
import { useMasallahContext } from "context/masallah";
import { groupBy, max, min } from "lodash";

export const SeatNumberTable = () => {
  const { masallahListWithUser, currentDaska } = useMasallahContext();
  const getColumns = () => {
    const coordinateList = masallahListWithUser.map(value => ({
      ...value.position,
      ...value
    }));
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
          const daskaDetails = value[currentDaska];
          return {
            props: {
              style: {
                padding: 0
              }
            },
            children: (
              <>
                {daskaDetails ? (
                  <Tooltip
                    title={
                      <div className="flex flex-col items-center">
                        <span className="text-center">
                          {daskaDetails?.hof_id?.tanzeem_file_no}
                        </span>
                        <span className="text-center">
                          {daskaDetails?.member_details?._id}
                        </span>
                        <span className="text-center">
                          {daskaDetails?.member_details?.full_name}
                        </span>
                      </div>
                    }
                  >
                    <div
                      className="p-2 text-[10px] flex items-center"
                      style={{ backgroundColor: value.group.color }}
                    >
                      {value.seat_number}
                      {daskaDetails ? (
                        <span className="bg-lime-600 h-3 w-3 ml-1 rounded-lg border-2 border-solid border-white"></span>
                      ) : null}
                    </div>
                  </Tooltip>
                ) : (
                  <div
                    className="p-2 text-[10px] flex items-center"
                    style={{ backgroundColor: value.group.color }}
                  >
                    {value.seat_number}
                  </div>
                )}
              </>
            )
          };
        }
      });
    }
    return columns;
  };

  const getData = () => {
    const coordinateList = masallahListWithUser.map(value => ({
      ...value.position,
      ...value
    }));

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
