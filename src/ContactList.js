import fs from "fs";
import util from "util";
import path from "path";

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

export class Contact {
  constructor(obj) {
    this.name = obj.name;
    this.age = obj.age;
    this.id = obj.id;
  }

  addPhone(number) {
    return (this.phoneNumber = number);
  }
  call() {
    if (this.phoneNumber)
      console.log("Calling " + this.name + " at " + this.phoneNumber);
    else console.log(this.name + " has no phone number saved.");
  }
  birthday() {
    console.log(
      "Wishing " + this.name + " a happy " + (this.age + 1) + "th birthday!"
    );
  }
}

export class ContactList {
  constructor(filename) {
    this.list = [];
    this.filename = filename;
    this.load();
  }

  addContact(contact) {
    if (contact instanceof Contact) {
      this.list.push(contact);
      console.log("this.list", this.list);
      return this.save(this.list);
    }
  }
  findIndex(contactId) {
    const ids = this.list.map(item => {
      return item.id;
    });
    console.log(ids);
    return ids.indexOf(contactId);
  }
  updateContact(contactId, contactToUpdate) {
    console.log("------- List before update");
    console.log(this.list);
	const updateId = this.findIndex(contactId);
	// console.log(contactToUpdate);
	//   console.log(this.list[updateId]);
    if (updateId !== -1) {
	  this.list[updateId] = contactToUpdate;	  
      console.log("------- List after update -----------");
	  console.log(this.list);
	  this.save(this.list)
	  return this.list;

    } else {
	  console.log("Item with ID not found");
	  return "Item with ID not found";
    }
  }
  deleteContact(contactId) {
    //		console.log(contactId);
    console.log("------- List before Delete");
    const deleteId = this.findIndex(contactId);
    console.log(deleteId);
    if (deleteId !== -1) {
      this.list.splice(deleteId, 1);
      console.log("------- List after delete -----------");
	  console.log(this.list);
	  this.save(this.list);
	  return this.list;
    } else {
	  console.log("Item with ID not found");
	  return "Item with ID not found";
	}
  }

  save(list) {
    return writeFile(
      path.resolve(__dirname, this.filename),
      JSON.stringify(list),
      "utf8"
    ).then(() => {
      return list;
    });
  }

  load() {
    const readFilePromise = readFile(
      path.resolve(__dirname, this.filename),
      "utf8"
    );

    return readFilePromise.then(fileString => {
      this.list = JSON.parse(fileString).map(
        contactObj => new Contact(contactObj)
      );

      return Promise.resolve(null);
    });
    // return new Promise((resolve, reject) => {
    // 	readFilePromise
    // 	.then(fileString => {
    // 		this.list = JSON.parse(fileString)
    // 		.map(contactObj => new Contact(contactObj));

    // 		resolve(null);
    // 	});
    // });
  }
}
