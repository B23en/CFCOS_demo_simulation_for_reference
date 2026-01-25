import { useLanguage } from "../LanguageContext"
import { useNavigate } from "react-router-dom";
import './pages.css'
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSession } from "../SessionContext";

import rolling from '../img/rolling.gif';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function Startup() {
    const { sessionId, setSessionId } = useSession();
    const { lang, setLang, t } = useLanguage();
    const navigate = useNavigate();

    const [agree, setAgree] = useState(false);
    const [exVisible, setExVisible] = useState(false);
    const [subExVisible, setSubExVisible] = useState(false);
    const [visible, setVisible] = useState(false);

    const [enable, setEnable] = useState(true);
    const [success, setSuccess] = useState(false);

    const [email, setEmail] = useState("")
    const [state, setState] = useState(" ");

    const handleBtn = async () => {
        if(!enable){
            return;
        }
        try{
            setEnable(false);
            let res = await fetch("/hello");
            if (!res.ok){
                setState("Server connection failed..");
                setEnable(true);
                return;
            }

            res = await fetch("/verify-email", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_email: email })
            });
            if (!res.ok){
                setState("유효하지 않거나 이미 참여하신 이메일입니다.");
                setEnable(true);
                return;
            }

            res = await fetch("/add-session", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_email: email.trim()})
            });
            if (!res.ok){
                setState("Failed to get session key.");
                setEnable(true);
                return;
            }

            const data = await res.json();
            const session_key = data['response'];
            setSessionId(session_key);
            console.log("Session key: " + session_key);

            setSuccess("true");
            await sleep(1000);
            // navigate('/explanation');
            navigate('/explanation');
        }
        catch(e){
            setState("Somethin went wrong..")
            setEmail(true);
        }
        
    }

    useEffect(() => {
        const _run = async () => {
            setExVisible(true);
            setSubExVisible(true);
            await sleep(5000);
            setVisible(true);
        };
        _run();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{
                duration: 0.6,
                ease: 'easeInOut'
            }}  
        >
            <div className="container">
                {/* <div className="btns" style={{margin: "20px"}}>
                    <button className="btn" onClick={() => setLang('ko')} >Kor</button>
                    <button className="btn" onClick={() => setLang('en')}>Eng</button>
                </div> */}
                <div className="explanation center-vertical" style={{opacity: exVisible ? 1 : 0, transition: "opacity 2s ease"}}>
                    <p>
                        <span>{t('본 시뮬레이션은 ', '')}</span>
                        <span style={{fontWeight: "500"}}>{t('창원대학교 컴퓨터공학과 CVLab 학사 논문 작성을 위한 연구', '')}</span>
                        <span>{t('의 일환입니다.', '')}</span>
                    </p>
                    <p style={{ fontSize: "18px" }}>
                        {/* <span style={{fontWeight: "500"}}>{t('LLM 기반 파일 분류 및 정리 프로세스에 대한 만족도 평가 및 피드백','')}</span>
                        <span>{t('을 얻기 위한 목적으로 구현되었습니다.','')}</span> */}
                        <span>{t('가상의 테스트 환경에서', '')}</span>
                        <span style={{ fontWeight: "500" }}>{t(' LLM 기반의 파일 분류 프로세스에 대한 만족도 평가 및 피드백', '')}</span>
                        <span>{t('을 얻기 위한 목적으로 진행됩니다.', '')}</span>
                    </p>
                    <p>{t('참여는 자율이며, 원하실 경우 언제든지 중단할 수 있습니다.','')}</p>
                    
                </div>
                <div className="sub-explanation center-vertical" style={{opacity: subExVisible ? 1 : 0, transition: "opacity 2s ease"}}>
                    <p style={{fontSize: "14px", marginTop: "20px"}}>{t('소요 시간: 약 2~5분','')}</p>
                    <p style={{fontSize: "14px"}}>{t('(본 시뮬레이션은 PC 환경에서 동작하도록 구현되었습니다.)','')}</p>                 
                </div>
                <div className="center-vertical" style={{paddingTop: "44px", paddingBottom: "10px" , opacity: visible ? 1 : 0, transition: "opacity 1s ease"}}>
                    <div className="center-vertical">
                        <input type="text" placeholder="이메일을 입력해주세요" value={email} onChange={(e) => {setEmail(e.target.value); setState(" ")}} style={{width: "220px", textAlign: "center"}} />
                        <p style={{marginLeft: "6px", fontSize: "12px", color: "rgba(235, 72, 72, 1)"}}>{state}</p>
                    </div>
                    <label className='center-horizontal agree-area' style={{marginTop: "10px"}}>
                        <p style={{fontSize: "14px"}}>{t('모든 내용을 읽고 이해했습니다.', 'I understand all the contents...')}</p>
                        <input type='checkbox' checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                    </label>
                </div>
                <button className="btn-black" style={{opacity: visible ? 1 : 0}} onClick={handleBtn} disabled={!agree || !email}>{enable ? t('시작하기', 'Next') : success ? "✅" : <img className="rolling" src={rolling} />}</button>
            </div>
            
        </ motion.div>
    )
}

export default Startup 