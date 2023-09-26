import { Component, OnInit } from '@angular/core';
import { banks, connections } from 'src/data/data';
import { BankInfo, Connection } from 'src/models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Информация по держателям';
  bankNodes: BankInfo[] = banks;
  bankLinks: Connection[] = connections;

  ngOnInit(): void {}
}
