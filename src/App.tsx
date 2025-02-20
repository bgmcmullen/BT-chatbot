import { useState, useEffect } from 'react';
import './App.css'
import { marked } from 'marked';
import MarkdownIt from 'markdown-it';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import './index.css';
import 'katex/dist/katex.min.css';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';



function App() {

  const [botTextArea, setBotTextArea] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [chatHistory, setChatHistory] = useState<{type: string, text: string}[]>([]);
  const [botText, setBotText] = useState("");
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

    fetch('http://127.0.0.1:5000/chat', {
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

        // return response.json();
      })
  }

  const renderer = new marked.Renderer();

  // Customize how links are rendered
  renderer.link = ({ href, title, tokens }: Link) => {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${tokens}</a>`;
  };

  // Parse the Markdown with the custom renderer
  marked.use({ renderer });

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
      setBotResponse(tempContent);
      // setBotResponse(md.render(tempContent)); // Update the DOM with valid HTML
      index += 10;
      setTimeout(() => streamText(text), 50);
    } else {
      setBotResponse("");
      setChatHistory((prev) => [...prev, {type: 'bot', text: text}]);
      // setBotResponse(md.render(text)); // Ensure the full text is added at the end
    }
  }

  function handleBotTextAreaChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setBotTextArea(event.target.value);
  }


  const md = new MarkdownIt({
    linkify: true, // Automatically converts URLs to links
  });

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {

    const aIndex = tokens[idx].attrIndex('target');

    if (aIndex < 0) {
      tokens[idx].attrPush(['target', '_blank']);
      tokens[idx].attrPush(['rel', 'noopener noreferrer']);
    } else if (tokens[idx]?.attrs) {
      tokens[idx].attrs[aIndex][1] = '_blank';
    }

    return self.renderToken(tokens, idx, options);
  };


  const components = {
    a: ({ href, children }) => (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  };

  const responses = [];


  const botStyle = {backgroundColor: 'MistyRose', marginLeft: "30px", borderRadius: '10px', color: 'black', paddingLeft: '5px', paddingRight: '5px'};
  const userStyle = {backgroundColor: 'SeaShell', marginRight: "30px", borderRadius: '10px', color: 'black', paddingLeft: '5px', paddingRight: '5px'};

  return (
    <>
    <Header/>
      <label htmlFor="bot-chat" style={{display: 'block'}}> Chat with our bot:</label>
      <textarea id="bot-chat" onChange={handleBotTextAreaChange} style={{display: 'block', width: '50%', height: '100px', resize: 'none'}}></textarea>
      <button id="send-message-button" onClick={sendBotMessage} style={{display: 'block'}}>Send Message</button>
      <br></br>

      <div style={{overflow: 'scroll', height: '400px', backgroundColor: 'darkgray'}}>
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
      {/* <div id="bot-response" dangerouslySetInnerHTML={{ __html: botResponse }} ></div> */}
    </>
  )
}

export default App
