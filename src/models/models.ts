export class BankInfo {
  id: string;
  name: string;
  shareholders: Shareholder[];

  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.shareholders = [];
  }

  getShareholdersCompanyId() {
    return this.shareholders.map((shareholder) => shareholder.companyId);
  }

  setShareholders(shareholders: Shareholder[]) {
    this.shareholders = shareholders;
  }

  addShareholders(shareholder: Shareholder) {
    this.shareholders.push(shareholder);
  }
}

export interface Shareholder {
  companyId: string;
  companyName: string;
  shareInProcent: number;
}

export interface Connection {
  source: string;
  target: string;
  value: number;
}
