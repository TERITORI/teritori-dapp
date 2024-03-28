use cw2981_royalties::Metadata;

use apipb::launchpadpb;
use prost::Message;

pub fn proto_encode(data: &Metadata) -> Vec<u8> {
    let metadata_pb = launchpadpb::Metadata {
        image: data.image.clone(),
        image_data: data.image_data.clone(),
        external_url: data.external_url.clone(),
        description: data.description.clone(),
        name: data.name.clone(),
        attributes: data
            .attributes
            .clone()
            .unwrap_or_default()
            .iter()
            .map(|item| launchpadpb::Trait {
                display_type: item.display_type.clone(),
                trait_type: item.trait_type.clone(),
                value: item.value.clone(),
            })
            .collect(),
        background_color: data.background_color.clone(),
        animation_url: data.animation_url.clone(),
        youtube_url: data.youtube_url.clone(),
        royalty_percentage: data.royalty_percentage,
        royalty_payment_address: data.royalty_payment_address.clone(),
    };

    metadata_pb.encode_to_vec()
}
