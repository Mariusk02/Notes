import { useContext } from "react";
import Status from "./status";
import StatusContext from "./status-context";

export default function Editor({ item, onChangeTitle, onChangeText }) {
 
  const statusContext = useContext(StatusContext)

  function handleTitleChange(e) {
    onChangeTitle(e);
    statusContext.autosave();
  }

  function handleTextChange(e) {
    onChangeText(e);
    statusContext.autosave()
  }
  return (
    <div className="editor">
      <Status statusCode = {statusContext.status}/>
      <div>
        <input
          className="title"
          value={item.title}
          onChange={handleTitleChange}
        />
      </div>

      <div className="editor-textarea">
        <textarea
          className="content"
          value={item.text}
          onChange={handleTextChange}
        ></textarea>
      </div>
    </div>
  );
}
