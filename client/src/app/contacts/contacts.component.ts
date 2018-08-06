import { Component, OnInit } from '@angular/core';

import { Contacts } from '../contacts';
import { ContactsService } from '../contacts.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})

export class ContactsComponent implements OnInit {
  contacts: Contacts[];

  constructor(private contactsService: ContactsService) { }

  ngOnInit() {
    this.getContacts();
  }

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  
  getContacts(): void {
    this.contactsService.getContacts()
    .subscribe(contacts => this.contacts = contacts);
  }

  archive(contacts: Contacts): void {
    this.contactsService.archiveContacts(contacts).subscribe();
    this.contacts = this.contacts.filter(h => h !== contacts);    
  }
  
  delete(contacts: Contacts): void {
    this.contactsService.deleteContacts(contacts).subscribe();
    this.contacts = this.contacts.filter(h => h !== contacts);    
  }
  
  add(name: string, phone:string, email:string): string {
    var names = name.split(" ");
    var first_name = names[0];
    if (name[1])
    var last_name = names[1];
    else var last_name = ''
    var phone_number = phone;
    var status = true;
    if (!name) { return; }
    
    var newContact = new Contacts;
    var newContactfromServer;
    newContact.first_name = names[0];
    newContact.last_name = names[1];
    newContact.phone_number = phone_number;
    newContact.email = email;
    newContact.status = true;
    this.contactsService.addContacts(newContact).subscribe(contacts => newContact = contacts);
    this.contacts.push(newContact);
    }
}
