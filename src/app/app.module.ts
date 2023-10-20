import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TableComponent } from 'src/components/table/table.component';
import { ViewComponent } from 'src/components/view/view.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, TableComponent, ViewComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
