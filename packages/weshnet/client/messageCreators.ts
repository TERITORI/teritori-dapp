import { Message } from "../../utils/types/message";

export const contactSent = (): Message => {
  return {};
};

export const contactAccepted = (): Message => {
  return {
    type: "accept-contact",
  };
};

export const contactRejected: Message = () => {
  return {};
};

export const groupCreated: Message = () => {
  return {};
};

export const groupJoinByMember: Message = () => {
  return {};
};

export const groupLeaveByMember: Message = () => {
  return {};
};

export const getLineTextByMessageType = ({ message }: { message: Message }) => {
  switch (message.type) {
    case "contact-request":
      return `Anon has sent a contact`;
  }
};

await sendMessage({
  groupPk: group.groupPk,
  message: {
    type: "group-create",
    payload: {
      message: "",
      files: [],
      metadata: {
        groupName,
      },
    },
  },
});
