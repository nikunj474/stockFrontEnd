import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import ThinkingLoader from "../../components/ThinkingLoader/ThinkingLoader";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getChat } from "../../lib/api";
import { useRef, useEffect } from "react";
import Markdown from "react-markdown";

const ChatPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const endRef = useRef(null);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["chat", id],
        queryFn: () => getChat(id),
        refetchOnWindowFocus: false,
        // Poll every 3s until the last message is from the model (AI responded)
        refetchInterval: (query) => {
            const history = query.state.data?.history;
            if (!history || history.length === 0) return 3000;
            const lastMsg = history[history.length - 1];
            return lastMsg?.role === "model" ? false : 3000;
        },
    });

    useEffect(() => {
        if (isError || (!isLoading && !data)) {
            navigate('/dashboard');
        }
    }, [isError, data, isLoading, navigate]);

    useEffect(() => {
        if (endRef.current) {
            setTimeout(() => {
                endRef.current.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [data]);

    return (
        <div className="chatPage">
            <div className="wrapper">
                <div className="chat">
                    {isLoading && <div>Loading...</div>}
                    {isError && <div>Something went wrong!</div>}
                    {(data?.history || []).map((message, i) => (
                        <div
                            className={message.role === "user" ? "message user" : "message"}
                            key={i}
                        >
                            <Markdown>{message.parts[0].text}</Markdown>
                        </div>
                    ))}
                    {(() => {
                        const history = data?.history;
                        if (history?.length > 0 && history[history.length - 1].role === "user") {
                            return <div className="message"><ThinkingLoader /></div>;
                        }
                        return null;
                    })()}
                    <div className="endChat" ref={endRef}></div>
                    <NewPrompt
                        chatId={id}
                        onNewMessage={async () => {
                            await refetch();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
