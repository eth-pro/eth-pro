export default class Tx {
  constructor() {
    this.block = 0
    this.method = ''
    this.amount = 0
    this.timestamp = 0
    this.status = 0
    this.fee = 0
    this.hash = ''
    this.confirm_block = ''
    this.from = ''
    this.to = ''
    this.contract = ''
  }
}