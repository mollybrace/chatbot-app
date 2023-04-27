import './index.css';
import { useState, useEffect } from 'react';


const App = () => {
  const [ value, setValue] = useState(null);
  const [ message, setMessage] = useState(null);
  const [ previousChats, setPreviousChats] = useState([])
  const [ currentTitle, setCurrentTitle] = useState(null)


  const createNewChat = () => {
    setMessage(null)
    setValue(null)
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
      setCurrentTitle(uniqueTitle)
      setMessage(null)
      setValue("")
  }
  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
      message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch("http://localhost:8000/completion", options) //wait for response
      const data = await response.json()  //parse it
      setMessage(data.choices[0].message)
    } catch (error) {
       console.log(error)
    }
  }

useEffect(() => {
    if(!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
         [...prevChats, 
              {
                title: currentTitle,
                role: "user",
                content: value
            }, 
            {
                title: currentTitle,
                role: message.role,
                content: message.content
            }
        ]
      ))
    }
}, [message, currentTitle, value])


const currentChat = previousChats.filter(prevChat =>
  prevChat.title === currentTitle)
const uniqueTitles =Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
console.log(uniqueTitles, "UNIQUE TITLES")

console.log(currentChat, "cuurreent")
  return (
    <div className="app">
      <section className="side-bar">
      <button onClick={createNewChat}>+ New chat</button>
      <ul className="history">
        {uniqueTitles.map((uniqueTitle, index) => {
          return (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>            
            )
          })}
      </ul>
      <nav>
        <p>Made by Molly</p>
      </nav>
      </section>

      <section className="main">
       {!currentTitle && <h1>ChatBot GPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => {
            return (
              <li key={index}>
                <p className="role">{chatMessage.role}</p>
                <p className="message">{chatMessage.content}</p>
              </li>
                    )
                  })
          }
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              />
            <div id="submit" onClick={getMessages}>+</div>
          </div>
          <p className="info">This is a chat GPT style chatbot created by Molly Brace</p>
        </div>
      </section>
    </div>
    
  );
}

export default App;
