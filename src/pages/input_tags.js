import { useLanguage } from "../LanguageContext"
import { useNavigate } from "react-router-dom";
import './pages.css'
import { motion } from "framer-motion";
import { useState, useRef } from "react";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function InputTags() {
    const { lang, setLang, t } = useLanguage();
    const navigate = useNavigate();

    const [btnState, setBtnState] = useState("Tagging!");
    const [tags, setTags] = useState([]);

    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        const _value = inputRef.current.value.trim();
        if (btnState === "Tagging!" && e.key === 'Enter' && tags.length < 10 && _value !== '' && !tags.includes(_value)) {
            setTags([...tags, _value]);
            inputRef.current.value = '';
            console.log(_value);
        }
    }

    const handleBtn = async () => {
        setBtnState('✅');
        await sleep(500);
        navigate("/processing", {
            state: { tags }
        });
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
                <div className="tag-list">
                    {
                        tags.length !== 0
                        ? tags.map((tag) => <h2 className="h2" key={tag} onClick={() => { btnState === 'Tagging!' && setTags(tags.filter(t => t !== tag))}} >{tag}</h2>)
                            : <h2 className="h2-placeholder" style={{ color: "rgba(116, 116, 116, 1)" }}>아무 입력없이 Tagging을 누르면 자동으로 태그를 생성합니다</h2>
                    }
                </div>
                <div className="tag-input-box center-vertical" >
                    <p style={{fontSize: "14px"}}>{t('분류 기준(키워드) 입력 후 Enter를 입력해보세요','')}</p>
                    <p style={{fontSize: "14px"}}>{t('추가된 키워드는 클릭해서 제거할 수 있습니다','')}</p>
                    <p style={{fontSize: "14px"}}>{`(${tags.length}/10)`}</p>
                    <input type="text" onKeyDown={handleKeyDown} ref={inputRef} style={{marginTop: "8px", width: "200px", textAlign: "center"}} />
                </div>
                <button className="btn-black" style={{marginTop: "32px", width: "100px", height: "36px"}} onClick={handleBtn}>{btnState}</button>
            </div>
        </ motion.div>
    )
}

export default InputTags