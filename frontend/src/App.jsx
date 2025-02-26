import { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";

const Filter = ({ searchVal, handleSearchValChange }) => {
  return (
    <>
      <span>filter shown with </span>
      <input type="text" value={searchVal} onChange={handleSearchValChange} />
    </>
  );
};

const PersonForm = ({
  addNameNumber,
  newName,
  newNumber,
  handleNameChange,
  handleNumChange,
}) => {
  return (
    <>
      <form onSubmit={addNameNumber}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

const Notification = ({ message, color, hide }) => {
  const styles = {
    color: color,
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
    display: hide ? "none" : "",
  };

  if (message === null) {
    return null;
  }
  return (
    <div style={styles} className="error">
      {message}
    </div>
  );
};

const Persons = ({ persons, searchVal, handleDelete }) => {
  return (
    <>
      {persons
        .filter(
          (person) =>
            searchVal === "" ||
            person.name.toLowerCase().includes(searchVal.toLowerCase())
        )
        .map((person) => (
          <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id)}>delete</button>
          </div>
        ))}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [notifyColor, setNotifyColor] = useState("green");
  const [notifyHide, setNotifyHide] = useState(true);

  useEffect(() => {
    personService.getAll().then((personData) => {
      setPersons(personData);
    });
  }, []);

  const modifyError = (hide, color, errorMsg) => {
    setNotifyHide(hide);
    setNotifyColor(color);
    setErrorMessage(errorMsg);
    setTimeout(() => {
      setErrorMessage(null);
      setNotifyHide(true);
    }, 5000);
  };

  const addNameNumber = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    const duplicate = persons.find((person) => person.name === newName);
    if (duplicate) {
      if (duplicate.number === newNumber) {
        alert(`${newName} is already added to phonebook`);
        setNewNumber("");
        setNewName("");
        return;
      } else {
        if (
          window.confirm(
            `${duplicate.name} is already added to phonebook, replace the old number with a new one?`
          )
        ) {
          personService
            .update(duplicate.id, personObject)
            .then((returnedPerson) => {
              console.log("Person update succesful");
              setPersons(
                persons.map((person) =>
                  person.id === duplicate.id ? returnedPerson : person
                )
              );
            })
            .catch((error) => {
              console.log("Person update unsuccesful");
              modifyError(
                false,
                "red",
                `Information of ${newName} has already been removed from the server`
              );
            });
          modifyError(false, "green", `Updated phone number of ${newName}`);
        }
        setNewName("");
        setNewNumber("");
        return;
      }
    }
    personService.create(personObject).then((responseData) => {
      setPersons(persons.concat(responseData));
      setNewName("");
      setNewNumber("");
    });
    modifyError(false, "green", `Added ${newName}`);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchValChange = (event) => {
    setSearchVal(event.target.value);
  };

  const handleDelete = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService.deletePerson(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        modifyError(false, "green", `Deleted ${personToDelete.name}`);
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={errorMessage}
        hide={notifyHide}
        color={notifyColor}
      />
      <Filter
        searchVal={searchVal}
        handleSearchValChange={handleSearchValChange}
      />
      <h2>add a new</h2>
      <PersonForm
        addNameNumber={addNameNumber}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumChange={handleNumChange}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        searchVal={searchVal}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
