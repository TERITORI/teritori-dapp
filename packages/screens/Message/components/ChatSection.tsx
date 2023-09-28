import moment from "moment";
import React, { RefObject, useMemo, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";

import { ChatHeader } from "./ChatHeader";
import { Conversation } from "./Conversation";
import { SearchConversation } from "./SearchConversation";
import { UploadImage } from "./UploadImage";
import { UploadedPreview } from "./UploadedPreview";
import plus from "../../../../assets/icons/chatplus.svg";
import closeSVG from "../../../../assets/icons/close.svg";
import sent from "../../../../assets/icons/sent.svg";
import { BrandText } from "../../../components/BrandText";
import { Dropdown } from "../../../components/Dropdown";
import { KeyboardAvoidingView } from "../../../components/KeyboardAvoidingView";
import { SVG } from "../../../components/SVG";
import { ScreenContainer } from "../../../components/ScreenContainer";
import { Separator } from "../../../components/Separator";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import { selectMessageListByGroupPk } from "../../../store/slices/message";
import {
  ScreenFC,
  useAppNavigation,
  useAppRoute,
} from "../../../utils/navigation";
import {
  neutral00,
  neutral33,
  neutral77,
  neutralA3,
  redDefault,
} from "../../../utils/style/colors";
import {
  fontSemibold10,
  fontSemibold12,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import {
  Conversation as IConversation,
  MessageFileData,
  ReplyTo,
} from "../../../utils/types/message";
import { getNewConversationText } from "../../../weshnet/client/messageHelpers";
import { sendMessage } from "../../../weshnet/client/services";
import { bytesFromString } from "../../../weshnet/client/utils";

interface ChatSectionProps {
  conversation: IConversation;
}
export interface HandleSendParams {
  message: string;
  files: MessageFileData[];
}

export const ChatSection = ({ conversation }: ChatSectionProps) => {
  const [message, setMessage] = useState<any>("");
  const [inputHeight, setInputHeight] = useState(40);
  const [replyTo, setReplyTo] = useState<ReplyTo>();
  const [inputRef, setInputRef] = useState<RefObject<any> | null>(null);
  const [file, setFile] = useState<MessageFileData>();

  const [searchInput, setSearchInput] = useState("");

  const flatListRef = useRef<FlatList>(null);

  const { setToastError } = useFeedbacks();
  const messages = useSelector(selectMessageListByGroupPk(conversation.id));

  const searchResults = useMemo(() => {
    if (!searchInput) {
      return [];
    }
    return messages.filter((item) =>
      item?.payload?.message?.toLowerCase().includes(searchInput?.toLowerCase())
    );
  }, [messages, searchInput]);

  const handleSend = async (data?: any) => {
    if (!message && !data?.message) {
      return;
    }
    let files = data?.files;

    if (files) {
      files = files.map(({ file, ...rest }) => rest);
    }
    try {
      await sendMessage({
        groupPk: bytesFromString(conversation.id),
        message: {
          type: "message",
          parentId: replyTo?.id || "",
          payload: {
            message: message || data?.message,
            files: data?.files || [],
          },
        },
      });

      setMessage("");
      setFile(undefined);
      setReplyTo(undefined);
      inputRef?.current?.focus();
    } catch (err: any) {
      setToastError({
        title: "Failed to send message",
        message: err?.message,
      });
    }
  };
  const { height } = useWindowDimensions();

  return (
    <KeyboardAvoidingView extraVerticalOffset={32}>
      <View
        style={[
          {
            height: height - (Platform.OS === "web" ? 210 : 150),
            width: "100%",
          },
          Platform.OS !== "web" && {
            flex: 1,
          },
        ]}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            minWidth: "100%",
          }}
        >
          <View style={{ zIndex: 11111 }}>
            <ChatHeader
              messages={messages}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              conversation={conversation}
            />
          </View>
          <Separator color={neutral33} />
          {!!searchInput && (
            <View
              style={{
                width: "100%",
                maxWidth: 500,
                height: "100%",
                backgroundColor: neutral33,
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 99,
              }}
            >
              {!searchResults.length && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <BrandText style={[fontSemibold14, { color: neutral77 }]}>
                    No result found
                  </BrandText>
                </View>
              )}
              <FlatList
                data={searchResults}
                style={{
                  paddingTop: 48,
                }}
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      <SearchConversation
                        onPress={() => {
                          setSearchInput("");
                          flatListRef.current?.scrollToIndex({
                            index: messages.findIndex(
                              (message) => message.id === item.id
                            ),
                          });
                        }}
                        conversation={conversation}
                        message={item}
                        groupPk={bytesFromString(conversation.id)}
                      />
                    </>
                  );
                }}
                keyExtractor={(item) => item.id}
              />
            </View>
          )}

          {!messages.length && (
            <View
              style={{
                alignItems: "center",
                marginTop: layout.spacing_x2,
              }}
            >
              <BrandText style={[fontSemibold12]}>
                {getNewConversationText(conversation)}
              </BrandText>
            </View>
          )}

          <FlatList
            ref={flatListRef}
            inverted
            data={messages}
            style={{
              paddingVertical: layout.spacing_x1_5,
            }}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item, index }) => {
              const previousMessage =
                index < messages.length - 1 ? messages[index + 1] : undefined;
              const nextMessage = index > 0 ? messages[index - 1] : undefined;

              const separatorDate = previousMessage
                ? moment(item.timestamp).format("DD/MM/YYYY") !==
                    moment(previousMessage.timestamp).format("DD/MM/YYYY") &&
                  item.timestamp
                : item.timestamp;

              const isNewSeparator = !previousMessage?.isRead && item.isRead;
              const parentMessage = item?.parentId
                ? messages.find((msg) => msg.id === item.parentId)
                : undefined;

              if (item.type === "group-join") {
                return null;
              }

              return (
                <>
                  {item.type !== "accept-contact" && (
                    <Conversation
                      conversation={conversation}
                      onReply={setReplyTo}
                      message={item}
                      groupPk={bytesFromString(conversation.id)}
                      isMessageChain={
                        previousMessage?.senderId === item.senderId
                      }
                      isNextMine={nextMessage?.senderId === item.senderId}
                      parentMessage={parentMessage}
                    />
                  )}
                  {item.type === "accept-contact" && (
                    <View style={{ alignItems: "center" }}>
                      <BrandText style={[fontSemibold10, { color: neutralA3 }]}>
                        Contact accepted
                      </BrandText>
                    </View>
                  )}
                  {(!!isNewSeparator || !!separatorDate) && (
                    <View
                      style={{
                        flexDirection: "row",
                        position: "relative",
                        alignItems: "center",
                        justifyContent: "center",
                        marginVertical: layout.spacing_x2,
                        width: "80%",
                        alignSelf: "center",
                      }}
                    >
                      {!!separatorDate && (
                        <BrandText
                          style={[
                            fontSemibold10,
                            {
                              backgroundColor: neutral00,
                              paddingHorizontal: layout.spacing_x2,
                              zIndex: 9,
                            },
                          ]}
                        >
                          {moment(separatorDate).format("DD/MM/YYYY")}
                        </BrandText>
                      )}

                      {!!isNewSeparator && (
                        <View
                          style={{
                            backgroundColor: redDefault,
                            paddingVertical: layout.spacing_x0_25,
                            paddingHorizontal: layout.spacing_x0_5,
                            borderRadius: 2,
                            zIndex: 9,
                            position: "absolute",
                            right: 0,
                          }}
                        >
                          <BrandText style={[fontSemibold10]}>New</BrandText>
                        </View>
                      )}
                      <View
                        style={{
                          width: "100%",
                          backgroundColor: isNewSeparator
                            ? redDefault
                            : neutral33,
                          height: 0.5,
                          position: "absolute",
                          zIndex: 0,
                        }}
                      />
                    </View>
                  )}
                </>
              );
            }}
            keyExtractor={(item) => item.id}
          />

          <SpacerColumn size={3} />
        </View>
        {!!messages.length && (
          <View
            style={{
              flexDirection: "row",
              padding: layout.spacing_x1,
              alignItems: "center",
            }}
          >
            <Dropdown triggerComponent={<SVG source={plus} />}>
              {({ closeOpenedDropdown }) => (
                <UploadImage onClose={closeOpenedDropdown} setFile={setFile} />
              )}
            </Dropdown>

            <SpacerRow size={2} />
            <View style={{ flex: 1 }}>
              {!!replyTo?.message && (
                <View
                  style={{
                    backgroundColor: neutral33,
                    padding: layout.spacing_x1,
                    marginLeft: layout.spacing_x3,
                    borderRadius: 10,
                    maxWidth: 400,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <BrandText
                    style={[fontSemibold12, { color: "white", maxWidth: 300 }]}
                    numberOfLines={1}
                  >
                    Reply to: {replyTo?.message}
                  </BrandText>
                  <TouchableOpacity
                    onPress={() => {
                      setReplyTo(undefined);
                    }}
                    activeOpacity={0.9}
                  >
                    <SVG source={closeSVG} />
                  </TouchableOpacity>
                </View>
              )}
              <TextInputCustom
                fullWidth
                setRef={setInputRef}
                autoFocus={Platform.OS === "web"}
                height={Math.max(50, Math.min(inputHeight - 50, 120))}
                name="message"
                placeHolder={
                  replyTo?.message ? "Add reply message" : "Add a Message"
                }
                multiline
                numberOfLines={6}
                value={message}
                onChangeText={setMessage}
                label=""
                hideLabel
                blurOnSubmit={false}
                textInputStyle={{
                  height: Math.max(30, Math.min(inputHeight - 30, 100)),
                }}
                onSubmitEditing={() => {
                  if (message.length) {
                    handleSend();
                  }
                }}
                onContentSizeChange={(event) => {
                  setInputHeight(event.nativeEvent.contentSize.height);
                }}
                onKeyPress={(e) => {
                  //@ts-ignore
                  if (
                    Platform.OS === "web" &&
                    e.nativeEvent.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    if (message.length) {
                      handleSend();
                    }
                  }
                }}
              >
                <TouchableOpacity onPress={handleSend}>
                  <SVG source={sent} />
                </TouchableOpacity>
              </TextInputCustom>
            </View>
          </View>
        )}
        {!!file && (
          <UploadedPreview
            setFile={setFile}
            file={file}
            handleSend={handleSend}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export const ChatSectionScreen: ScreenFC<"ChatSection"> = () => {
  const { params } = useAppRoute();
  const { navigate } = useAppNavigation();
  return (
    <ScreenContainer
      noScroll
      fullWidth
      noMargin
      onBackPress={() => navigate("Message")}
      footerChildren={<></>}
    >
      <ChatSection conversation={params as IConversation} />
    </ScreenContainer>
  );
};
