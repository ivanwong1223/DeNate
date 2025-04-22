"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle, BarChart3, HelpCircle, Info } from "lucide-react";
import axios from "axios";
import { Organization } from "@/lib/types";

// Define the Campaign interface to match the dashboard page structure
interface Campaign {
  id: string;
  address: string;
  title: string;
  description: string;
  goal: string;
  raised: string;
  daysLeft: number;
  donors: number;
  state?: number;
  milestones?: {
    title: string;
    amount: string;
    status: string;
  }[];
  images?: string[];
  imageURI?: string;
}

interface OrgChatbotProps {
  orgData: Partial<Organization>;
  campaigns: Campaign[]; 
  totalRaised: string;
  totalGoal: string;
  totalDonors: number;
}

export default function OrgChatbot({ orgData, campaigns, totalRaised, totalGoal, totalDonors }: OrgChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showIcon, setShowIcon] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [messages, setMessages] = useState([
    { sender: "bot", text: `Hi ${orgData?.name || "there"}! How can I help you today?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Hide tooltip after 20 seconds
  useEffect(() => {
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 20000);

    return () => clearTimeout(tooltipTimer);
  }, []);

  // Quick action suggestions
  const quickActions = [
    { icon: <HelpCircle className="w-4 h-4 mr-2" />, text: "How to create a campaign?", value: "How to create a campaign?" },
    { icon: <BarChart3 className="w-4 h-4 mr-2" />, text: "Show campaign analytics", value: "Can you analyze my campaign performance?" },
    { icon: <Info className="w-4 h-4 mr-2" />, text: "Donation limits", value: "What is the maximum donation limit?" }
  ];

  // Send message to the AI API
  const sendMessageToAPI = async (userMessage: string) => {
    setIsLoading(true);
    try {
      // Prepare context data to send with the request
      const contextData = {
        orgName: orgData?.name || "",
        orgVerified: orgData?.verified || false,
        activeCampaigns: campaigns.filter(c => c.state === 0).length,
        totalCampaigns: campaigns.length,
        totalRaised,
        totalGoal,
        totalDonors,
        // Include campaign names and their raised amounts
        campaignDetails: campaigns.map(c => ({
          name: c.title,
          raised: c.raised,
          goal: c.goal,
          donors: c.donors,
          state: c.state === 0 ? "active" : "completed"
        }))
      };

      // Add context to the user message
      const enhancedUserMessage = `
        [CONTEXT]
        Organization: ${contextData.orgName}
        Verified: ${contextData.orgVerified}
        Active Campaigns: ${contextData.activeCampaigns}
        Total Campaigns: ${contextData.totalCampaigns}
        Total Raised: ${contextData.totalRaised} ETH
        Total Goal: ${contextData.totalGoal} ETH
        Total Donors: ${contextData.totalDonors}
        Campaign Details: ${JSON.stringify(contextData.campaignDetails)}
        [/CONTEXT]
        
        User Query: ${userMessage}
      `;

      const response = await axios.post("/api/organizations/chatbot-api", {
        query: enhancedUserMessage
      });

      return response.data.response;
    } catch (error) {
      console.error("Error sending message to API:", error);
      return "Sorry, I encountered an error processing your request. Please try again later.";
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Show loading state
    setMessages((prev) => [...prev, { sender: "bot", text: "..." }]);

    // Send to the API and get response
    const botResponse = await sendMessageToAPI(input);

    // Remove loading indicator and add response
    setMessages((prev) => {
      const updatedMessages = prev.filter(msg => msg.text !== "...");
      return [...updatedMessages, { sender: "bot", text: botResponse }];
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleQuickAction = (actionValue: string) => {
    setInput(actionValue);
    // Don't automatically send to allow user to edit if needed
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpen = () => {
    setShowIcon(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 flex items-end justify-end h-[80vh] pointer-events-none">
      <AnimatePresence
        onExitComplete={() => {
          setShowIcon(true);
        }}
      >
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="pointer-events-auto h-full w-[350px] bg-card shadow-xl flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="bg-white text-black px-4 py-3 border-b border-border flex justify-between items-center">
              <h3 className="font-bold">
                {orgData?.name ? `${orgData.name} Assistant` : 'Organization Assistant'}
              </h3>
              <button
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background/50">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                      msg.sender === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-muted text-foreground"
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

            {/* Quick actions */}
            <div className="px-3 py-2 bg-muted/30 border-t border-border gap-2 flex overflow-x-auto">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.value)}
                  disabled={isLoading}
                  className="flex items-center bg-background px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap hover:bg-primary/10 border border-border"
                >
                  {action.icon}
                  {action.text}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex border-t border-border p-3 bg-card">
              <input
                type="text"
                className="flex-1 bg-background border-border border rounded-l-lg px-4 py-2 outline-none text-foreground"
                placeholder="What do you want to know?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                className="bg-primary text-primary-foreground px-4 rounded-r-lg hover:bg-primary/90 disabled:opacity-50"
                disabled={isLoading || !input.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circle button only shown when closed */}
      {showIcon && (
        <div className="pointer-events-auto fixed bottom-6 right-6">
          {/* Tooltip with waving hand */}
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 chat-tooltip-container">
              <div className="bg-white text-black px-3 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center chat-tooltip min-w-[160px]">
                <span className="waving-hand mr-2">👋</span>
                <span>Hey, Chat with us</span>
                <div className="absolute -bottom-2 right-4 w-3 h-3 bg-white transform rotate-45"></div>
              </div>
            </div>
          )}
          
          <button
            onClick={() => {
              setShowTooltip(false);
              handleOpen();
            }}
            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition"
          >
            <MessageCircle className="text-black w-6 h-6" />
          </button>
        </div>
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

        /* Chat tooltip animations */
        .chat-tooltip-container {
          animation: bounce 3s ease-in-out infinite;
        }

        .chat-tooltip {
          animation: fadeInOut 3s ease-in-out infinite;
        }

        .waving-hand {
          display: inline-block;
          animation: wave 1.5s ease-in-out infinite;
          transform-origin: 70% 70%;
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 1; }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60%, 100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
} 