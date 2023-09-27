import { BankInfo, Connection } from 'src/models/models';

export const bankMoscow: BankInfo = new BankInfo('bankMoscow', 'Банк Москвы');
export const bankLondon: BankInfo = new BankInfo('bankLondon', 'Банк Лондона');
export const bankParis: BankInfo = new BankInfo('bankParis', 'Банк Парижа');
export const bankVashington: BankInfo = new BankInfo(
  'bankVashington',
  'Банк Вашингтона'
);
export const bankMadrid: BankInfo = new BankInfo('bankMadrid', 'Банк Мадрида');
export const bankBerlin: BankInfo = new BankInfo('bankBerlin', 'Банк Берлина');
export const bankHelsinki: BankInfo = new BankInfo(
  'bankHelsinki',
  'Банк Хельсинки'
);
export const bankIstanbul: BankInfo = new BankInfo(
  'bankIstanbul',
  'Банк Стамбула'
);
export const bankSaintPeterburg: BankInfo = new BankInfo(
  'bankSaintPeterburg',
  'Банк Санкт-Петербурга'
);
export const bankKazan: BankInfo = new BankInfo('bankKazan', 'Банк Казани');
export const bankOmsk: BankInfo = new BankInfo('bankOmsk', 'Банк Омска');
export const bankTomsk: BankInfo = new BankInfo('bankTomsk', 'Банк Томска');
export const bankMinsk: BankInfo = new BankInfo('bankMinsk', 'Банк Минска');
export const bankKiev: BankInfo = new BankInfo('bankKiev', 'Банк Киева');
export const bankLissabon: BankInfo = new BankInfo(
  'bankLissabon',
  'Банк Лиссабона'
);

export const banks: BankInfo[] = [];
banks.push(bankMoscow);
banks.push(bankLondon);
banks.push(bankParis);
banks.push(bankVashington);
banks.push(bankMadrid);
banks.push(bankBerlin);
banks.push(bankHelsinki);
banks.push(bankIstanbul);
banks.push(bankSaintPeterburg);
banks.push(bankKazan);
banks.push(bankOmsk);
banks.push(bankTomsk);
banks.push(bankMinsk);
banks.push(bankKiev);
banks.push(bankLissabon);

banks.forEach((bank) => {
  const randomCount = Math.floor((Math.random() * banks.length) / 3) + 1;

  for (let i = 0; i < randomCount; i++) {
    const randomBankId = Math.floor(Math.random() * banks.length);
    const randomBank = banks[randomBankId];
    if (
      bank.id !== randomBank.id &&
      !bank.getShareholdersCompanyId().includes(randomBank.id)
    )
      bank.addShareholders({
        companyId: randomBank.id,
        companyName: randomBank.name,
        shareInProcent: Math.floor(Math.random() * 20) + 1,
      });
  }
});

export const connections: Connection[] = [];

banks.forEach((bank) => {
  bank.getShareholdersCompanyId().forEach((id) => {
    connections.push({
      source: bank.id,
      target: id,
      value: 10,
      percents: bank.shareholders.find(
        (findShareholder) => findShareholder.companyId === id
      ).shareInProcent,
    });
  });
});
