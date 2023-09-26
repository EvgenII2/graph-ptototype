import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TableComponent } from 'src/components/table/table.component';
import { ViewComponent } from 'src/components/view/view.component';

@NgModule({
  declarations: [AppComponent, TableComponent, ViewComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
