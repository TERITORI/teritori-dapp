find `NftContract_filter` and `Nft_filter`

delete `Nfts_ Nft_filter `json:"nfts_"``

and 
```
// GetNfts_ returns NftContract_filter.Nfts_, and is useful for accessing the field via an interface.
func (v *NftContract_filter) GetNfts_() Nft_filter { return v.Nfts_ }
```

Add `omitempty` to all fields for NftContract_filter and Nft_filter