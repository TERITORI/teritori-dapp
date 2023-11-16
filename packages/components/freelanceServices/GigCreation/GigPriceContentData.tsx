import React from "react";

import { TableCheckBox } from "../../checkbox/TableCheckBox";
import { TableSelect } from "../../select/TableSelect";
import { EditType, GigInfo, PriceContentType } from "../types/fields";

const unitWidth = 226;
const unitHeight = 38;

export const GigPriceContentData: React.FC<{
  gigInfo: GigInfo;
  setGig: React.Dispatch<React.SetStateAction<GigInfo>>;
  priceContentType: PriceContentType;
}> = ({ gigInfo, setGig, priceContentType }) => {
  return (
    <>
      {priceContentType === PriceContentType.basic &&
        gigInfo.basicPackage.contents.map((contentInfo, index) => {
          if (contentInfo.edit_type === EditType.CHECKBOX) {
            return (
              <TableCheckBox
                key={`checkbox_${index}`}
                value={contentInfo.active}
                setValue={(v: boolean) => {
                  const basicContentInfos = [...gigInfo.basicPackage.contents];
                  basicContentInfos[index].active = v;
                  setGig({
                    ...gigInfo,
                    basicPackage: {
                      ...gigInfo.basicPackage,
                      contents: [...basicContentInfos],
                    },
                  });
                }}
              />
            );
          }
          if (contentInfo.edit_type === EditType.DROPDOWN) {
            return (
              <TableSelect
                key={`dropdown_${index}`}
                width={unitWidth}
                height={unitHeight}
                data={
                  contentInfo.data_options === null
                    ? []
                    : contentInfo.data_options.map((value) => value.text)
                }
                initValue="Select"
                zIndex={50 - index}
                value={
                  contentInfo.data_value === null ? "" : contentInfo.data_value
                }
                setValue={(v: string) => {
                  const basicContentInfos = gigInfo.basicPackage.contents;
                  basicContentInfos[index].active = true;
                  basicContentInfos[index].data_value = v;
                  setGig({
                    ...gigInfo,
                    basicPackage: {
                      ...gigInfo.basicPackage,
                      contents: basicContentInfos,
                    },
                  });
                }}
              />
            );
          }
        })}
      {priceContentType === PriceContentType.standard &&
        gigInfo.standardPackage.contents.map((contentInfo, index) => {
          if (contentInfo.edit_type === EditType.CHECKBOX) {
            return (
              <TableCheckBox
                key={`checkbox_${index}`}
                value={contentInfo.active}
                setValue={(v: boolean) => {
                  const standardContentInfos = [
                    ...gigInfo.standardPackage.contents,
                  ];
                  standardContentInfos[index].active = v;
                  setGig({
                    ...gigInfo,
                    standardPackage: {
                      ...gigInfo.standardPackage,
                      contents: [...standardContentInfos],
                    },
                  });
                }}
              />
            );
          }
          if (contentInfo.edit_type === EditType.DROPDOWN) {
            return (
              <TableSelect
                key={`dropdown_${index}`}
                width={unitWidth}
                height={unitHeight}
                data={
                  contentInfo.data_options === null
                    ? []
                    : contentInfo.data_options.map((value) => value.text)
                }
                initValue="Select"
                zIndex={50 - index}
                value={
                  contentInfo.data_value === null ? "" : contentInfo.data_value
                }
                setValue={(v: string) => {
                  const standardContentInfos = [
                    ...gigInfo.standardPackage.contents,
                  ];
                  standardContentInfos[index].active = true;
                  standardContentInfos[index].data_value = v;
                  setGig({
                    ...gigInfo,
                    standardPackage: {
                      ...gigInfo.standardPackage,
                      contents: standardContentInfos,
                    },
                  });
                }}
              />
            );
          }
        })}
      {priceContentType === PriceContentType.premium &&
        gigInfo.premiumPackage.contents.map((contentInfo, index) => {
          if (contentInfo.edit_type === EditType.CHECKBOX) {
            return (
              <TableCheckBox
                key={`checkbox_${index}`}
                value={contentInfo.active}
                setValue={(v: boolean) => {
                  const premiumContentInfos = [
                    ...gigInfo.premiumPackage.contents,
                  ];
                  premiumContentInfos[index].active = v;
                  setGig({
                    ...gigInfo,
                    premiumPackage: {
                      ...gigInfo.premiumPackage,
                      contents: [...premiumContentInfos],
                    },
                  });
                }}
              />
            );
          }
          if (contentInfo.edit_type === EditType.DROPDOWN) {
            return (
              <TableSelect
                key={`dropdown_${index}`}
                width={unitWidth}
                height={unitHeight}
                data={
                  contentInfo.data_options === null
                    ? []
                    : contentInfo.data_options.map((value) => value.text)
                }
                initValue="Select"
                zIndex={50 - index}
                value={
                  contentInfo.data_value === null ? "" : contentInfo.data_value
                }
                setValue={(v: string) => {
                  const premiumContentInfos = [
                    ...gigInfo.premiumPackage.contents,
                  ];
                  premiumContentInfos[index].active = true;
                  premiumContentInfos[index].data_value = v;
                  setGig({
                    ...gigInfo,
                    premiumPackage: {
                      ...gigInfo.premiumPackage,
                      contents: premiumContentInfos,
                    },
                  });
                }}
              />
            );
          }
        })}
    </>
  );
};
