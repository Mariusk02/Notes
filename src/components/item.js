export default function Item({
  item,
  onHandlePinned,
  onHandleSelectNote,
  index,
  actualIndex,
}) {
  function handlePinned(item, index) {
    onHandlePinned(item, index);    
  }

  function handleClick(item, e) {
    onHandleSelectNote(item, e);
  }
  return (
    <div
      key={item.id}
      className={index === actualIndex ? "note activeNote" : "note"}
      onClick={(e) => handleClick(item, e)}
    >
      <div>
        {item.title === "" ? "[Sin titulo]" : item.title.substring(0, 20)}
      </div>

      <div>
        <button className="pinButton" onClick={() => handlePinned(item, index)}>
          {item.pinned ? "Pinned" : "Pin"}
        </button>
      </div>
    </div>
  );
}
