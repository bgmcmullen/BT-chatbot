import { useState, useEffect, AnchorHTMLAttributes, DetailedHTMLProps } from 'react';
import './App.css'
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import './index.css';
import 'katex/dist/katex.min.css';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import { ReactComponent as Dog } from './assets/dog.svg';



function App() {

  const [botTextArea, setBotTextArea] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [chatHistory, setChatHistory] = useState<{type: string, text: string}[]>([]);
  const [loadingOpacity, setLoadingOpacity] = useState(0);
  const [threadId, setThreadId] = useState("");


  function generateThreadId() {
    return uuidv4();
  }


  useEffect(() => {
    setThreadId(generateThreadId());
  }, [])

  async function sendBotMessage() {

    setChatHistory((prev) => [...prev, {type: 'user', text: botTextArea}]);
    setLoadingOpacity(1);

    fetch('http://127.0.0.1:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ "input": botTextArea, 'threadId': threadId }),
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (response.body) {
          await handleStream(response.body);
        }

      })
  }

  async function handleStream(stream: ReadableStream<Uint8Array>) {
    const reader = stream.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let result = '';

    while (!done) {
      const { value, done: isDone } = await reader.read();
      done = isDone;

      if (value) {
        result += decoder.decode(value, { stream: true });
      }

    }
    if (result) {
      streamText(result);
    }
  }


  let index = 0;
  let tempContent = '';
  function streamText(text: string) {
    setLoadingOpacity(0);
    if (index < text.length) {
      const chunk = text.substring(index, index + 10);
      tempContent += chunk; // Accumulate the valid content
      setBotResponse(tempContent.replace(/^["']|["']$/g, '').replace(/\\n/g, "\n").replace(/\\\\/g, "\\").replace(/\$\$/g, "$"));
      index += 10;
      setTimeout(() => streamText(text), 50);
    } else {
      setBotResponse("");
      setChatHistory((prev) => [...prev, {type: 'bot', text: text.replace(/^["']|["']$/g, '').replace(/\\n/g, "\n").replace(/\\\\/g, "\\").replace(/\$\$/g, "$")}]);
    }
  }

  function handleBotTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setBotTextArea(event.target.value);
  }


  const components = {
    a: (props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => (
      <a {...props} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    ),
  };

  const botStyle = {backgroundColor: 'MistyRose', marginLeft: "30px", borderRadius: '10px', color: 'black', paddingLeft: '5px', paddingRight: '5px', fontWeight: "700", fontFamily: "'Inter', sans-serif"};

  const userStyle = {backgroundColor: '#F7D8FFAD', marginRight: "30px", borderRadius: '10px', color: 'black', paddingLeft: '5px', paddingRight: '5px', fontWeight: "700", fontFamily: "'Inter', sans-serif", width: "50%"};

  return (
    <>
    <Header/>
    <div>
      <Dog style={{paddingTop: "10px"}}/>
    </div>
    <h2 style={{color: "#16325C", fontFamily: "'Inter', sans-serif", fontSize: "60px" }}>Chat with Me, Let's Learn!</h2>
    <div style={{ padding: "30px", borderRadius: "20px", backgroundColor: "#F4F1FF", color: "#37474F", fontFamily: "'Inter', sans-serif", fontSize: "24px", lineHeight: "29.05px", whiteSpace: "pre-line", fontWeight: "700" }}>
            <p style={{marginTop: 0}}>🌟 Welcome, Explorer! 🌟</p>
            <p>🚫 No bad words, inappropriate stuff, or links here! We only keep things fun and safe. 🌈</p>
            <p>🔒 Your conversations are never recorded with your name, and we never ask for any personal info! 😊</p>
            
            <p><strong>NOTE:</strong> ⏰ Want no timer and no ads? Just ask your teacher or parent to <a href="#">click here</a>! 😊 You get 15 free chats with me every day! 🎉</p>

            <p>📝 Ready to chat? Start by typing “Hi” 👋 or “Woof” 🐱 and we can talk about anything! Whatever we chat about stays secret—it’s never saved! 🤫</p>
            
            <p style={{marginBottom: 0}}>🚀 If you're a paid member, <a href="#">click here</a> to login! 🔑</p>
        </div>
      

      <div style={{overflow: 'scroll', height: '400px', backgroundColor: "none"}}>
        {chatHistory.map((element, index) => {
          return(<div key={index} style={element.type === 'bot' ? botStyle : userStyle}>
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
              {element.text}
            </ReactMarkdown>
          </div>)
        })}
        {botResponse ? <div style={botStyle}>
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} components={components}>
            {botResponse}
        </ReactMarkdown>
        </div> : null}
        <div className='loading-symbol' style={{opacity: loadingOpacity}}>🌀</div>
      </div>
      <textarea id="bot-chat" onChange={handleBotTextAreaChange} style={{ fontWeight: "700", fontFamily: "'Inter', sans-serif", color: "black",fontSize: "24px",  borderRadius: "30px", border: "none", width: "100%", backgroundColor: "#F5F5F5", display: 'block', height: '204px', resize: 'none', padding: 20}}></textarea>
      <button id="send-message-button" onClick={sendBotMessage} style={{marginTop: "10px", width: "114px", height: "62px", backgroundColor: "#006DCC", display: 'block', color: "#FFFFFF", fontSize: "32px", fontWeight: "700", fontFamily: "'Inter', sans-serif", padding: 0}}>Reply</button>
      <br></br>
    </>
  )
}

export default App
