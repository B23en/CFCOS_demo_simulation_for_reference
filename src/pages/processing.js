import { useLanguage } from "../LanguageContext"
import { useNavigate, useLocation } from "react-router-dom";
import './pages.css'
import { motion } from "framer-motion";
import gpt_logo from '../img/gpt_logo.png';
import rolling from '../img/rolling.gif';
import { useEffect, useState } from "react";
import { useSession } from "../SessionContext";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function Processing() {
    const { sessionId, setSessionId } = useSession();
    const { lang, setLang, t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const tags = location.state?.tags || [];

    console.log(tags);

    const [state, setState] = useState("태그 생성 중...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const _run = async () => {
            let res = await fetch("/set-tags", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tags: tags, session_id: sessionId })
            });
            if(!res.ok) {
                setState("😕 Something went wrong on the server..")
                setLoading(false);
                return;
            }
            setState("태그 기반 파일 분류 중.. 30초~1분 정도 소요될 수 있습니다.")

            res = await fetch("/tagging", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId})
            });
            if(!res.ok) {
                setState("😳 Something went wrong on the server..")
                setLoading(false);
                return;
            }

            setLoading(false);
            setState('✅');
            await sleep(1000);
            navigate("/results");
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
                <div className="img-box" style={{marginBottom: "64px"}}>
                    <img className="processing-img" src={gpt_logo} />
                </div>
                <p className="processing-txt" style={{margin: "4px"}}>{state}</p>
                {loading && <img className="rolling" src={rolling} />}
            </div>
        </ motion.div>
    )
}

export default Processing