import { useLanguage } from "../LanguageContext"
import { useNavigate } from "react-router-dom";
import './pages.css'
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSession } from "../SessionContext";

import { FaTag } from "react-icons/fa6";
import { FaRegFile, FaRegFileLines, FaRegFileImage } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaHashtag } from "react-icons/fa";

function Tag({tag_name="tag", tag_color=""}){
    return (
        <div className="color-tag">
            <span style={{display: "flex", alignItems: "center", gap: "4px"}}>
                {tag_name === "_untagged" ? <FaHashtag style={{color: "#5e5e5eff"}} /> : <FaTag style={{color: tag_color}}/>}<p style={{fontSize: "14px", fontWeight: "500", marginBottom: "2px"}}>{tag_name}</p>
            </span>
        </div>
    )
}

function File({file_name="None", file_summary="None...", tag="tag", color="#676767", _Cnt}){
    if(tag === "_untagged") {
        color = "#5e5e5eff";
    }
    const lowerFileName = file_name.toLowerCase();
    return (
        <div className="file-tag" title={file_summary} onClick={_Cnt}>
            <span style={{display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px"}}>
                {lowerFileName.endsWith('.txt') ? (
                    <FaRegFileLines style={{color: color}} />
                ) : lowerFileName.endsWith('.jpg') || lowerFileName.endsWith('.png') ? (
                    <FaRegFileImage style={{color: color}} />
                ) : (
                    <FaRegFile style={{color: color}} />
                )}
                <p className="hash-tag" style={{fontSize: "14px", fontWeight: "600"}}>{file_name} <span style={{color: color, fontSize: "12px"}}>#{tag}</span></p>
            </span>
            <p style={{fontSize: "12px"}}>{file_summary}</p>
        </div>
    )
}

function Results() {
    const { sessionId, setSessionId } = useSession();
    const { lang, setLang, t } = useLanguage();
    const navigate = useNavigate();

    const colorList = [
        "#f95555ff",
        "#fdc763ff",
        "#64a3f5ff",
        "#8aeb77ff",
        "#ff9a1fff",
        "#c271e8ff",
        "#f076b5ff",
        "#8bdfd5ff",
        "#b3d43aff",
    ];

    const [isRetry, setIsRetry] = useState(false);
    const [semanticSummary, setSemanticSummary] = useState({});
    const [selected, setSelected] = useState(0);
    const [structure, setStructure] = useState([]);
    const [tags, setTags] = useState(["test_tag",]);

    const [popupFile, setPopupFile] = useState(null);
    const [fileContent, setFileContent] = useState(null);
    const popupRef = useRef();

    const [_cnt, _setCnt] = useState(0);
    const _Cnt = () => {
        _setCnt(_cnt + 1);
        console.log(_cnt + 1);
    };

    const handleRetryBtn = () => {
        // must # of attempts limit
        setIsRetry(true);
        navigate('/selection', {
            state: {
                isRetry: true
            }
        });
    }

    useEffect(() => {
        const _run = async () => {
            let res = await fetch("/get-semantic-summary", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId})
            });
            if(!res.ok) {
                console.log("Failed to get semantic summary.");
                return;
            }
            let data = await res.json();
            setSemanticSummary(data['response']);

            res = await fetch("/get-selected", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId})
            });
            if(!res.ok) {
                console.log("Failed to get selected.");
                return;
            }
            data = await res.json();
            setSelected(data['response']);

            res = await fetch("/get-structure", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId})
            });
            if(!res.ok) {
                console.log("Failed to get structure.");
                return;
            }
            data = await res.json();
            let _tmp = Object.entries(data['response']);
            const _structure = [
                ..._tmp.filter(([tag]) => tag !== "_untagged"),
                ..._tmp.filter(([tag]) => tag === "_untagged"),
            ]
            setStructure(_structure);
            _tmp = Object.keys(data['response']);
            const _tags = [
                ..._tmp.filter(t => t !== "_untagged"),
                ..._tmp.filter(t => t === "_untagged"),
            ];
            setTags(_tags);
        }
        _run();
    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setPopupFile(null);
                setFileContent(null);
            }
        }
        if (popupFile) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [popupFile]);

    useEffect(() => {
        if (!popupFile) return;
        const safeFileName = encodeURIComponent(popupFile.file_name);
        const filePath = `/samples/test_case_${selected}/${safeFileName}`;

        const fetchFile = async () => {
            if (popupFile.file_name.toLowerCase().endsWith(".txt")) {
                const res = await fetch(filePath);
                if (!res.ok) {
                    setFileContent({ type: "text", data: "⚠ 파일을 불러올 수 없습니다." });
                    return;
                }
                const text = await res.text();
                setFileContent({ type: "text", data: text });
            } else if (popupFile.file_name.toLowerCase().match(/\.(jpg|png)$/)) {
                setFileContent({ type: "image", data: filePath });
            }
        };
        fetchFile();
    }, [popupFile, selected]);

    const handleRateBtn = () => {
        navigate('/preference');
    }

    return (
        <motion.div
            initial={{ x: '100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRetry ? '0' : '-100vw', opacity: 0 }}
            transition={{
                duration: 0.6,
                ease: 'easeInOut'
            }}  
        >
            <div className="container">
                <div className="center-vertical" style={{gap: "12px"}}>
                    <div className="center-vertical">
                        <p style={{fontSize: "18px", fontWeight: "600"}}>{t('파일 분류 및 정리 결과를 확인해보세요','')}</p>
                        <p style={{ fontSize: "14px"}}>선택하신 테스트 케이스와 분류 기준을 바탕으로 파일 분류가 진행된 결과입니다.</p>
                        <p style={{fontSize: "14px"}}>시연을 충분히 완료하셨다면 "평가하기"를 눌러주세요</p>   
                    </div>
                    <div className="tag-colors center-vertical">
                        {
                            tags.map((tag, index) => (<Tag key={tag} tag_name={tag} tag_color={colorList[index % colorList.length]} />))
                        }
                    </div>
                    <div className="result-list">
                        {
                            semanticSummary[`test_case_${selected}`] &&
                            structure.map(([tag, files], tagIdx) => files.map((fileName) => (
                                <File
                                    key={fileName + "_" + tag}
                                    file_name={fileName}
                                    file_summary={semanticSummary[`test_case_${selected}`][fileName]}
                                    tag={tag}
                                    color={colorList[tagIdx % colorList.length]}
                                    _Cnt={() => setPopupFile({ file_name: fileName, tag})}
                                />
                            )))
                        }
                    </div>
                </div>
                <span className="center-horizontal" style={{marginTop: "6px", gap: "4px", color: "#404040ff"}}><IoMdInformationCircleOutline /><p style={{fontSize: "14px"}}>본 시뮬레이션에서의 태그는 최대 10개까지 가능합니다.</p></span>
                <div className="center-horizontal" style={{gap: "24px", marginTop: "32px"}}>
                    <button className="btn" onClick={handleRetryBtn}>{t('다시 해보기', 'Try again')}</button>
                    <button className="btn-black" onClick={handleRateBtn}>{t('평가하기', 'Rate')}</button>
                </div>
            </div>

            {popupFile && (
                <div className="modal-overlay">
                    <div className="modal-content" ref={popupRef}>
                        <p style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>
                            [{popupFile.file_name}]
                        </p>
                        <p style={{ fontSize: "14px", fontWeight: "500" }}>File Content:</p>
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

export default Results