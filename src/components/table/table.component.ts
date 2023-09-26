import { Component, Input, OnInit } from '@angular/core';
import { BankInfo } from 'src/models/models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() banks: BankInfo[];

  constructor() {}

  ngOnInit(): void {}
}
