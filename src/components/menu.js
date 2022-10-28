import { useContext } from "react"
import ItemsContext from "./items-context"


export default function Menu(){
    const itemsContext = useContext(ItemsContext)
    function handleClick(){
        //onNew()
        itemsContext.onNew( )
    }

    function handleChange(e){
        //onSearch(e)
        itemsContext.onSearch(e)
    }

    return (
        <div className="menu">
              <input className="search" placeholder="search..." onChange={handleChange}/>
          <button className="btn" onClick={(e) => handleClick()}>
            + Nueva Nota
          </button>
        </div>
    )
}