import React from "react";
import { TextInput, View } from "react-native";
import { BrandText } from "../../BrandText";
import { fontSemibold14, fontSemibold16, fontSemibold20, fontSemibold28 } from "../../../utils/style/fonts";
import { neutral33, neutral77, neutralA3 } from "../../../utils/style/colors";

export const PersonalInfoPanel: React.FC = () => {
  return (
    <View style={{ flexDirection: "column" }}>
      <View style={{ flexDirection: "column" }}>
        <BrandText style={[fontSemibold28]}>Personal Info</BrandText>
        <BrandText style={[fontSemibold16, { color: neutral77, marginTop: 10 }]}>
          Tell us a bit about yourself. This information will appear on your public profile, so that potential buyers can get to know your better.
        </BrandText>
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: neutral33,
            marginTop: 24,
            marginBottom: 24,
          }}
        />
      </View>
      <View style={{ flexDirection: "column" }}>
        <View style={{ flexDirection: "row" }}>
          <BrandText style={[fontSemibold20, { width: 200 }]}>Full Name</BrandText>
          <View style={{ flexGrow: 1, flexDirection: "row" }}>
            <View style={{ flexDirection: "column" }}>
              <BrandText style={[fontSemibold14, { color: neutralA3 }]}>First Name *</BrandText>
              <TextInput style={[fontSemibold14, { marginTop: 15, borderColor: neutral33, borderRadius: 12, borderWidth: 1, width: 296, color: neutral77, paddingVertical: 16, paddingLeft: 16 }]}
                placeholder={"Type your first name here"}
              ></TextInput>
            </View>
            <View style={{ flexDirection: "column", marginLeft: 15 }}>
              <BrandText style={[fontSemibold14, { color: neutralA3 }]}>Last Name *</BrandText>
              <TextInput style={[fontSemibold14, { marginTop: 15, borderColor: neutral33, borderRadius: 12, borderWidth: 1, width: 296, color: neutral77, paddingVertical: 16, paddingLeft: 16 }]}
                placeholder={"Type your last name here"}
              ></TextInput>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <BrandText style={[fontSemibold20, { width: 200 }]}>Profile Picture</BrandText>
          <View>
            <View style={{ borderRadius: 12, borderColor: neutral33, borderWidth: 1, width: 242, height: 242 }}></View>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          <BrandText style={[fontSemibold20, { width: 200 }]}>Description</BrandText>
          <TextInput style={[fontSemibold14, { marginTop: 15, borderColor: neutral33, borderRadius: 12, height: 144, borderWidth: 1, width: 612, color: neutral77, paddingVertical: 16, paddingLeft: 16 }]}
            placeholder={"Type your last name here"} multiline={true}>
          </TextInput>
        </View>
      </View>

    </View>
  )
}
