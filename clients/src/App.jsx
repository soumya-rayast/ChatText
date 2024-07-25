import { useEffect, useState } from "react";
import io from "socket.io-client"
import Picker from 'emoji-picker-react'
const socket = io("http://localhost:5000");
function App() {
  const [userName, setUserName] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [NewMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false)
  const [showPicker,setShowPicker] = useState(false)
  useEffect(() => {
    socket.on("received-message", (message) => [
      setMessages([...messages, message])
    ])
    socket.on('typing', (data) => {
      setIsTyping(true)
    })
    socket.on("stop-typing", () => {
      setIsTyping(false)
    })
  }, [messages, socket])


  const handleSubmit = (e) => {
    e.preventDefault();
    const messageData = {
      message: NewMessage,
      user: userName,
      time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
    };
    if (!NewMessage == "") {
      socket.emit("send-message", messageData);
      setNewMessage('')
      setTyping(false)
    } else {
      alert("Message cannot be empty")
    }

  }
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit("typing", userName)
    }
    if (e.target.value === "") {
      setTyping(false);
      socket.emit("stop-typing")
    }
  }
  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };
  return (
    <>
      <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
        {
          chatActive ?
            (<div className="rounded-md w-full md:w-[80vw] p-2 lg:w-[40vw] bg-white">
              <h1 className="text-center font-bold text-xl my-2 uppercase text-yellow-500">Banana Group Chat</h1>
              <div>
                <div className="overflow-y-scroll md:h-[80vh] lg:h-[60vh]">
                  {
                    messages.map((message, index) => {
                      return (
                        <div key={index} className={`flex gap-2 rounded-md shadow-md my-5 w-fit ${userName === message.user && 'ml-auto'}`} >
                          <div className="bg-yellow-400 flex justify-center items-center rounded-l-md">
                            <h3 className="text-lg font-bold px-2">{message.user.charAt(0).toUpperCase()}</h3>
                          </div>
                          <div className="px-2 bg-white rounded-md">
                            <span className="text-sm">{message.user}</span>
                            <h3 className="font-bold">{message.message}</h3>
                            <h2 className="text-xs  text-right">{message.time}</h2>
                          </div>
                        </div>
                      )
                    })
                  }
                  {isTyping && <p className="text-sm text-gray-500">Someone is typing...</p>}
                </div>

                
                <form className="flex md:gap-4 gap-2 justify-between" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="rounded-md border-2 outline-none px-3 py-2 w-full"
                    value={NewMessage}
                    onChange={handleTyping} />

                    <button 
                    type="button"
                    className="px-3 bg-yellow-300 text-white font-bold py-2 rounded-md hover:bg-yellow-500"
                    onClick={()=> setShowPicker(val =>!val)}>
                    😀
                    </button>
                    {showPicker && (<div className="absolute bottom-12 right-0 z-50"><Picker onEmojiClick={onEmojiClick}/></div> )}
                  <button
                    type="submit"
                    className="px-3 bg-yellow-300 text-white font-bold py-2 rounded-md hover:bg-yellow-500" >
                    Send
                  </button>
                </form>
                
              </div>
            </div>)
            :
            (<div className="w-screen h-screen flex justify-center items-center gap-3 flex-col">
              <div>
                <p className="text-3xl"> BananaChat</p>
              </div>
              <input
                type="text"
                name=""
                id=""
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="text-center px-4 py-2 outline-none border-2 rounded-md"
              />
              <button
                type="submit"
                className="bg-yellow-400 py-2  rounded-md text-white px-4 hover:bg-yellow-500"
                onClick={() => !userName == "" && setChatActive(true)}
              >Start Chat</button>
            </div>)
        }
      </div >
    </>
  )
}

export default App

