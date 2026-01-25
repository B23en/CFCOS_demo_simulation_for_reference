import { useLanguage } from "../LanguageContext"
import { useNavigate } from "react-router-dom";
import './pages.css'
import { motion } from "framer-motion";
import { useState } from "react";
import { useSession } from "../SessionContext";

function Rating() {
    const { sessionId, setSessionId } = useSession();
    const { lang, setLang, t } = useLanguage();
    const navigate = useNavigate();

    const [rating, setRating] = useState(-1);
    const [feedback, setFeedback] = useState("");

    const [enable, setEnable] = useState(true);

    const handleBtn = async () => {
        if(!enable) {
            return;
        }
        try{
            setEnable(false);
            const res = await fetch("/rate", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    rating: rating,
                    feedback: feedback,
                    session_id: sessionId
                })
            });

            if(!res.ok){
                console.log("Server connection failed..");
                setEnable(true);
                return;
            }
            navigate('/done');
        }
        catch(e){
            console.log("Something went wrong..");
            setEnable(true);
            return;
        }
        
    };

    return (
        <motion.div
            initial={{ x: '100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.6,
                ease: 'easeInOut'
            }}  
        >
            <div className="container">
                <p style={{fontSize: "20px", fontWeight: "500"}}>{t('시뮬레이션 체험 결과는 어떠셨나요?', '')}</p>
                <p>{t('LLM 기반 파일 분류 및 정리 작업 결과에 대한 만족도를 알려주세요', '')}</p>
                <div className="rating-box" >
                    <div className="rating-list center-horizontal" style={{margin: "40px", gap: "32px"}}>
                        <div className={`rating-element center-vertical ${rating === 1 && "selected"}`} onClick={()=>setRating(1)}>
                            <p style={{marginTop: "8px"}}>🤨</p>
                            <p style={{fontSize: "14px", fontWeight: "500", marginTop: "12px"}}>{t('불만족','')}</p>
                        </div>
                        <div className={`rating-element center-vertical ${rating === 2 && "selected"}`} onClick={()=>setRating(2)}>
                            <p style={{marginTop: "8px"}}>😕</p>
                            <p style={{fontSize: "14px", fontWeight: "500", marginTop: "12px"}}>{t('보통','')}</p>
                        </div>
                        <div className={`rating-element center-vertical ${rating === 3 && "selected"}`} onClick={()=>setRating(3)}>
                            <p style={{marginTop: "8px"}}>🙂</p>
                            <p style={{fontSize: "14px", fontWeight: "500", marginTop: "12px"}}>{t('만족','')}</p>
                        </div>
                        <div className={`rating-element center-vertical ${rating === 4 && "selected"}`} onClick={()=>setRating(4)}>
                            <p style={{marginTop: "8px"}}>😄</p>
                            <p style={{fontSize: "14px", fontWeight: "500", marginTop: "12px"}}>{t('매우 만족','')}</p>
                        </div>
                    </div>
                    <div className="feedback-box center-vertical" style={{margin: "10px"}}>
                        <p style={{fontSize: "14px"}}>{t('개선할 점이나 추가 기능 등 다양한 피드백을 들려주세요','')}</p>
                        <textarea rows={8} style={{width: "400px"}} value={feedback} onChange={(e) => setFeedback(e.target.value)}/>
                    </div>
                </div>
                <button className="btn-black" disabled={rating === -1} style={{marginTop: "14px"}} onClick={handleBtn} >{t('제출하기','')}</button>
            </div>
        </ motion.div>
    )
}

export default Rating