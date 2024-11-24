export class CurrencyInfo {
  constructor(
    public image: string,
    public market_cap_rank: number,
    public name: string,
    public symbol: string,
    public current_price: number,
    public price_change_percentage_24h: number,
    public total_volume: number,
    public market_cap: number,
    public is_watchlist_elem: boolean
  ) {}
}
