with mint_agg as (
  SELECT
    a.collection_id,
    sum(m.usd_price) as mint_usd_sum,
    count(1) as mint_count
  FROM
    activities as a
    left join mints as m on a.id = m.activity_id
  where
    a.kind = 'mint'
    and a.time >= now() - interval '1 hour' * @period_hours
  group by
    a.collection_id
),
mint_agg_prev as (
  SELECT
    a.collection_id,
    sum(m.usd_price) as mint_usd_sum,
    count(1) as mint_count
  FROM
    activities as a
    left join mints as m on a.id = m.activity_id
  where
    a.kind = 'mint'
    and a.time < now() - interval '1 hour' * @period_hours
    and a.time >= now() - interval '1 hour' * 2 * @period_hours
  group by
    a.collection_id
),
trade_agg as (
  SELECT
    a.collection_id,
    sum(t.usd_price) as trade_usd_sum,
    count(1) as trade_count
  from
    activities as a
    left join trades as t on a.id = t.activity_id
  where
    a.kind = 'trade'
    and a.time >= now() - interval '1 hour' * @period_hours
  group by
    a.collection_id
),
trade_agg_prev as (
  SELECT
    a.collection_id,
    sum(t.usd_price) as trade_usd_sum,
    count(1) as trade_count
  from
    activities as a
    left join trades as t on a.id = t.activity_id
  where
    a.kind = 'trade'
    and a.time < now() - interval '1 hour' * @period_hours
    and a.time >= now() - interval '1 hour' * 2 * @period_hours
  group by
    a.collection_id
),
mint_denom_agg as (
  SELECT
    a.collection_id,
    sum(coalesce (nullif(m.price, ''), '0')::bigint) as mint_denom_sum,
    count(1) as mint_denom_count,
    m.price_denom mint_denom
  FROM
    activities as a
    left join mints as m on a.id = m.activity_id
  where
    a.kind = 'mint'
    and a.time >= now() - interval '1 hour' * @period_hours
  group by
    (a.collection_id, m.price_denom)
),
trade_denom_agg as (
  SELECT
    a.collection_id,
    sum(coalesce (nullif(t.price, ''), '0')::bigint) as trade_denom_sum,
    count(1) as trade_denom_count,
    t.price_denom trade_denom
  FROM
    activities as a
    left join trades as t on a.id = t.activity_id
  where
    a.kind = 'trade'
    and a.time >= now() - interval '1 hour' * @period_hours
  group by
    (a.collection_id, t.price_denom)
),
nft_counts as (
  select
    n.collection_id,
    count(1) as c,
    count(distinct n.owner_id) as oc
  from
    nfts n
  where
    burnt = false
  group by
    n.collection_id
),
floor_prices as (
  select
    n.collection_id,
    min(n.price_amount) as amount,
    n.price_denom as denom
  from
    nfts n
  where
    nullif(n.price_denom, '') is not null
    and burnt = false
  group by
    (n.collection_id, n.price_denom)
),
by_denom as (
  select
    c.id,
    to_json(array_agg(distinct (fp.denom, fp.amount::text)) filter (
      where
        nullif(fp.denom, '') is not null
    )) as floor_prices,
    to_json(array_agg(
      distinct (
        tda.trade_denom,
        tda.trade_denom_sum::text,
        tda.trade_denom_count
      )
    ) filter (
      where
        nullif(tda.trade_denom, '') is not null
    )) as trade_denom_sums,
    to_json((array_agg(
      distinct (
        mda.mint_denom,
        mda.mint_denom_sum::text,
        mda.mint_denom_count
      )
    ) filter (
      where
        nullif(mda.mint_denom, '') is not null
    ))) as mint_denom_sums
  from
    mint_denom_agg mda
    full outer join trade_denom_agg tda on tda.collection_id = mda.collection_id
    full outer join floor_prices fp on fp.collection_id = coalesce(mda.collection_id, tda.collection_id)
    left join collections c on c.id = coalesce(mda.collection_id, tda.collection_id, fp.collection_id)
  group by
    c.id
)
select
  c.id id,
  c.name name,
  c.image_uri image_uri,
  c.max_supply max_supply,
  bd.floor_prices floor_prices,
  bd.trade_denom_sums trade_denom_sums,
  bd.mint_denom_sums mint_denom_sums,
  coalesce (nc.c, 0) as nfts_count,
  coalesce (nc.oc, 0) as owners_count,
  coalesce (ma.mint_count, 0) mint_count,
  coalesce (maprev.mint_count, 0) prev_mint_count,
  coalesce (ta.trade_count, 0) trade_count,
  coalesce (taprev.trade_count, 0) prev_trade_count,
  coalesce (ma.mint_usd_sum, 0) mint_sum,
  coalesce (maprev.mint_usd_sum, 0) prev_mint_sum,
  coalesce (ta.trade_usd_sum, 0) trade_sum,
  coalesce (taprev.trade_usd_sum, 0) prev_trade_sum,
  coalesce (ma.mint_usd_sum, 0) + coalesce (ta.trade_usd_sum, 0) total_sum,
  row_number() over(
    order by
      coalesce (ma.mint_usd_sum, 0) + coalesce (ta.trade_usd_sum, 0) desc,
      c.time asc
  ) rank
from
  collections c
  left join nft_counts as nc on nc.collection_id = c.id
  left join mint_agg ma on ma.collection_id = c.id
  left join mint_agg_prev maprev on maprev.collection_id = c.id
  left join trade_agg ta on ta.collection_id = c.id
  left join trade_agg_prev taprev on taprev.collection_id = c.id
  left join by_denom bd on bd.id = c.id
where
  c.id in @collections_whitelist
  and c.network_id = @network_id
order by
  total_sum desc,
  c.time asc
limit
  @limit
offset
  @offset
