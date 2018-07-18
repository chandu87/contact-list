import express from "express";
import { Contact, ContactList } from "./ContactList";
const app = express();

const myContactList = new ContactList("./my_list.json");
import bodyParser from "body-parser";

app.use(bodyParser.urlencoded({ extended: false }));
//parse appliation JSON
app.use(bodyParser.json());

//GET ROUTE for HOME
app.get("/", function(req, res) {
  res.send("Hello world");
});

//GET ROUTE for Contacts
app.get("/contacts", function(req, res) {
  //----- Checking whether requested query is empty or not -------
  if (!Object.keys(req.query).length) {
    res.send(myContactList.list);
  } else {
    const filteredData = myContactList.list.filter(element => {
      return element.age == req.query.age;
    });
    res.send(filteredData.length == 0 ? "Entered age not found, Try again" : filteredData);
  }
});

//GET ROUTE for sample testing
app.get("/test", function(req, res) {
  res.send({ name: "chandra" });
});

//POST ROUTE for Adding contacts
app.post("/contacts", function(req, res) {
  // console.log(req.body);
  const contact = new Contact(req.body);
  myContactList.addContact(contact).then(list => res.send(list));
});

//PATCH ROUTE for updating contacts which can be found in POSTMAN
app.patch("/contacts/:contact_id", function(req, res) {
    const contactToUpdate = new Contact(req.body);
  res.send(myContactList.updateContact(req.params.contact_id, contactToUpdate));
});

//DELETE ROUTE for deleting a item 
app.delete("/contacts/:contact_id", function(req, res) {
  res.send(myContactList.deleteContact(req.params.contact_id));
});

//Server listening PORT assignment
app.listen(3000, function() {
  console.log("Server started at : 3000");
});
