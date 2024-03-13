with mint_agg as (
  SELECT
    m.buyer_id as id,
    sum(m.usd_price) as usd_sum,
    count(1) as tcount
  FROM
    activities as a
    left join mints as m on a.id = m.activity_id
  where
    a.kind = 'mint'
    and a.time >= now() - interval '1 hour' * @period_hours
    and a.network_id = @network_id
    and a.collection_id in @collections_whitelist
  group by
    m.buyer_id
),
buy_agg as (
  SELECT
    t.buyer_id as id,
    sum(t.usd_price) as usd_sum,
    count(1) as tcount
  FROM
    activities as a
    left join trades as t on a.id = t.activity_id
  where
    a.kind = 'trade'
    and a.time >= now() - interval '1 hour' * @period_hours
    and a.network_id = @network_id
    and a.collection_id in @collections_whitelist
  group by
    t.buyer_id
),
sell_agg as (
  SELECT
    t.seller_id as id,
    sum(t.usd_price) as usd_sum,
    count(1) as tcount
  FROM
    activities as a
    left join trades as t on a.id = t.activity_id
  where
    a.kind = 'trade'
    and a.time >= now() - interval '1 hour' * @period_hours
    and a.network_id = @network_id
    and a.collection_id in @collections_whitelist
  group by
    t.seller_id
),
cancelled as (
  select
    n.id
  from
    nfts n
    right join activities a on a.nft_id = n.id
    and a.time >= now() - interval '30 DAY'
    and a.kind in (
      'trade',
      'transfer',
      'mint',
      'send-nft',
      'transfer-nft',
      'send-nft',
      'burn'
    )
  where
    n.collection_id in @riot_collections
  group by
    n.id
),
riot_holders as (
  select
    distinct n.owner_id as id
  from
    nfts n
    left join cancelled c on c.id = n.id
  where
    c.id is null
    and n.collection_id in @riot_collections
),
totals as (
  select
    coalesce(m.id, b.id, s.id, x.id) user_id,
    coalesce (m.usd_sum, 0) as mint_usd_sum,
    coalesce (m.tcount, 0) as mint_count,
    coalesce (b.usd_sum, 0) as buy_usd_sum,
    coalesce (b.tcount, 0) as buy_count,
    coalesce (s.usd_sum, 0) as sell_usd_sum,
    coalesce (s.tcount, 0) as sell_count,
    case
      when x.id is not null then 2
      else 1
    end as boost,
    coalesce (m.usd_sum, 0) + coalesce (b.usd_sum, 0) + coalesce (s.usd_sum, 0) as total_usd_sum
  from
    mint_agg m
    full outer join buy_agg b on m.id = b.id
    full outer join sell_agg s on coalesce(m.id, b.id) = s.id
    full outer join riot_holders x on coalesce(m.id, b.id, s.id) = x.id
)
select
  *,
  totals.total_usd_sum * totals.boost xp,
  row_number() over(
    order by
      totals.total_usd_sum * totals.boost desc
  ) rank
from
  totals
order by
  xp desc
limit
  @limit
offset
  @offset
