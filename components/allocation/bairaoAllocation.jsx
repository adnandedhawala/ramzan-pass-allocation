/* eslint-disable unicorn/no-nested-ternary */
import { Button, Divider, Radio, message } from "antd";
import { SEAT_LOCATIONS } from "appConstants";
import { SeatSummaryCard } from "components/cards";
import { SeatNumberGridBairao } from "components/grids";
import { SeatNumberTableV2 } from "components/tables";
import { useGlobalContext } from "context/global";
import {
  allocateMemberToMasallahByIdHelper,
  allocateMemberToMasallahHelper,
  allocatePassesHelper,
  getMasallahByLocationHelper,
  getMasallahByLocationWithUserDataHelper
} from "fe";
import { useState } from "react";

const views = {
  LIST: "LIST",
  GRID: "GRID",
  SUMMARY: "SUMMARY"
};

const currentLocation =
  SEAT_LOCATIONS.FIRST_FLOOR + "," + SEAT_LOCATIONS.SECOND_FLOOR;

const getDuplicateEntries = (data, currentDaska) => {
  const array = data
    .map(value => value[currentDaska])
    .filter(value => value !== "");
  const uniqueSet = new Set(array);
  return array.filter(currentValue => {
    if (uniqueSet.has(currentValue)) {
      uniqueSet.delete(currentValue);
    } else {
      return currentValue;
    }
  });
};

const getInvalidEntries = (data, currentDaska) => {
  const array = data
    .map(value => value[currentDaska])
    .filter(value => value !== "")
    .filter(value => !/^\d{8}$/.test(value));
  const uniqueSet = new Set(array);
  return [...uniqueSet];
};

export const BairaoAllocation = () => {
  const [view, setView] = useState(views.LIST);
  const [masallahList, setMasallahList] = useState([]);
  const [masallahListWithUser, setMasallahListWithUser] = useState([]);

  const { toggleLoader } = useGlobalContext();

  const getMasallahList = () => {
    toggleLoader(true);
    getMasallahByLocationHelper({
      location: currentLocation,
      successFn: data => {
        const duplicateEntries_d1 = getDuplicateEntries(data.data, "d1");
        const duplicateEntries_d2 = getDuplicateEntries(data.data, "d2");
        const duplicateEntries_d3 = getDuplicateEntries(data.data, "d3");
        const invalidEntries_d1 = getInvalidEntries(data.data, "d1");
        const invalidEntries_d2 = getInvalidEntries(data.data, "d2");
        const invalidEntries_d3 = getInvalidEntries(data.data, "d3");
        setMasallahList(
          data.data.map(value => {
            const { location } = value.group;
            const prefix =
              location === SEAT_LOCATIONS.FIRST_FLOOR
                ? "FF_"
                : SEAT_LOCATIONS.SECOND_FLOOR
                ? "SF_"
                : "";
            const updatedSeat = prefix + value.seat_number;
            return {
              ...value.group,
              ...value,
              seat_number: updatedSeat,
              has_error_d1:
                duplicateEntries_d1.includes(value["d1"]) ||
                invalidEntries_d1.includes(value["d1"]),
              has_error_d2:
                duplicateEntries_d2.includes(value["d2"]) ||
                invalidEntries_d2.includes(value["d2"]),
              has_error_d3:
                duplicateEntries_d3.includes(value["d3"]) ||
                invalidEntries_d3.includes(value["d3"])
            };
          })
        );
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      }
    });
    getMasallahByLocationWithUserDataHelper({
      location: currentLocation,
      successFn: data => {
        setMasallahListWithUser(data.data);
      },
      errorFn: () => {},
      endFn: () => {}
    });
  };

  const setMasallahUser = (values, id, callback) => {
    toggleLoader(true);
    allocateMemberToMasallahByIdHelper({
      successFn: () => {
        message.success("Masallah updated successfully");
        callback();
        getMasallahList();
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      },
      data: {
        data: {
          _id: id,
          d1: values?.d1 || "",
          d2: values?.d2 || "",
          d3: values?.d3 || ""
        }
      }
    });
  };

  const handleSaveChangetoMasallah = () => {
    toggleLoader(true);
    allocateMemberToMasallahHelper({
      successFn: () => {
        message.success("Grid updated successfully");
        getMasallahList();
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      },
      data: {
        location: currentLocation,
        daska: "d1",
        data: masallahList.map(value => ({
          _id: value._id,
          d1: value?.d1 || "",
          d2: value?.d2 || "",
          d3: value?.d3 || ""
        }))
      }
    });
  };

  const handleAllocatePasses = () => {
    toggleLoader(true);
    allocatePassesHelper({
      successFn: () => {
        message.success("Passes are allocated successfully");
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      },
      location: currentLocation
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Radio.Group
          optionType="button"
          value={view}
          onChange={event => setView(event.target.value)}
          className="mb-4"
        >
          <Radio.Button value={views.LIST}>List</Radio.Button>
          <Radio.Button value={views.GRID}>Grid</Radio.Button>
          <Radio.Button value={views.SUMMARY}>Summary</Radio.Button>
        </Radio.Group>
        {view === views.LIST ? (
          <div className="flex mb-2 items-center">
            <Button
              size="middle"
              type="primary"
              onClick={handleSaveChangetoMasallah}
            >
              Save Grid
            </Button>
            <Button
              size="middle"
              onClick={handleAllocatePasses}
              className="ml-4"
            >
              Allocate Passes
            </Button>
          </div>
        ) : null}
      </div>
      {view === views.LIST ? (
        <SeatNumberGridBairao
          getData={getMasallahList}
          rowData={masallahList}
          masallahListWithUser={masallahListWithUser}
          setData={setMasallahList}
        />
      ) : null}
      {view === views.GRID ? (
        <>
          <SeatNumberTableV2
            setMasallahUser={setMasallahUser}
            masallahListWithUser={masallahListWithUser}
            currentLocation={SEAT_LOCATIONS.FIRST_FLOOR}
          />
          <Divider />
          <SeatNumberTableV2
            masallahListWithUser={masallahListWithUser}
            currentLocation={SEAT_LOCATIONS.SECOND_FLOOR}
          />
        </>
      ) : null}
      {view === views.SUMMARY ? (
        <SeatSummaryCard daska={"d1"} rowData={masallahListWithUser} />
      ) : null}
    </div>
  );
};
