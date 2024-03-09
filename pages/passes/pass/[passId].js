import { Button, Col, Image, Row } from "antd";
import { FullPageLoader } from "components";
import { useGlobalContext } from "context/global";
import { getMasallahByIdHelper } from "fe";
import { toPng } from "html-to-image";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ViewPassPage() {
  const reference = useRef(null);
  const router = useRouter();
  const { passId } = router.query;
  const { toggleLoader, showLoader } = useGlobalContext();

  const [name, setName] = useState("-");
  const [its, setIts] = useState("-");
  const [seatNumber, setSeatNumber] = useState("-");

  const onButtonClick = useCallback(() => {
    if (reference.current === null) {
      return;
    }

    toPng(reference.current)
      .then(dataUrl => {
        const link = document.createElement("a");
        link.download = "pass.png";
        link.href = dataUrl;
        link.click();
      })
      .catch(() => {});
  }, [reference]);

  const getPassData = id => {
    toggleLoader(true);
    getMasallahByIdHelper({
      id,
      successFn: data => {
        const { d1, seat_number } = data.data;
        setName(d1?.member_details?.full_name);
        setIts(d1?._id);
        setSeatNumber(seat_number);
      },
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      }
    });
  };

  useEffect(() => {
    if (passId) {
      getPassData(passId);
    }
  }, [passId]);

  return (
    <>
      <Head>
        <title>Sherullah 1445 AEM Marol</title>
        <meta name="description" content="Pass Allocation  Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex w-full flex-col bg-gray-300 overflow-auto p-8">
        {showLoader ? <FullPageLoader /> : null}
        <div className="mb-4">
          <Button
            disabled={showLoader}
            type="primary"
            size="large"
            onClick={onButtonClick}
          >
            Download Pass
          </Button>
          <Button size="large" onClick={() => router.back()} className="ml-4">
            Go Back
          </Button>
        </div>
        <div ref={reference} className="relative w-[700px]">
          <Image
            className="-z-1 object-contain"
            preview={false}
            src="/pass_bg_final.png"
          />
          <div className="absolute w-full top-0 left-0 p-4">
            <div className="flex w-full relative">
              <div className="w-[100px] h-[100px] absolute top-0 left-0">
                <Image preview={false} src="/jamaatLogo.png" />
              </div>
              <div className="mx-auto flex flex-col items-center">
                <h1 className="mb-1 mt-1 tracking-wide text-2xl">
                  Anjuman – E – Ezzi
                </h1>
                <p className="text-md">Saifee Masjid, Saifee Park, Marol</p>
                <h2 className="mb-1 mt-4 text-xl text-red-500">
                  Sherullah-il-Moazzam – 1445 H
                </h2>
                <h2 className="mb-1 text-orange-500">Ground Floor Masjid</h2>
              </div>
            </div>
            <div className="flex flex-col w-full mt-4 px-4">
              <p className="flex mb-2">
                <span className="w-16">Name: </span>
                <span>{name}</span>
              </p>
              <p className="flex">
                <span className="w-16">ITS: </span>
                <span>{its}</span>
              </p>
            </div>
            <Row className="mt-4 px-4" gutter={[24, 24]}>
              <Col xs={8}>
                <div className="border-solid mb-1 text-center p-2">
                  1st - 10th
                </div>
                <div className="border-solid mb-1 flex justify-center items-center h-16">
                  <h1>{seatNumber}</h1>
                </div>
              </Col>
              <Col xs={8}>
                <div className="border-solid mb-1 text-center p-2">
                  11th - 20th
                </div>
                <div className="border-solid mb-1 flex justify-center items-center h-16">
                  <h1>{seatNumber}</h1>
                </div>
              </Col>
              <Col xs={8}>
                <div className="border-solid mb-1 text-center p-2">
                  21st - 30th
                </div>
                <div className="border-solid mb-1 flex justify-center items-center h-16">
                  <h1>{seatNumber}</h1>
                </div>
              </Col>
            </Row>
            <div className="mt-5 text-[10px] px-4">
              <p>Instructions:</p>
              <li>Masalla allocation is not transferable.</li>
              <li>
                During namaaz time children are not allowed inside the masjid.
              </li>
              <li>
                Rahat masallas are allocated adjacent to the walls on Left side
                of qibla and entrance wall. Using a chair or stool is strictly
                prohibited anywhere else inside the masjid.
              </li>
            </div>
          </div>
        </div>

        <p className="mt-6">Kindly Note:</p>
        <ol className="mt-2 px-2">
          <li>
            Kindly remove your shoes, put them in carry bag and give at the shoe
            counter.
          </li>
          <li>
            You have to bring your own reusable carry bags for your shoes.
          </li>
          <li>
            Chakhris should remain in the washroom area only - Do not wear
            chakhris on wooden planks.
          </li>
          <li>
            After washing your feet, walk on the wooden planks (without chakris)
            and then dry your feet on pagdandis.
          </li>
        </ol>
      </div>
    </>
  );
}
