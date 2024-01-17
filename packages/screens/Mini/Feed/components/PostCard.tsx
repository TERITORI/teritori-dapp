import { View, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import commentSVG from "../../../../../assets/icons/social/comments-gray.svg";
import reactionSVG from "../../../../../assets/icons/social/happy-gray.svg";
import transferSVG from "../../../../../assets/icons/social/transfer-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { SpacerColumn, SpacerRow } from "../../../../components/spacer";
import { blueDefault, neutralA3 } from "../../../../utils/style/colors";
import {
  fontMedium14,
  fontMedium15,
  fontSemibold14,
  fontSemibold16,
} from "../../../../utils/style/fonts";
import CircularImgOrIcon from "../../components/CircularImgOrIcon";

type UserType = {
  img: string;
  name: string;
  username: string;
};

export type PostType = {
  id: string;
  user: UserType;
  postedAt: string;
  content: ContentType[];
  comments: number;
  reaction: boolean;
  transfer: number;
};

export default function PostCard({ post }: { post: PostType }) {
  return (
    <View style={{ height: "auto" }}>
      <CardHeader user={{ ...post.user, postedAt: post.postedAt }} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={post.content}
        keyExtractor={(item) => item.type}
        renderItem={({ item, index }) => (
          <>
            <SpacerColumn size={1.2} />
            <CardContent content={item} />
          </>
        )}
      />
      <SpacerColumn size={2} />
      <CardFooter
        comments={post.comments}
        reaction={post.reaction}
        transfer={post.transfer}
      />
    </View>
  );
}

type UserHeaderType = {
  img: string;
  name: string;
  username: string;
  postedAt: string;
};

type CardHeaderProps = {
  user: UserHeaderType;
};

function CardHeader({ user }: CardHeaderProps) {
  const { img, name, username, postedAt } = user;

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 36,
        }}
      >
        <CircularImgOrIcon
          enableFullIcon
          style={{ alignItems: "center", justifyContent: "center" }}
          size={38}
          icon={
            img
              ? img
              : require("../../../../../assets/default-images/profile.png")
          }
        />
        <SpacerRow size={1.5} />
        <BrandText style={fontSemibold16}>{name}</BrandText>
        <SpacerRow size={1} />
        <BrandText style={[fontMedium14, { color: neutralA3 }]}>
          @ {username}
        </BrandText>
        <SpacerRow size={1} />
        <BrandText style={[fontMedium14, { color: neutralA3 }]}>.</BrandText>
        <SpacerRow size={1} />
        <BrandText style={[fontMedium14, { color: neutralA3 }]}>
          {postedAt}
        </BrandText>
      </View>
    </>
  );
}

type ContentType = {
  type: "img" | "text" | "video";
  value: string | { text: string; mentions: string[] };
};

function CardContent({ content }: { content: ContentType }) {
  if (content.type === "text") {
    return (
      <View style={{ flex: 1, height: "auto" }}>
        <SpacerColumn size={0.5} />

        {typeof content.value === "string" ? (
          <BrandText style={fontMedium15}>{content.value}</BrandText>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <BrandText style={fontMedium15}>{content.value.text}</BrandText>
            {content?.value?.mentions.map((mention) => (
              <>
                <SpacerRow size={1} />
                <BrandText style={[fontMedium15, { color: blueDefault }]}>
                  #{mention}
                </BrandText>
              </>
            ))}
          </View>
        )}
      </View>
    );
  }

  if (content.type === "img") {
    return (
      <>
        <View style={{ width: "100%", height: 200, borderRadius: 12 }}>
          <Image
            source={{
              uri: typeof content.value === "string" ? content.value : "",
            }}
            style={{ width: "100%", height: "100%", borderRadius: 12 }}
          />
        </View>
      </>
    );
  }

  return null;
}

type CardFooterProps = {
  comments: number;
  reaction: boolean;
  transfer: number;
};

function CardFooter({ comments, reaction, transfer }: CardFooterProps) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SVG source={commentSVG} width={20} height={20} />
        <SpacerRow size={0.5} />
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          {comments.toString()}
        </BrandText>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SVG source={reactionSVG} width={20} height={20} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <SVG source={transferSVG} width={23} height={23} />
        <SpacerRow size={0.5} />
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          {transfer.toString()}
        </BrandText>
      </View>
    </View>
  );
}
