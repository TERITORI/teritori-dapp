use cw2981_royalties::Metadata;

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

    let mut attributes = String::new();

    for attr in data.clone().attributes.unwrap_or_default() {
        let trait_type = attr.trait_type;
        let value = attr.value;
        attributes.push_str(&format!("{trait_type}{value}"));
    }

    format!("{image}|{image_data}|{external_url}|{description}|{name}|{attributes}|{background_color}|{animation_url}|{youtube_url}|{royalty_percentage}|{royalty_payment_address}")
}
