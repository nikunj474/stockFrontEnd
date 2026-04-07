// import { useEffect, useRef, useState } from "react";
// import "./newPrompt.css";
// import Upload from "../upload/Upload";
// import { IKImage } from "imagekitio-react";
// import { queryRAG } from "../../lib/api";
// import Markdown from "react-markdown";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
//
// const NewPrompt = ({ data }) => {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [img, setImg] = useState({
//     isLoading: false,
//     error: "",
//     dbData: {},
//     aiData: {},
//   });
//
//   const endRef = useRef(null);
//   const formRef = useRef(null);
//
//   useEffect(() => {
//     endRef.current.scrollIntoView({ behavior: "smooth" });
//   }, [data, question, answer, img.dbData]);
//
//   const queryClient = useQueryClient();
//
//   const mutation = useMutation({
//     mutationFn: () => {
//       return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
//         method: "PUT",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           question: question.length ? question : undefined,
//           answer,
//           img: img.dbData?.filePath || undefined,
//         }),
//       }).then((res) => res.json());
//     },
//     onSuccess: () => {
//       queryClient
//         .invalidateQueries({ queryKey: ["chat", data._id] })
//         .then(() => {
//           formRef.current.reset();
//           setQuestion("");
//           setAnswer("");
//           setImg({
//             isLoading: false,
//             error: "",
//             dbData: {},
//             aiData: {},
//           });
//         });
//     },
//     onError: (err) => {
//       console.log(err);
//     },
//   });
//
//   const add = async (text, isInitial) => {
//     if (!isInitial) setQuestion(text);
//
//     try {
//       const response = await queryRAG(text);
//       if (response.data) {
//         setAnswer(response.data.answer);
//       }
//     } catch (err) {
//       console.error(err);
//       setAnswer("Sorry, something went wrong.");
//     }
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//
//     const text = e.target.text.value;
//     if (!text) return;
//
//     add(text, false);
//   };
//
//   // IN PRODUCTION WE DON'T NEED IT
//   const hasRun = useRef(false);
//
//   useEffect(() => {
//     if (!hasRun.current) {
//       if (data?.history?.length === 1) {
//         add(data.history[0].parts[0].text, true);
//       }
//     }
//     hasRun.current = true;
//   }, []);
//
//   return (
//     <>
//       {/* ADD NEW CHAT */}
//       {img.isLoading && <div className="">Loading...</div>}
//       {img.dbData?.filePath && (
//         <IKImage
//           urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
//           path={img.dbData?.filePath}
//           width="380"
//           transformation={[{ width: 380 }]}
//         />
//       )}
//       {question && <div className="message user">{question}</div>}
//       {answer && (
//         <div className="message">
//           <Markdown>{answer}</Markdown>
//         </div>
//       )}
//       <div className="endChat" ref={endRef}></div>
//       <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
//         <Upload setImg={setImg} />
//         <input id="file" type="file" multiple={false} hidden />
//         <input type="text" name="text" placeholder="Ask anything..." />
//         <button>
//           <img src="/arrow.png" alt="" />
//         </button>
//       </form>
//     </>
//   );
// };
//
// export default NewPrompt;

// client/src/components/newPrompt/NewPrompt.jsx
import {useState, useRef, useEffect} from "react";
import "./newPrompt.css";
import { updateChat } from "../../lib/api";
import ThinkingLoader from "../ThinkingLoader/ThinkingLoader";
import Markdown from "react-markdown";

// const NewPrompt = ({ chatId, onNewMessage }) => {
//   const formRef = useRef(null);
//   const [loading, setLoading] = useState(false);
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const text = e.target.text.value;
//     if (!text) return;
//     setLoading(true);
//     try {
//       await updateChat(chatId, text);
//       onNewMessage(); // 刷新对话数据
//       formRef.current.reset();
//     } catch (err) {
//       console.error(err);
//     }
//     setLoading(false);
//   };
//
//   return (
//       <>
//         {loading && <div className="loading">Thinking...</div>}
//         <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
//           <input type="text" name="text" placeholder="Ask about stocks..." />
//           <button>
//             <img src="/arrow.png" alt="" />
//           </button>
//         </form>
//       </>
//   );
// };
const NewPrompt = ({ chatId, onNewMessage }) => {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;

    setCurrentQuestion(text);
    setLoading(true);
    formRef.current.reset();

    try {
      await updateChat(chatId, text);
      await onNewMessage();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
    setCurrentQuestion("");
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.autocomplete = "off";
    }
  }, []);

  return (
      <>
        {currentQuestion && (
            <div className="message user">
              <Markdown>{currentQuestion}</Markdown>
            </div>
        )}
        {loading && (
            <div className="message">
              <ThinkingLoader />
            </div>
        )}
        <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
          <input type="text"
                 name="text"
                 placeholder="Ask about stocks..."
                 autoComplete="off"  />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </>
  );
};

export default NewPrompt;
