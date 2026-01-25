import { useLanguage } from "../LanguageContext"
import { useNavigate, useLocation } from "react-router-dom";
import './pages.css'
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import demo_flow from '../img/demo_flow.png';
import { useSession } from "../SessionContext";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function Explanation() {
    const { sessionId, setSessionId } = useSession();
    const { lang, setLang, t } = useLanguage();
    const navigate = useNavigate();

    const handleBtn = () => {
        navigate("/selection");
    }

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
                <img className="demo-flow" src={demo_flow} />
                <div className="center-vertical" style={{marginTop: "16px"}}>
                    <p style={{fontSize: "18px", fontWeight: "500"}} >본 시뮬레이션은 위와 같은 순서로 진행됩니다.</p>
                    <p>테스트 케이스 파일 구성을 미리 확인하고, 분류 기준을 선택하여 실제 분류 결과를 확인할 수 있습니다.</p>
                </div> 
                <button className="btn-black" style={{ marginTop: "32px", width: "100px", height: "36px" }} onClick={handleBtn}>다음으로</button>
            </div>
        </ motion.div>
    )
}

export default Explanation