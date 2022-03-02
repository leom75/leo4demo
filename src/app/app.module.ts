import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CustomfieldComponent } from './customfield/customfield.component';

@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [AppComponent, CustomfieldComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
