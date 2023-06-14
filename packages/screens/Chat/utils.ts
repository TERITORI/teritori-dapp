import {
  GroupInfo_Reply,
  ServiceGetConfiguration_Reply,
  base64FromBytes,
  bytesFromBase64,
  createWeshClient,
} from "../../weshnet";
import {
  bytesFromString,
  stringFromBytes,
  stringToUint8Array,
  uint8ToString,
} from "../../weshnet/client/utils";
const weshClient = createWeshClient("http://localhost:4242");
const weshClient2 = createWeshClient("http://localhost:4243");

let weshConfig: ServiceGetConfiguration_Reply;
let weshConfig2: ServiceGetConfiguration_Reply;
let contactGroup: GroupInfo_Reply;

const getAccountPubKey = async (tp) => {
  console.log(tp);
  const accMemberDevice = await tp.Opts.SecretStore.GetGroupForAccount();

  return accMemberDevice.Member().Raw();
};

const createConfig = async () => {
  try {
    weshConfig = await weshClient.ServiceGetConfiguration({});
    weshConfig2 = await weshClient2.ServiceGetConfiguration({});

    console.log("create config success", JSON.stringify(weshConfig));
  } catch (err) {
    console.log("create config err", err);
  }
};

const makeContact = async () => {
  try {
    const contactRef = await weshClient.ContactRequestReference({});
    const contactRef2 = await weshClient2.ContactRequestReference({});
    await weshClient.ContactRequestEnable({});
    await weshClient2.ContactRequestEnable({});
    if (contactRef.publicRendezvousSeed.length === 0) {
      // we need to reset the reference the first time
      const resetRef = await weshClient.ContactRequestResetReference({});
      contactRef.publicRendezvousSeed = resetRef.publicRendezvousSeed;
    }
    if (contactRef2.publicRendezvousSeed.length === 0) {
      // we need to reset the reference the first time
      const resetRef = await weshClient2.ContactRequestResetReference({});
      contactRef2.publicRendezvousSeed = resetRef.publicRendezvousSeed;
    }
    await weshClient.ContactRequestSend({
      contact: {
        pk: weshConfig2.accountPk,
        publicRendezvousSeed: contactRef2.publicRendezvousSeed,
      },
    });

    // console.log("contact request sent");
    // await weshClient2.ContactRequestAccept({
    //   contactPk: weshConfig.accountPk,
    // });

    console.log("make contact success");
  } catch (err) {
    console.log("make contact", err);
  }
};

const subscribeContactRequest = async () => {
  try {
    const contactReq = await weshClient2.GroupMetadataList({
      groupPk: weshConfig2.accountGroupPk,
    });
    const myObserver = {
      next(data) {
        console.log("get contact request", data);
      },
      error(e) {
        console.log("get contact request obser...", e);
      },
      complete() {
        console.log("get contact request complete");
      },
    };
    contactReq.subscribe(myObserver);
  } catch (err) {
    console.log("get contact req err", err);
  }
};

const makeGroup = async () => {
  try {
    contactGroup = await weshClient.MultiMemberGroupCreate({});
    console.log("group", contactGroup);
    const activate = await weshClient.ActivateGroup({
      groupPk: contactGroup.groupPk,
    });
    console.log("activate", activate);

    const groupInfo = await weshClient.GroupInfo({
      groupPk: contactGroup.groupPk,
    });
    console.log("group info", groupInfo);

    // await weshClient2.MultiMemberGroupJoin({
    //   group: {
    //     publicKey: groupInfo.group.publicKey,
    //     groupType: 2,
    //     secret: groupInfo.group?.secret,
    //     secretSig: groupInfo.group?.secretSig,
    //   },
    // });
    // await weshClient.MultiMemberGroupJoin({
    //   group: {
    //     publicKey: groupInfo.group.publicKey,
    //     groupType: 2,
    //     secret: groupInfo.group?.secret,
    //     secretSig: groupInfo.group?.secretSig,
    //   },
    // });
    console.log("make group success");
  } catch (err) {
    console.log("make group err", err);
  }
};

const activateGroup = async () => {
  try {
    const contactGroup = await weshClient.GroupInfo({
      contactPk: weshConfig2.accountPk,
    });

    await weshClient.ActivateGroup({
      groupPk: contactGroup.group?.publicKey,
    });

    const contactGroup2 = await weshClient2.GroupInfo({
      contactPk: weshConfig.accountPk,
    });
    await weshClient2.ActivateGroup({
      groupPk: contactGroup2.group?.publicKey,
    });
  } catch (err) {
    console.log("get group info", err);
  }
};

const getGroupInfo = async () => {
  try {
    contactGroup = await weshClient.GroupInfo({
      contactPk: weshConfig2.accountPk,
    });

    console.log("group info", contactGroup);
  } catch (err) {
    console.log("get group info", err);
  }
};

const sendMessage = async () => {
  try {
    await weshClient.AppMessageSend({
      groupPk: contactGroup.group?.publicKey,
      payload: bytesFromString("test message"),
    });
    console.log("send message success");
  } catch (err) {
    console.log("send message err", err);
  }
};

const getMessages = async () => {
  try {
    const messages = await weshClient.GroupMessageList({
      groupPk: contactGroup.group?.publicKey,
      untilNow: true,
    });
    const myObserver = {
      next(data) {
        console.log("get message data", data);
        console.log(stringFromBytes(data.message));
      },
      error(e) {
        console.log("get message obser...", e);
      },
      complete() {
        console.log("get message complete");
      },
    };
    messages.subscribe(myObserver);
  } catch (err) {
    console.log("get messages err", err);
  }
};

export async function testWesh() {
  try {
    await createConfig();

    await subscribeContactRequest();
    await makeContact();
    await activateGroup();
    await getGroupInfo(); // await makeGroup();
    await sendMessage();
    await getMessages();
  } catch (err) {
    console.log("testWesh", err);
  }
}
