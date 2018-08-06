import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContactsComponent }      from './contacts/contacts.component';
import { ContactsDetailComponent }  from './contacts-detail/contacts-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'contacts', pathMatch: 'full' },
  { path: 'detail/:id', component: ContactsDetailComponent },
  { path: 'contacts', component: ContactsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
