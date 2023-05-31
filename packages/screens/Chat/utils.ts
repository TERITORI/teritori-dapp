import { createWeshClient } from "../../weshnet";
const weshClient = createWeshClient("http://localhost:4242");
const weshClient2 = createWeshClient("http://localhost:4243");

let weshConfig;
let weshConfig2;
let contactGroup;

const createConfig = async () => {
  try {
    weshConfig = await weshClient.ServiceGetConfiguration({});
    weshConfig2 = await weshClient2.ServiceGetConfiguration({});
    console.log("create config success", weshConfig);
  } catch (err) {
    console.log("create config err", err);
  }
};

const makeContact = async () => {
  try {
    const contactRef = await weshClient.ContactRequestReference({});
    const contactRef2 = await weshClient2.ContactRequestReference({});
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

    console.log("contact request sent");
    await weshClient2.ContactRequestAccept({
      contactPk: weshConfig.accountPk,
    });

    console.log("make contact success");
  } catch (err) {
    console.log("make contact", err);
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

const sendMessage = async () => {
  try {
    await weshClient.AppMessageSend({
      groupPk: contactGroup.groupPk,
      payload: new Uint8Array([1, 2, 3, 4, 5]),
    });
    console.log("send message success");
  } catch (err) {
    console.log("send message err", err);
  }
};

const getMessages = async () => {
  try {
    const messages = await weshClient.GroupMessageList({
      groupPk: contactGroup.groupPk,
      untilNow: true,
    });
    const myObserver = {
      next(data) {
        console.log("get message data", data);
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
    await makeContact();
    await makeGroup();
    await getMessages();
    await sendMessage();
  } catch (err) {
    console.log("testWesh", err);
  }
}
