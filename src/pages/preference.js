import { useLanguage } from "../LanguageContext"
import { useNavigate } from "react-router-dom";
import './pages.css'
import { motion } from "framer-motion";
import { useState } from "react";
import { useSession } from "../SessionContext";

function Preference() {
    const { sessionId, setSessionId } = useSession();
    const { lang, setLang, t } = useLanguage();
    const navigate = useNavigate();

    const [preferences, setPreferences] = useState([]);

    const [enable, setEnable] = useState(true);

    const togglePreference = (value) => {
        setPreferences((prev) => {
            if (value === "해당 없음") {
                return prev.includes("해당 없음") ? prev.filter(v => v !== "해당 없음") : ["해당 없음"];
            } else {
                const withoutNone = prev.filter(v => v !== "해당 없음");
                return withoutNone.includes(value)
                    ? withoutNone.filter((v) => v !== value)
                    : [...withoutNone, value];
            }
        });
    };

    const handleBtn = async () => {
        if(!enable) {
            return;
        }
        try{
            setEnable(false);
            const res = await fetch("/prefer", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    preference: preferences,
                    session_id: sessionId
                })
            });

            if(!res.ok){
                console.log("Server connection failed..");
                setEnable(true);
                return;
            }
            navigate('/rating');
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
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{
                duration: 0.6,
                ease: 'easeInOut'
            }}  
        >
            <div className="container">
                <p style={{fontSize: "20px", fontWeight: "500"}}>{t('시뮬레이션 체험 결과는 어떠셨나요?', '')}</p>
                <p>{t('LLM 기반 파일 분류 및 정리 시스템의 좋았던 점들을 선택해주세요.', '')}</p>
                <div className="rating-box" >
                    <div className="rating-list center-horizontal" style={{margin: "40px", gap: "32px"}}>
                        <div className={`rating-element center-vertical ${preferences.includes("정확한 분류") && "selected"}`} onClick={()=>togglePreference("정확한 분류")}>
                            <p style={{marginTop: "8px"}}>👍</p>
                            <p style={{fontSize: "14px", fontWeight: "500", marginTop: "12px"}}>{t('정확한 분류','')}</p>
                        </div>
                        <div className={`rating-element center-vertical ${preferences.includes("실무 적합성") && "selected"}`} onClick={()=>togglePreference("실무 적합성")}>
                            <p style={{marginTop: "8px"}}>📋</p>
                            <p style={{fontSize: "14px", fontWeight: "500", marginTop: "12px"}}>{t('실무 적합성','')}</p>
                        </div>
                        <div className={`rating-element center-vertical ${preferences.includes("빠른 처리") && "selected"}`} onClick={()=>togglePreference("빠른 처리")}>
                            <p style={{marginTop: "8px"}}>🚀</p>
                            <p style={{fontSize: "14px", fontWeight: "500", marginTop: "12px"}}>{t('빠른 처리','')}</p>
                        </div>
                        <div className={`rating-element center-vertical ${preferences.includes("쉬운 사용") && "selected"}`} onClick={()=>togglePreference("쉬운 사용")}>
                            <p style={{marginTop: "8px"}}>😌</p>
                            <p style={{fontSize: "14px", fontWeight: "500", marginTop: "12px"}}>{t('쉬운 사용','')}</p>
                        </div>
                        <div className={`rating-element center-vertical ${preferences.includes("해당 없음") && "selected"}`} onClick={()=>togglePreference("해당 없음")}>
                            <p style={{marginTop: "8px"}}>⛔️</p>
                            <p style={{fontSize: "14px", fontWeight: "500", marginTop: "12px"}}>{t('해당 없음','')}</p>
                        </div>
                    </div>
                </div>
                <button className="btn-black" disabled={preferences.length === 0} style={{marginTop: "14px"}} onClick={handleBtn} >{t('다음으로','')}</button>
            </div>
        </ motion.div>
    )
}

export default Preference