import { useLanguage } from "../LanguageContext"
import { useNavigate } from "react-router-dom";
import './pages.css'
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function Done() {
    const { lang, setLang, t } = useLanguage();

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const _run = async () => {
            await sleep(1000);
            setVisible(true);
        }
        _run();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
                duration: 0.6,
                ease: 'easeInOut'
            }}  
        >
        <div className="container" style={{opacity: visible ? 1 : 0, transition: "opacity 2s ease"}}>
            <p style={{fontSize: "20px", fontWeight: "500"}}>{t('참여해주셔서 감사합니다 :)', 'Thank you for attending :)')}</p>
            <p>{t('응답해 주신 내용들은 논문 작성 및 연구 활동에 소중히 사용됩니다.', 'Thank you for attending :)')}</p>
            <p style={{fontSize: "12px", marginTop: "32px"}}>{t('관련 문의: diwjidghk78@gmail.com','')}</p>
        </div>
            
        </ motion.div>
    )
}

export default Done