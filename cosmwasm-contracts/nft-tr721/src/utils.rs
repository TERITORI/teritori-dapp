use cw2981_royalties::Metadata;

fn concat_str(fields: &mut Vec<String>, name: &str, val: String) {
    if val != "" {
        fields.push(format!("{name}:\"{val}\""));
    }
}

fn concat_u64(fields: &mut Vec<String>, name: &str, val: u64) {
    if val != 0 {
        fields.push(format!("{name}:{val}"));
    }
}

// Serialize metadata with the same format as Metadata.String() from Go
const SEPARATOR: &str = " ";
pub fn serialize_metadata(data: &Metadata) -> String {
    let image = data.clone().image.unwrap_or_default();
    let image_data = data.clone().image_data.unwrap_or_default();
    let external_url = data.clone().external_url.unwrap_or_default();
    let description = data.clone().description.unwrap_or_default();
    let name = data.clone().name.unwrap_or_default();
    let background_color = data.clone().background_color.unwrap_or_default();
    let animation_url = data.clone().animation_url.unwrap_or_default();
    let youtube_url = data.clone().youtube_url.unwrap_or_default();
    let royalty_percentage = data.clone().royalty_percentage.unwrap_or_default();
    let royalty_payment_address = data.clone().royalty_payment_address.unwrap_or_default();
    let attributes = data.clone().attributes.unwrap_or_default();

    let mut fields: Vec<String> = vec![];
    concat_str(&mut fields, "image", image);
    concat_str(&mut fields, "image_data", image_data);
    concat_str(&mut fields, "external_url", external_url);
    concat_str(&mut fields, "description", description);
    concat_str(&mut fields, "name", name);

    if data.clone().attributes.unwrap_or_default().len() > 0 {
        let mut attrs: Vec<String> = vec![];
        for attr in attributes {
            let trait_type = attr.trait_type;
            let value = attr.value;
            attrs.push(format!(
                "attributes:{{trait_type:\"{trait_type}\"{SEPARATOR}value:\"{value}\"}}"
            ));
        }

        fields.push(attrs.join(SEPARATOR));
    }

    concat_str(&mut fields, "background_color", background_color);
    concat_str(&mut fields, "animation_url", animation_url);
    concat_str(&mut fields, "youtube_url", youtube_url);
    concat_u64(&mut fields, "royalty_percentage", royalty_percentage);

    concat_str(
        &mut fields,
        "royalty_payment_address",
        royalty_payment_address,
    );

    fields.join(SEPARATOR)
}
