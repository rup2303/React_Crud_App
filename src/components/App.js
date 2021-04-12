import React, { useState, useEffect } from "react";
import { uuid } from "uuidv4";
import "./App.css";
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import Header from "./Header";
import AddContact from "./AddContact";
import ContactList from "./ContactList";
import api from "../api/contacts";
import EditContact from "./EditContact";
import ContactDetail from "./ContactDetail";

function App() {
  
  const [contacts, setContacts] = useState([]);

 //Retrieve contscts
 const retrieveContacts=async ()=>{
   const response=await api.get('/contacts');
   return response.data;
 }


 //add contact
  const addContactHandler =async (contact) => {
    console.log(contact);
    const request={
      id:uuid(),
        ...contact
    }
    const response=await api.post("/contacts",request)
    setContacts([...contacts, response.data]);
  };


  //delete contact
  const removeContactHandler =async (id) => {
  await api.delete(`/contacts/${id}`);
    const newContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(newContactList);
  };

  //update contact
  const updateContactHandler=async (contact)=>{
const response=await api.put(`/contacts/${contact.id}`,contact)
const {id,name,email}=response.data;
setContacts(contacts.map((contact)=>{
return contact.id===id?{...response.data}:contact;
})
);
  };

  useEffect(() => {
    const getAllContacts=async()=>{
      const allContacts=await retrieveContacts();
      if(allContacts)setContacts(allContacts)
    };
    getAllContacts();
  }, []);

  
  useEffect(() => {
 
  }, [contacts]);

  return (
    <div className="ui container">
      <Router>
      <Header />
      <Switch>
        <Route 
        path="/"
        exact
        render={(props)=>(
        <ContactList
        {...props}
      contacts={contacts}
      getContactId={removeContactHandler}/>
      )}
    />
   
    <Route 
    path="/add"
    render={(props)=>(
      <AddContact {...props} addContactHandler={addContactHandler}/> 
    )}
    />
    
    <Route 
    path="/edit"
    render={(props)=>(
      <EditContact {...props} updateContactHandler={updateContactHandler}/> 
    )}
    />

    <Route path="/contact/:id" component={ContactDetail}/>
     
     
      
      </Switch>
      </Router>
    </div>
  );
}

export default App;
