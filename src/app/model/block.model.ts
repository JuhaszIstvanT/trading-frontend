export class Block {
  constructor(
    public id: number,
    public timeStamp: string,
    public height: number,
    public transactions: any[]
  ) {}
}
