import Markdown from 'react-remarkable'

export default function Preview({text}){
    return   <div className="preview">
        <Markdown source={text}/>
    </div>
}