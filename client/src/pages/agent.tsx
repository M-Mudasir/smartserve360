import { Divider, IconButton, LinearProgress } from '@mui/material';
import styles from '../styles/chat.module.css'
import DeatailsTable from '../components/table';
import { useEffect, useState, useRef, SetStateAction, Dispatch } from 'react';
import apiFetcher from '../helpers/api-fetcher';
import ArrowUpwardSharpIcon from '@mui/icons-material/ArrowUpwardSharp';
import chatBg from '../../src/media/chatBg.png'
interface Props {
  setScroll: Dispatch<SetStateAction<boolean>>;
}
const convertResponseToColumns = (data: any) => {
  if (data.length === 0) {
    return [];
  }

  const sampleItem = data[0];
  const columns = Object.keys(sampleItem).map((key) => ({
    id: key,
    label: String(key).toLowerCase(),
    minWidth: 100,
  }));

  return columns;
};

interface Messages {
  question: string;
  answer: any;
  columns: any;
}

const Agent = ({ setScroll }: Props) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Messages[]>([]);
  const [isloading, setIsLoading] = useState(false);


  const scrollToBottom = () => {
    setScroll(true)
  };

  const handleSend = async () => {
    setIsLoading(true);
    scrollToBottom();
    try {
      const tabularData = await apiFetcher.post('openai/generate-sql-agent', {
        query: message
      });

      if (tabularData?.response?.length) {
        const columns = convertResponseToColumns(tabularData?.response);
        setMessages(prevMessages => [
          ...prevMessages,
          {
            question: message,
            answer: tabularData?.response,
            columns: columns
          }
        ]);
      }
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setMessage('');
    setIsLoading(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={styles.contain} id='body'>
      <div className={styles.chat} style={{ maxWidth: '100%' }}>
        <div className={styles.body} style={{ maxWidth: '100%' }}>
          <div className='d-flex flex-column'>
            {
              (messages.length === 0 && !isloading) && <img src={chatBg} className={styles.img}></img>

            }
            {messages.map((message, index) => (
              <div key={index} className='d-flex flex-column'>
                <div className={styles.question}>{message.question}</div>
                <div className={styles.answer}>
                  <DeatailsTable dummyData={message.answer} columns={message.columns} title='SQL Agent Response' />
                </div>
              </div>
            ))}

            {isloading && (
              <>
                <div className={styles.question}>{message}</div>
                <div className="d-flex flex-column ms-9" style={{ marginBottom: '10rem' }}>
                  <LinearProgress color="inherit" className={styles.loading} />
                  <LinearProgress color="inherit" className={styles.loading} />
                  <LinearProgress color="inherit" className={styles.loadingSm} />

                </div>

              </>
            )}
          </div>
        </div>
        <Divider></Divider>
        <div className={`d-flex m-2  ${styles.userInput}`}>
          <input disabled={isloading} onKeyDown={handleKeyDown} value={message} placeholder='Enter your message...' className={`input ${styles.input}`} onChange={(e) => setMessage(e?.target?.value)}></input>
          <IconButton className={styles.send} disabled={message.length === 0 || isloading}><ArrowUpwardSharpIcon style={{ color: 'white' }} onClick={handleSend}></ArrowUpwardSharpIcon></IconButton>
        </div>
      </div>
    </div>
  );
};

export default Agent;
