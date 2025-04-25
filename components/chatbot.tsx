"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle } from "lucide-react";

export default function ChatBotToggle() {
    const [isOpen, setIsOpen] = useState(false);
    const [showIcon, setShowIcon] = useState(true); // track icon visibility
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi there! How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Predefined list of keywords and their corresponding responses
    const keywordResponses = [
        {
            keywords: ["DeNate", "about denate", "what is this website about"],
            response: "DeNate is a platform that helps connect donors with charitable organizations. We facilitate easy and secure donations to various causes."
        },
        {
            keywords: ["campaign", "campaigns", "see campaigns", "active campaign"],
            response: "You can view the list of active campaigns by visiting the 'Donate' section of our website. Check out the ongoing campaigns and their details."
        },
        {
            keywords: ["donation", "donate", "give money", "money goes to", "money go"],
            response: "Your donations go to various causes. The funds are managed by the organizations hosting the campaigns, ensuring transparency and proper allocation."
        },
        {
            keywords: ["donor", "become a donor", "how to donate"],
            response: `To become a donor, follow these steps:\n1. Log in to our platform and create your donor profile.\n2. Once logged in, you’ll be redirected to your dashboard.\n3. Browse and view all active donation campaigns.\n4. Select a campaign you’d like to support.\n5. Follow the on-screen instructions to complete your donation.\n\nThank you for making a difference! 💙`
        },
        {
            keywords: ["organization", "register org", "charity organization"],
            response: `To register your organization and host a campaign, follow these steps:\n1. Click the 'Sign Up' button and choose 'Register as Organization'.\n2. Fill in your organization details and upload the required verification documents.\n3. Once verified, your organization account will be activated.\n4. Log in and go to your dashboard.\n5. Click 'Create Campaign' and fill in the campaign form.\n6. Submit the form — your campaign will be reviewed and published shortly.\n\nWe’re excited to have you onboard! 🤝`
        },
        {
            keywords: ["contact", "support", "help", "need help", "message", "inquiry", "ask"],
            response: "You may reach out to us via email: admin@denate.com or drop us a message at our telegram: @denate_admin."
        },
        {
            keywords: ["hi", "hello"],
            response: "Hi, Welcome to DeNate! How can I assist you today?"
        }
    ];

    const handleMessageMatch = (input: string) => {
        const normalizedInput = input.toLowerCase();

        for (const entry of keywordResponses) {
            if (entry.keywords.some(keyword => normalizedInput.includes(keyword.toLowerCase()))) {
                return entry.response;
            }
        }

        return null;
    };

    const sendMessage = () => {
        if (!input.trim()) return;
        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        // Show loading state with 3 dots
        setMessages((prev) => [...prev, { sender: "bot", text: "..." }]);

        // Wait for 2 seconds and then show the response
        setTimeout(() => {
            const botResponse = handleMessageMatch(input);
            if (botResponse) {
                // Remove the loading dots and show the bot response
                setMessages((prev) => {
                    const updatedMessages = prev.filter(msg => msg.text !== "...");
                    return [...updatedMessages, { sender: "bot", text: botResponse }];
                });
            } else {
                setTimeout(() => {
                    const botReplies = [
                        "Sorry, I didn't quite get that. Can you please try again?",
                    ];
                    const botMessage = {
                        sender: "bot",
                        text: botReplies[Math.floor(Math.random() * botReplies.length)]
                    };
                    setMessages((prev) => {
                        const updatedMessages = prev.filter(msg => msg.text !== "...");
                        return [...updatedMessages, botMessage];
                    });
                }, 1000);
            }
        }, 3000); // 3 second delay before bot responds
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") sendMessage();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleOpen = () => {
        setShowIcon(false);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false); // let it fade out
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence
                onExitComplete={() => {
                    // Only show icon after fade out finishes
                    setShowIcon(true);
                }}
            >
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="w-[350px] h-[500px] bg-white shadow-2xl rounded-xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-blue-600 text-white text-center py-3 rounded-t-xl font-bold relative">
                            Chat Assistant
                            <button
                                className="absolute top-3 right-3"
                                onClick={handleClose}
                            >
                                <X className="text-white w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${msg.sender === "user"
                                            ? "ml-auto bg-blue-500 text-white"
                                            : "mr-auto bg-gray-200 text-gray-800"
                                            }`}
                                    >
                                        {msg.text === "..." ? (
                                            <div className="dots-fade">
                                                <span>.</span>
                                                <span>.</span>
                                                <span>.</span>
                                            </div>
                                        ) : (
                                            msg.text.split('\n').map((line, index) => (
                                                <p key={index} className="mb-1">{line}</p>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="flex border-t p-3 bg-white">
                            <input
                                type="text"
                                className="flex-1 border rounded-l-lg px-4 py-2 outline-none"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Circle button only shown when closed */}
            {showIcon && (
                <button
                    onClick={handleOpen}
                    className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
                >
                    <MessageCircle className="text-white w-6 h-6" />
                </button>
            )}

            {/* Inline CSS for animation */}
            <style jsx>{`
                @keyframes fadeInDot {
                    0% {
                        opacity: 0;
                    }
                    33% {
                        opacity: 1;
                    }
                    66% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 0;
                    }
                }

                .dots-fade span {
                    display: inline-block;
                    font-size: 1.5rem;
                    opacity: 0;
                    animation: fadeInDot 1.5s ease-in-out infinite;
                }

                .dots-fade span:nth-child(1) {
                    animation-delay: 0s;
                }

                .dots-fade span:nth-child(2) {
                    animation-delay: 0.5s;
                }

                .dots-fade span:nth-child(3) {
                    animation-delay: 1s;
                }
            `}</style>
        </div>
    );
}