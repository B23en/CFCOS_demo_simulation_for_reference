import { useLanguage } from "../LanguageContext"
import { useLocation, useNavigate } from "react-router-dom";
import './pages.css'
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { FaRegFile, FaRegFileLines, FaRegFileImage } from "react-icons/fa6";
import { useSession } from "../SessionContext";

function File({file_name = "None", file_summary = "None...", onClick}) {
    const lowerFileName = file_name.toLowerCase();
    return (
        <div className="file-info" onClick={onClick} title={file_summary}>
            <span style={{display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px"}}>
                {lowerFileName.endsWith('.txt') ? (
                    <FaRegFileLines />
                ) : lowerFileName.endsWith('.jpg') || lowerFileName.endsWith('.png') ? (
                    <FaRegFileImage />
                ) : (
                    <FaRegFile />
                )}
                <p style={{fontSize: "14px", fontWeight: "600"}}>{file_name}</p>
            </span>
            <p style={{fontSize: "12px"}}>{file_summary}</p>
        </div>
    )
}

function Case({case_num = 0, case_symbol = "", case_name = "None", case_description = "None...", selected = 0, setSelected}){
    return (
        <div className={`case ${selected === case_num && "selected"}`} onClick={() => setSelected(case_num)}>
            <p style={{fontSize: "14px", fontWeight: "600"}}>[Case{case_num}] - {case_symbol}</p>
            <p style={{fontSize: "14px", fontWeight: "600", marginBottom: "8px"}}>: {case_name}</p>
            <p style={{fontSize: "12px"}}>{case_description}</p>
        </div>
    )
}

function Selection() {
    const { sessionId, setSessionId } = useSession();
    const { lang, setLang, t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    const [isRetry, setIsRetry] = useState(location.state?.isRetry);
    const [selected, setSelected] = useState(1);

    const [semanticSummary, setSemanticSummary] = useState({});

    const [popupFile, setPopupfile] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const popupRef = useRef();

    const case_symbols = ["😾 🏞️ 🍔", "📉 📝 ✏️", "❓❓❓"];

    useEffect(() => {
        const _run = async () => {
            let res = await fetch("/load", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId})
            });
            if(!res.ok) {
                console.log("Failed to load semantic summary.")
                return;
            }

            res = await fetch("/get-semantic-summary", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId})
            });
            if(!res.ok) {
                console.log("Failed to get semantic summary.")
                return;
            }

            const data = await res.json();
            console.log(data['response']);
            setSemanticSummary(data['response']);
        };
        _run();
    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setPopupfile(null);
            }
        }
        if (popupFile) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [popupFile]);

    useEffect(() => {
        if (!popupFile) return;

        const fetchFileContent = async () => {
            const filePath = `/samples/test_case_${selected}/${encodeURIComponent(popupFile.file_name)}`;
            if (popupFile.file_name.toLowerCase().endsWith(".txt")){
                const res = await fetch(filePath);
                const text = await res.text();
                setFileContent({ type: "text", data: text });
            } else if (popupFile.file_name.toLowerCase().match(/\.(jpg|png)$/)) {
                setFileContent({ type: "image", data: filePath });
            } else {
                setFileContent({ type: "text", data: "File read err."});
            }
        }

        fetchFileContent();
    }, [popupFile, selected]);

    const handleNextBtn = async () => {
        const res = await fetch("select-case", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selected: selected, session_id: sessionId })
            });
        if (!res.ok){
            console.log("Failed to set the test case.");
            return;
        }
        navigate('/input-tags');
    };

    return (
        <motion.div
            initial={{ x: isRetry ? '0' : '100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{
                duration: 0.6,
                ease: 'easeInOut'
            }}  
        >
            <div className="container">
                <div className="middle-box center-horizontal">
                    <div className="file-list-box" style={{marginBottom: "32px"}}>
                        <p style={{fontSize: "18px", fontWeight: "600"}}>{t('시연을 진행할 테스트 케이스를 선택한 후, "다음으로" 버튼을 누르세요','')}</p>
                        {/* <p style={{fontSize: "14px", marginBottom: "8px"}}>[Case{selected} - {case_symbols[selected-1]}]의 구성을 미리 확인하고, 분류 태그(카테고리)를 생각해보세요</p> */}
                        <p style={{fontSize: "14px"}}>선택한 테스트 케이스(파일 구성)에서 분류 작업을 진행하게 됩니다.</p>
                        <p style={{fontSize: "14px", marginBottom: "8px"}}>아래에서 파일 구성을 미리 확인해보세요.</p>
                        <div className="file-list">
                            {
                                semanticSummary[`test_case_${selected}`] &&
                                Object.entries(semanticSummary[`test_case_${selected}`]).map(([file_name, file_summary]) => (
                                    <File 
                                        key={file_name} 
                                        file_name={file_name} 
                                        file_summary={file_summary} 
                                        onClick={() => setPopupfile({ file_name, file_summary })}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    <div className="case-list center-vertical" style={{marginTop: "24px"}}>
                        <Case case_num={1} case_symbol={case_symbols[0]} case_name={"동물, 풍경, 음식 등과 관련된 다양한 파일들"} case_description={"동물, 풍경, 음식 등의 다양한 텍스트 및 이미지 파일들을 모아놓은 테스트 케이스 입니다."} selected={selected} setSelected={setSelected} />
                        <Case case_num={2} case_symbol={case_symbols[1]} case_name={"학업, 직장과 관련된 다양한 문서 파일들"} case_description={"학업 및 직장과 관련된 다양한 문서 파일들을 모아놓은 테스트 케이스 입니다."} selected={selected} setSelected={setSelected}/>
                        <Case case_num={3} case_symbol={case_symbols[2]} case_name={"무작위의 다양한 파일들"} case_description={"파일 구성 파악이 힘든 상황을 가정한 무작위 파일들을 모아놓은 테스트 케이스 입니다."} selected={selected} setSelected={setSelected}/>
                    </div>
                </div>    
                <button className="btn-black" onClick={handleNextBtn}>{t('다음으로','')}</button>
            </div>

            {popupFile && (
                <div className="modal-overlay">
                    <div className="modal-content" ref={popupRef}>
                        <p style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>[{popupFile.file_name}]</p>
                        <p style={{fontSize: "14px", fontWeight: "500"}}>File Content:</p>
                        {fileContent ? (
                            fileContent.type === "text" ? (
                                <pre style={{
                                    whiteSpace: "pre-wrap",
                                    wordWrap: "break-word",
                                    maxHeight: "400px",
                                    overflowY: "auto"
                                }}>
                                    {fileContent.data}
                                </pre>
                            ) : (
                                <img
                                    src={fileContent.data}
                                    alt={popupFile.file_name}
                                    style={{ maxWidth: "512px", maxHeight: "512px" }}
                                />
                            )
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            )}
        </ motion.div>
    )
}

export default Selection