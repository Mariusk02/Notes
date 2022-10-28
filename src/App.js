import { useEffect, useState } from "react";
import "./App.css";
import Panel from "./components/panel";
import Menu from "./components/menu";
import List from "./components/list";
import Item from "./components/item";
import Editor from "./components/editor";
import Preview from "./components/preview";
import uuid from "react-uuid";
import useDocumentTitle from "./components/documentTitle";
import ItemsContext from "./components/items-context";
import { get, post, put } from "./lib/http";
import StatusContext from "./components/status-context";

const App = () => {
  const URL = "http://localhost:3010/";

  const [items, setItems] = useState([]);
  const [actualIndex, setActualIndex] = useState(-1);
  const [copyItems, setCopyItems] = useState([]);

  const [lock, setLock] = useState(false);
  const [status, setStatus] = useState(0);

  useDocumentTitle(copyItems[actualIndex]?.title, "Note");

  useEffect(() => {
    getItems();
  }, []);

  async function getItems() {
    let data = await get(`${URL}`);
    let res = getOrderedNotes(data);

    setItems(res);
    setCopyItems(res);

    if (items.length > 0) setActualIndex(0);
  }

  async function handleNew() {
    const note = {
      id: uuid(),
      title: "maria",
      text: "wksdowk",
      pinned: false,
      created: Date.now(),
    };

    let notes = [...items];
    notes.unshift(note);
    let res = getOrderedNotes(notes);
    setItems(res);
    setCopyItems(res);

    const data = await post(`${URL}new`, note);
  }

  function handlePinned(item, i) {
    setActualIndex(i);
    let id = item.id;
    let notes = [...items];
    notes[i].pinned = !notes[i].pinned;

    let res = getOrderedNotes(notes);

    setItems(res);
    setCopyItems(res);
    let index = res.findIndex((x) => x.id === id);
    setActualIndex(index);
  }

  function getOrderedNotes(arr) {
    let items = [...arr];
    let pinned = items.filter((x) => x.pinned === true);
    let resto = items.filter((x) => x.pinned === false);

    pinned = sortByDate(pinned, true);
    resto = sortByDate(resto, true);

    return [...pinned, ...resto];
  }

  function sortByDate(arr, asc = false) {
    if (asc)
      return arr.sort((a, b) => new Date(b.created) - new Date(a.created));
    return arr.sort((a, b) => new Date(a.created) - new Date(b.created));
  }

  function handleSelectNote(item, e) {
    if (!e.target.classList.contains("note")) return;

    const index = items.findIndex((x) => x === item);
    setActualIndex(index);
  }

  function onChangeTitle(e) {
    const title = e.target.value;

    let notes = [...items];
    notes[actualIndex].title = title;

    setItems(notes);
    setCopyItems(notes);
  }
  function onChangeText(e) {
    const text = e.target.value;

    let notes = [...items];
    notes[actualIndex].text = text;

    setItems(notes);
    setCopyItems(notes);
  }

  function autosave(){
      if(!lock){
        setLock(true);
        setStatus(1);
        setTimeout(() => {
          save();
          setLock(false)
        },3000);
      }
  }

  async function save(){
    const item = items[actualIndex];

    const response = await put(`${URL}update`, item)

    setStatus(2)
    setTimeout(() => {
      setStatus(0)
    }, 1000);
  }

  function renderEditor() {
    return (
      <>
        <StatusContext.Provider value = { {status: status , autosave: autosave} }>
          <Editor
            item={copyItems[actualIndex]}
            onChangeTitle={onChangeTitle}
            onChangeText={onChangeText}
          />
        </StatusContext.Provider>

        <Preview text={copyItems[actualIndex].text} />
      </>
    );
  }

  function handleSearch(e) {
    const q = e.target.value;
    if (q === "") {
      setCopyItems([...items]);
    } else {
      let res = items.filter(
        (x) => x.title.indexOf(q) >= 0 || x.text.indexOf(q) >= 0
      );

      if (res.length == 0) {
        setActualIndex(-1);
      } else {
        setCopyItems([...res]);
        setActualIndex(0);
      }
    }
  }
  return (
    <div className="App container">
      <Panel>
        <ItemsContext.Provider
          value={{ onSearch: handleSearch, onNew: handleNew }}
        >
          <Menu />
        </ItemsContext.Provider>

        <List>
          {copyItems.map((item, i) => {
            return (
              <Item
                key={item.id}
                item={item}
                index={i}
                onHandlePinned={handlePinned}
                onHandleSelectNote={handleSelectNote}
                actualIndex={actualIndex}
              />
            );
          })}
        </List>
      </Panel>

      <>{actualIndex >= 0 ? renderEditor() : ""}</>
    </div>
  );
};

export default App;
