import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';
import { ContactsDetailComponent }  from './contacts-detail/contacts-detail.component';
import { ContactsComponent }      from './contacts/contacts.component';
import { ContactsSearchComponent }  from './contacts-search/contacts-search.component';
import { MessagesComponent }    from './messages/messages.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    ContactsComponent,
    ContactsDetailComponent,
    MessagesComponent,
    ContactsSearchComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
