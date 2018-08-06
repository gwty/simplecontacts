'use strict'; // necessary for es6 output in node

import { browser, element, by, ElementFinder, ElementArrayFinder } from 'protractor';
import { promise } from 'selenium-webdriver';

const expectedH1 = 'Contacts';
const expectedTitle = `${expectedH1}`;
const targetContacts = { id: 15, name: 'Magneta' };
const targetContactsDashboardIndex = 3;
const nameSuffix = 'X';
const newContactsName = targetContacts.name + nameSuffix;

class Contacts {
  id: number;
  first_name: string;

  // Factory methods

  // Contacts from string formatted as '<id> <name>'.
  static fromString(s: string): Contacts {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      first_name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // Contacts from contact list <li> element.
  static async fromLi(li: ElementFinder): Promise<Contacts> {
      let stringsFromA = await li.all(by.css('a')).getText();
      let strings = stringsFromA[0].split(' ');
      return { id: +strings[0], first_name: strings[1] };
  }

  // Contacts id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<Contacts> {
    // Get contact id from the first <div>
    let _id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    let _name = await detail.element(by.css('h2')).getText();
    return {
        id: +_id.substr(_id.indexOf(' ') + 1),
        first_name: _first_name.substr(0, _first_name.lastIndexOf(' '))
    };
  }
}

