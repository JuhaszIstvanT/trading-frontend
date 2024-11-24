export class Trade {
  constructor(
    public id: number,
    public buyPrice: number,
    public buyCurrency: string,
    public sellPrice: number,
    public sellCurrency: string,
    public symbol: string,
    public name: string,
    public amount: number,
    public timestamp: string,
    public isSold: boolean,
    public limitOrderPrice: number,
    public stopLossOrderPrice: number,
    public limitOrderActive: boolean,
    public stopLossOrderActive: boolean
  ) {}
}
