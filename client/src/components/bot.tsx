import { Divider, IconButton } from '@mui/material';
import styles from '../styles/bot.module.css'
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import bott from '../media/bot.jpg'
import apiFetcher from '../helpers/api-fetcher';

interface props {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
    bot: string;
    category?: string;
    itemName?: string;
    recipeGenerate?: boolean;
    setGenerateRecipe?: Dispatch<SetStateAction<boolean>>;
    setDisabledState?: Dispatch<SetStateAction<boolean>> | undefined;
    setRecipe?: Dispatch<SetStateAction<string>> | undefined;
}
interface Answer {
    question: string,
    answer: string
}
function Bot({ bot, isOpen, setIsOpen, category, itemName, recipeGenerate, setGenerateRecipe, setDisabledState, setRecipe }: props) {

    const [answers, setAnswers] = useState<Answer[]>([])
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [question, setQuestion] = useState<string>('')
    const [questionCountAdmin, setquestionCountAdmin] = useState<number>(0);
    const [isDisabledAdmin, setIsDisabledAdmin] = useState<boolean>(false);


    useEffect(() => {
        if (questionCountAdmin >= 4) {
            const currentTime = new Date();
            const savedTimeStr = sessionStorage.getItem('startTime');
            if (savedTimeStr) {
                const savedTime = new Date(savedTimeStr);
                const elapsedTime = currentTime.getTime() - savedTime.getTime(); // Get the difference in milliseconds
                const elapsedTimeInSeconds = elapsedTime / 1000;
                const remainingTimeInSeconds = 10 - elapsedTimeInSeconds;

                if (remainingTimeInSeconds <= 0) {
                    setIsDisabledAdmin(false); // Enable the chat
                } else {
                    setIsDisabledAdmin(true); // Disable the chat
                    const chatbody = document.getElementById('chatBodyAdmin')
                    chatbody?.scrollTo(0, chatbody.scrollHeight);
                    const timeout = setTimeout(() => {
                        setIsDisabledAdmin(false); // Enable the chat after remaining time
                        sessionStorage.removeItem('startTime'); // Reset the start time
                        sessionStorage.setItem('questionCountAdmin', String(0));
                        setquestionCountAdmin(0)
                    }, remainingTimeInSeconds * 1000); // Convert remaining time to milliseconds
                    return () => clearTimeout(timeout);
                }
            }
        }
    }, [questionCountAdmin]);



    const toggleDiv = () => {
        setIsOpen(!isOpen);
    };


    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        setQuestion(e.target.value);
    };

    const handleAdminSend = async () => {
        if (question.length > 0 && !isDisabledAdmin) {
            setAnswers(prevAnswers => [
                ...prevAnswers,
                { question: question, answer: "..." }
            ]);
    
            const data = await apiFetcher.post('openai/generate-admin-response', {
                query: question
            });
            const response = data?.response?.message?.output;
    
            if (response?.length > 0) {
                setAnswers(prevAnswers => {
                    const updatedAnswers = [...prevAnswers];
                    updatedAnswers[prevAnswers.length - 1].answer = response;
                    return updatedAnswers;
                });
    
                const chatbody = document.getElementById('chatBodyAdmin');
                chatbody?.scrollTo(0, chatbody.scrollHeight);
    
                setquestionCountAdmin(prevCount => {
                    const newCount = prevCount + 1;
                    sessionStorage.setItem('questionCountAdmin', String(newCount));
                    return newCount;
                });
    
                setQuestion('');
                setIsDisabledAdmin(false);
    
                if (questionCountAdmin === 4) {
                    setIsDisabledAdmin(true);
                    const time = new Date();
                    sessionStorage.setItem('startTime', time.toString());
                }
            }
        }
    };
    

    const handleEnterKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            const buttonId = bot === 'adminBot' ? 'sendAdmin' : 'sendRecipe';
            document.getElementById(buttonId)?.click();
        }
    }

    return (
        <>


            <div className={bot === 'adminBot' ? 'chat' : 'recipeBot'}>
                <div className={styles.headerx}>
                    <IconButton className={styles.cross} onClick={toggleDiv} style={{ color: 'white' }}><ClearRoundedIcon></ClearRoundedIcon></IconButton>
                </div>
                <div id={bot === 'adminBot' ? 'chatBodyAdmin' : 'chatBodyRecipe'} ref={chatBodyRef} className={styles.body}>
                    {
                        bot === 'adminBot' && answers?.map((ans, index) => (
                            <div key={index} className='d-flex flex-column'>
                                <div className={styles.question}>{ans.question}</div>
                                <div className={styles.botAnswer}><img className={styles.botImg} alt='bot' src={bott}></img> <div className={`${styles.answer} ${styles.recipeAnswer}`}>{ans.answer}</div></div>

                            </div>
                        ))
                    }

                    {isDisabledAdmin && bot === 'adminBot' && <div className={styles.prompt}>Please wait 10 seconds before asking more questions.</div>}

                </div>
                <Divider></Divider>
                <div className={`d-flex m-2 ${styles.userInput}`}>
                    <input disabled={isDisabledAdmin} onKeyDown={handleEnterKeyPress} value={question} onChange={handleInput} placeholder='Enter your message...' className={styles.input}></input>
                    <IconButton id={bot === 'adminBot' ? 'sendAdmin' : 'sendRecipe'} disabled={isDisabledAdmin} onClick={handleAdminSend}><SendRoundedIcon color='info'></SendRoundedIcon></IconButton>

                </div>

            </div>



        </>

    )
}

export default Bot