describe('Tutorial part 6', () => {

  beforeAll(() => browser.get(''));

  function getPageElts() {
    let navElts = element.all(by.css('app-root nav a'));

    return {
      navElts: navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topContacts: element.all(by.css('app-root app-dashboard > div h4')),

      appContactsHref: navElts.get(1),
      appContacts: element(by.css('app-root app-contacts')),
      allContacts: element.all(by.css('app-root app-contacts li')),
      selectedContactsSubview: element(by.css('app-root app-contacts > div:last-child')),

      contactDetail: element(by.css('app-root app-contacts-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  describe('Initial page', () => {

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Contacts'];
    it(`has views ${expectedViewNames}`, () => {
      let viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      let page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });

  });

  describe('Dashboard tests', () => {

    beforeAll(() => browser.get(''));

    it('has top contacts', () => {
      let page = getPageElts();
      expect(page.topContacts.count()).toEqual(4);
    });

    it(`selects and routes to ${targetContacts.first_name} details`, dashboardSelectTargetContacts);

    it(`updates contact name (${newContactsName}) in details view`, updateContactsNameInDetailView);

    it(`cancels and shows ${targetContacts.first_name} in Dashboard`, () => {
      element(by.buttonText('go back')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetContactsElt = getPageElts().topContacts.get(targetContactsDashboardIndex);
      expect(targetContactsElt.getText()).toEqual(targetContacts.name);
    });

    it(`selects and routes to ${targetContacts.name} details`, dashboardSelectTargetContacts);

    it(`updates contact name (${newContactsName}) in details view`, updateContactsNameInDetailView);

    it(`saves and shows ${newContactsName} in Dashboard`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      let targetContactsElt = getPageElts().topContacts.get(targetContactsDashboardIndex);
      expect(targetContactsElt.getText()).toEqual(newContactsName);
    });

  });

  describe('Contacts tests', () => {

    beforeAll(() => browser.get(''));

    it('can switch to Contacts view', () => {
      getPageElts().appContactsHref.click();
      let page = getPageElts();
      expect(page.appContacts.isPresent()).toBeTruthy();
      expect(page.allContacts.count()).toEqual(10, 'number of contacts');
    });

    it('can route to contact details', async () => {
      getContactsLiEltById(targetContacts.id).click();

      let page = getPageElts();
      expect(page.contactDetail.isPresent()).toBeTruthy('shows contact detail');
      let contact = await Contacts.fromDetail(page.contactDetail);
      expect(contact.id).toEqual(targetContacts.id);
      expect(contact.first_name).toEqual(targetContacts.first_name.toUpperCase());
    });

    it(`updates contact name (${newContactsName}) in details view`, updateContactsNameInDetailView);

    it(`shows ${newContactsName} in Contacts list`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();
      let expectedText = `${targetContacts.id} ${newContactsName}`;
      expect(getContactsAEltById(targetContacts.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newContactsName} from Contacts list`, async () => {
      const contactsBefore = await toContactsArray(getPageElts().allContacts);
      const li = getContactsLiEltById(targetContacts.id);
      li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(page.appContacts.isPresent()).toBeTruthy();
      expect(page.allContacts.count()).toEqual(9, 'number of contacts');
      const contactsAfter = await toContactsArray(page.allContacts);
      // console.log(await Contacts.fromLi(page.allContacts[0]));
      const expectedContacts =  contactsBefore.filter(h => h.first_name !== newContactsName);
      expect(contactsAfter).toEqual(expectedContacts);
      // expect(page.selectedContactsSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetContacts.first_name}`, async () => {
      const newContactsName = 'Alice';
      const contactsBefore = await toContactsArray(getPageElts().allContacts);
      const numContacts = contactsBefore.length;

      element(by.css('input')).sendKeys(newContactsName);
      element(by.buttonText('add')).click();

      let page = getPageElts();
      let contactsAfter = await toContactsArray(page.allContacts);
      expect(contactsAfter.length).toEqual(numContacts + 1, 'number of contacts');

      expect(contactsAfter.slice(0, numContacts)).toEqual(contactsBefore, 'Old contacts are still there');

      const maxId = contactsBefore[contactsBefore.length - 1].id;
      expect(contactsAfter[numContacts]).toEqual({id: maxId + 1, first_name: newContactsName});
    });

    it('displays correctly styled buttons', async () => {
      element.all(by.buttonText('x')).then(buttons => {
        for (const button of buttons) {
          // Inherited styles from styles.css
          expect(button.getCssValue('font-family')).toBe('Arial');
          expect(button.getCssValue('border')).toContain('none');
          expect(button.getCssValue('padding')).toBe('5px 10px');
          expect(button.getCssValue('border-radius')).toBe('4px');
          // Styles defined in contacts.component.css
          expect(button.getCssValue('left')).toBe('194px');
          expect(button.getCssValue('top')).toBe('-32px');
        }
      });

      const addButton = element(by.buttonText('add'));
      // Inherited styles from styles.css
      expect(addButton.getCssValue('font-family')).toBe('Arial');
      expect(addButton.getCssValue('border')).toContain('none');
      expect(addButton.getCssValue('padding')).toBe('5px 10px');
      expect(addButton.getCssValue('border-radius')).toBe('4px');
    });

  });

  describe('Progressive contact search', () => {

    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      getPageElts().searchBox.sendKeys('Ma');
      browser.sleep(1000);

      expect(getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      getPageElts().searchBox.sendKeys('g');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetContacts.first_name}`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      let page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      let contact = page.searchResults.get(0);
      expect(contact.getText()).toEqual(targetContacts.first_name);
    });

    it(`navigates to ${targetContacts.first_name} details view`, async () => {
      let contact = getPageElts().searchResults.get(0);
      expect(contact.getText()).toEqual(targetContacts.first_name);
      contact.click();

      let page = getPageElts();
      expect(page.contactDetail.isPresent()).toBeTruthy('shows contact detail');
      let contact2 = await Contacts.fromDetail(page.contactDetail);
      expect(contact2.id).toEqual(targetContacts.id);
      expect(contact2.first_name).toEqual(targetContacts.first_name.toUpperCase());
    });
  });

  async function dashboardSelectTargetContacts() {
    let targetContactsElt = getPageElts().topContacts.get(targetContactsDashboardIndex);
    expect(targetContactsElt.getText()).toEqual(targetContacts.first_name);
    targetContactsElt.click();
    browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    let page = getPageElts();
    expect(page.contactDetail.isPresent()).toBeTruthy('shows contact detail');
    let contact = await Contacts.fromDetail(page.contactDetail);
    expect(contact.id).toEqual(targetContacts.id);
    expect(contact.first_name).toEqual(targetContacts.first_name.toUpperCase());
  }

  async function updateContactsNameInDetailView() {
    // Assumes that the current view is the contact details view.
    addToContactsName(nameSuffix);

    let page = getPageElts();
    let contact = await Contacts.fromDetail(page.contactDetail);
    expect(contact.id).toEqual(targetContacts.id);
    expect(contact.first_name).toEqual(newContactsName.toUpperCase());
  }

});

function addToContactsName(text: string): promise.Promise<void> {
  let input = element(by.css('input'));
  return input.sendKeys(text);
}

function expectHeading(hLevel: number, expectedText: string): void {
    let hTag = `h${hLevel}`;
    let hText = element(by.css(hTag)).getText();
    expect(hText).toEqual(expectedText, hTag);
};

function getContactsAEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('..'));
}

function getContactsLiEltById(id: number): ElementFinder {
  let spanForId = element(by.cssContainingText('li span.badge', id.toString()));
  return spanForId.element(by.xpath('../..'));
}

async function toContactsArray(allContacts: ElementArrayFinder): Promise<Contacts[]> {
  let promisedContacts = await allContacts.map(Contacts.fromLi);
  // The cast is necessary to get around issuing with the signature of Promise.all()
  return <Promise<any>> Promise.all(promisedContacts);
}
