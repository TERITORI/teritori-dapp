import Airtable from "airtable";

import { Network } from "./network";

/**
 * NOTE: api rate is very low (5 requests per second),
 * once we get a lot of users, we will need to put a server between the client and airtable
 */

const airtableAPIKey = "keyNTJ1BbH31oTuwQ";
const airtableBaseId = "appetXQzVoElrsJs5";
const airtableLaunchpadTableId = "tbla2ZD8MtljtvHKt";

const fetchLaunchpadRecords = async () => {
  const airtable = new Airtable({ apiKey: airtableAPIKey });
  return await airtable
    .base(airtableBaseId)
    .table(airtableLaunchpadTableId)
    .select()
    .all();
};

export interface LaunchpadItem {
  id: string;
  name: string;
  network: Network;
  creatorName: string;
  isCertified: boolean;
  shouldDisplay: boolean;
  imageURL: string;
}

const airtableNetworkToNetwork = (airtableNetwork: string) => {
  switch (airtableNetwork) {
    case "Solana":
      return Network.Solana;
  }
  return undefined;
};

const getFieldAsString = (field: any) => {
  if (typeof field === "string") {
    return field;
  }
  return "";
};

const getFieldAsBoolean = (field: any) => {
  if (typeof field === "boolean") {
    return field;
  }
  if (typeof field === "string" && field.trim().toLowerCase() === "yes") {
    return true;
  }
  return false;
};

export const fetchLaunchpadItems = async () => {
  const records = await fetchLaunchpadRecords();
  return records.map((record) => {
    // safely get image url or empty string from record
    const pfp = record.fields["CollectionPFP"];
    const pfpFirst = Array.isArray(pfp) && pfp.length > 0 ? pfp[0] : undefined;
    const imageURL =
      typeof pfpFirst === "object" ? getFieldAsString(pfpFirst.url) : "";

    // construct typed item from record
    const item: LaunchpadItem = {
      id: record.getId(),
      name: getFieldAsString(record.fields["CollectionName"]),
      network: airtableNetworkToNetwork(
        getFieldAsString(record.fields["CollectionNetwork"])
      ),
      creatorName: getFieldAsString(record.fields["CreatorName"]),
      isCertified: getFieldAsBoolean(record.fields["IsCertified"]),
      shouldDisplay: getFieldAsBoolean(record.fields["UpcomingLaunchDisplay"]),
      imageURL,
    };
    return item;
  });
};
