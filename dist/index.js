"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _ContactList = require("./ContactList");

var _methodOverride = require("method-override");

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();


const myContactList = new _ContactList.ContactList("./my_list.json");


app.use(_bodyParser2.default.urlencoded({ extended: false }));
//parse appliation JSON
app.use(_bodyParser2.default.json());
app.set("view engine", "ejs");
app.use((0, _methodOverride2.default)("_method"));

//GET ROUTE for HOME
app.get("/", function (req, res) {
  // res.send("Hello world");
  res.render("index");
});

//GET ROUTE for Contacts
app.get("/contacts", function (req, res) {
  //----- Checking whether requested query is empty or not -------
  if (!Object.keys(req.query).length) {
    // res.send(myContactList.list);
    res.render("contacts", { contacts: myContactList.list });
  } else {
    const filteredData = myContactList.list.filter(element => {
      return element.age == req.query.age;
    });
    res.send(filteredData.length == 0 ? "Entered age not found, Try again" : filteredData);
  }
});

//GET ROUTE for sample testing
app.get("/test", function (req, res) {
  res.send({ name: "chandra" });
});
app.get("/contacts/add", function (req, res) {
  res.render("add");
});
app.get("/contacts/edit", function (req, res) {
  res.render("edit", { contacts: myContactList.list });
});
app.get("/contacts/update/:contact_id", function (req, res) {
  const ids = myContactList.list.map(contact => contact.id);
  const contactId = ids.indexOf(req.params.contact_id);
  const updateContact = myContactList.list[contactId];
  // console.log(contactId);
  // console.log(myContactList.list);
  // console.log(updateContact);
  res.render("update", { updateContact: updateContact });
});
//POST ROUTE for Adding contacts
app.post("/contacts", function (req, res) {
  // console.log(req.body);
  console.log(req.body);
  const contact = new _ContactList.Contact(req.body);
  console.log(contact);
  // myContactList.addContact(contact).then(list => res.send(list));
  myContactList.addContact(contact);
  res.redirect("/contacts");
});

//PATCH ROUTE for updating contacts which can be found in POSTMAN
app.patch("/contacts/:contact_id", function (req, res) {
  const contactToUpdate = new _ContactList.Contact(req.body);
  myContactList.updateContact(req.params.contact_id, contactToUpdate);
  res.redirect("/contacts");
});

//DELETE ROUTE for deleting a item 
app.delete("/contacts/:contact_id", function (req, res) {
  //res.send(myContactList.deleteContact(req.params.contact_id));
  myContactList.deleteContact(req.params.contact_id);
  res.redirect("/contacts");
});

//Server listening PORT assignment
app.listen(3000, function () {
  console.log("Server started at : 3000");
});
//# sourceMappingURL=index.js.map