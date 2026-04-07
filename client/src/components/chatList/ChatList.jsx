// client/src/components/chatList/ChatList.jsx
import "./chatList.css";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteChat, getUserChats} from "../../lib/api";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import { RiDeleteBinLine } from 'react-icons/ri';

const ChatList = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ["userChats"],
        queryFn: getUserChats,
        refetchOnWindowFocus: false
    });

    const [openMenuChatId, setOpenMenuChatId] = useState(null);

    const handleDelete = async (chatId) => {
        await deleteChat(chatId);
        await queryClient.invalidateQueries(['userChats']);
        await queryClient.invalidateQueries(['chat', chatId]);

        if (location.pathname === `/dashboard/chats/${chatId}`) {
            navigate('/dashboard');
        }
    };

    useEffect(() => {
        const handleClickOutside = () => {
            setOpenMenuChatId(null);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="chatList">
            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <Link to="/dashboard/stock-analysis">Stock Analysis</Link>
            <Link to="/dashboard/news">Market News</Link>
            <Link to="/dashboard">Explore Stock AI</Link>
            <Link to="/">Contact</Link>
            <hr />
            <span className="title">RECENT CHATS</span>
            <div className="list">
                {isLoading
                    ? "Loading..."
                    : error
                        ? "Something went wrong!"
                        : (() => {
                            const now = new Date();

                            const getDateLabel = (createdAt) => {
                                const createdDate = new Date(createdAt);
                                const diffTime = now.getTime() - createdDate.getTime();
                                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                                if (diffDays < 1) {
                                    return 'Today';
                                } else if (diffDays < 2) {
                                    return 'Yesterday';
                                } else {
                                    return createdDate.toLocaleDateString();
                                }
                            };

                            const groupedChats = data.reduce((acc, chat) => {
                                const dateLabel = getDateLabel(chat.createdAt);
                                if (!acc[dateLabel]) {
                                    acc[dateLabel] = [];
                                }
                                acc[dateLabel].push(chat);
                                return acc;
                            }, {});

                            const dateGroups = Object.keys(groupedChats);

                            dateGroups.sort((a, b) => {
                                if (a === "Today") return -1;
                                if (b === "Today") return 1;
                                if (a === "Yesterday" && b !== "Today") return -1;
                                if (b === "Yesterday" && a !== "Today") return 1;
                                const aDate = a === "Today" || a === "Yesterday" ? now : new Date(a);
                                const bDate = b === "Today" || b === "Yesterday" ? now : new Date(b);
                                return bDate - aDate;
                            });

                            return (
                                <>
                                    {dateGroups.map((groupLabel) => (
                                        <div key={groupLabel}>
                                            <div className="groupLabel">{groupLabel}</div>
                                            {groupedChats[groupLabel].map((chat) => (
                                                <div key={chat._id} className="chatItem">
                                                    <Link to={`/dashboard/chats/${chat._id}`}>
                                                        {chat.title}
                                                    </Link>
                                                    <button
                                                        className="optionsButton"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenMenuChatId(openMenuChatId === chat._id ? null : chat._id);
                                                        }}>
                                                        ⋮
                                                    </button>

                                                    {openMenuChatId === chat._id && (
                                                        <div className="optionsMenu" onClick={(e) => e.stopPropagation()}>
                                                            <button onClick={() => {
                                                                handleDelete(chat._id);
                                                                setOpenMenuChatId(null);
                                                            }}>
                                                                <RiDeleteBinLine style={{ marginRight: '5px' }} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            );
                        })()}
            </div>
            <hr />
            <div className="upgrade">
                <div className="texts">
                    <span>Stock Chat AI</span>
                    <span>RAG-Powered Stock Analysis</span>
                </div>
            </div>
        </div>
    );
};

export default ChatList;
