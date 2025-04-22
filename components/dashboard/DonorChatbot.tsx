"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle, BarChart3, HelpCircle, Info, Wallet, Gift, History } from "lucide-react";
import axios from "axios";
import { useAccount } from "wagmi";
import { Donor } from "@/lib/types";
import { ethers } from "ethers";
import { charityCentral_ABI, charityCentral_CA, charityCampaigns_ABI } from "@/config/contractABI";

interface Campaign {
  address: string;
  name: string;
  description: string;
  imageURI: string;
  goal: string;
  totalDonated: string;
  state: number;
  charityAddress: string;
  donors: number;
  daysLeft: number;
  images?: string[];
  userDonation?: string;
}

interface Donation {
  campaignId: string;
  campaignName: string;
  amount: string;
  date: string;
}

interface DonorChatbotProps {
  donorName?: string;
  walletAddress?: string;
  totalDonated?: string;
  donationsCount?: number;
  recentDonations?: Donation[];
}

export default function DonorChatbot({ 
  donorName: propDonorName, 
  walletAddress: propWalletAddress, 
  totalDonated = "0", 
  donationsCount = 0, 
  recentDonations = [] 
}: DonorChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const [showIcon, setShowIcon] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [orgData, setOrgData] = useState<Partial<Donor> | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [campaignDetails, setCampaignDetails] = useState<Campaign[]>([]);
  const [activeDonations, setActiveDonations] = useState<Donation[]>([]);
  
  // Determine the actual wallet address to use - from props or wagmi hook
  const walletAddress = propWalletAddress || address || "";

  // Fetch donor data by wallet address
  useEffect(() => {
    const fetchOrgData = async () => {
      if (!walletAddress) return;
      
      try {
        const response = await fetch(`/api/donors/getByWallet?walletAddress=${walletAddress}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch donor data");
        }

        setOrgData(data);
        
        // Set initial welcome message now that we have the donor name
        if (messages.length === 0) {
          const donorName = data?.name || propDonorName || "there";
          setMessages([
            { 
              sender: "bot", 
              text: `Hi ${donorName}! How can I help you with your donations today?` 
            }
          ]);
        }
      } catch (err) {
        console.error("Error fetching donor data:", err);
        
        // Set default welcome message if there was an error
        if (messages.length === 0) {
          setMessages([
            { 
              sender: "bot", 
              text: `Hi there! How can I help you with your donations today?` 
            }
          ]);
        }
      }
    };

    fetchOrgData();
  }, [walletAddress, isConnected, propDonorName, messages.length]);

  // Fetch active campaigns
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (typeof window.ethereum === "undefined") {
        console.error("MetaMask not detected. Please install a wallet.");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = await provider.getSigner();

        const centralContract = new ethers.Contract(
          charityCentral_CA,
          charityCentral_ABI,
          signer
        );

        const campaignAddresses = await centralContract.getAllCampaigns();
        
        const campaignInterface = new ethers.Interface(charityCampaigns_ABI);

        const detailedCampaigns = await Promise.all(
          campaignAddresses.map(async (address: string) => {
            const campaignContract = new ethers.Contract(
              address,
              campaignInterface,
              signer
            );

            const details = await campaignContract.getCampaignDetails();
            
            // Check if this donor has donated to this campaign
            let donorInfo = { totalDonated: "0" };
            try {
              if (walletAddress) {
                donorInfo = await campaignContract.donors(walletAddress);
              }
            } catch (error) {
              console.error("Error fetching donor info for campaign:", error);
            }

            return {
              address,
              name: details._name,
              description: details._description,
              imageURI: details._campaignImageURI || '',
              goal: ethers.formatEther(details._goal),
              totalDonated: ethers.formatEther(details._totalDonated),
              state: Number(details._state),
              charityAddress: details._charityAddress,
              donors: Math.floor(Math.random() * 100), // Placeholder value
              daysLeft: Math.floor(Math.random() * 50), // Placeholder value
              userDonation: ethers.formatEther(donorInfo.totalDonated || "0"),
            };
          })
        );

        // Filter active campaigns (state === 0)
        const activeCampaigns = detailedCampaigns.filter(
          (campaign) => campaign.state === 0
        );

        setCampaignDetails(activeCampaigns);
        
        // Find campaigns this donor has supported
        const userDonations = detailedCampaigns
          .filter(campaign => parseFloat(campaign.userDonation) > 0)
          .map(campaign => ({
            campaignId: campaign.address,
            campaignName: campaign.name,
            amount: campaign.userDonation,
            date: new Date().toLocaleDateString() // Placeholder date
          }));
        
        setActiveDonations(userDonations);
        
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      }
    };

    if (walletAddress) {
      fetchCampaignDetails();
    }
  }, [walletAddress]);

  // Hide tooltip after 20 seconds
  useEffect(() => {
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 20000);

    return () => clearTimeout(tooltipTimer);
  }, []);

  // Quick action suggestions for donors
  const quickActions = [
    { icon: <Gift className="w-4 h-4 mr-2" />, text: "How to donate?", value: "How do I make a donation?" },
    { icon: <History className="w-4 h-4 mr-2" />, text: "My donation history", value: "Show me my donation history" },
    { icon: <BarChart3 className="w-4 h-4 mr-2" />, text: "My impact", value: "What impact have my donations made?" },
    { icon: <Wallet className="w-4 h-4 mr-2" />, text: "Tax benefits", value: "What are the tax benefits of donations?" }
  ];

  // Send message to the AI API
  const sendMessageToAPI = async (userMessage: string) => {
    setIsLoading(true);
    try {
      // Get the donor name from orgData if available, otherwise fallback to props
      const donorName = orgData?.name || propDonorName || "Anonymous";
      
      // Use a combination of prop donations and fetched active donations
      const donationsList = recentDonations.length > 0 
        ? recentDonations 
        : activeDonations;

      // Find total donated amount across all campaigns
      const totalUserDonations = campaignDetails.reduce((total, campaign) => {
        return total + parseFloat(campaign.userDonation || "0");
      }, 0);
      
      // Prepare context data to send with the request
      const contextData = {
        donorName: donorName,
        walletAddress: walletAddress,
        totalDonated: totalUserDonations > 0 ? totalUserDonations.toString() : totalDonated,
        donationsCount: donationsList.length || donationsCount,
        // Include recent donations
        recentDonations: donationsList.map(donation => ({
          campaignName: donation.campaignName,
          amount: donation.amount,
          date: donation.date
        })),
        // Include active campaigns data
        activeCampaigns: campaignDetails.map(campaign => ({
          name: campaign.name,
          description: campaign.description,
          goal: campaign.goal,
          totalDonated: campaign.totalDonated,
          userDonation: campaign.userDonation,
          organization: campaign.charityAddress,
          state: campaign.state === 0 ? "Active" : "Completed"
        }))
      };

      // Add context to the user message
      const enhancedUserMessage = `
        [CONTEXT]
        Donor: ${contextData.donorName}
        Wallet Address: ${contextData.walletAddress}
        Total Donated: ${contextData.totalDonated} ETH
        Donations Count: ${contextData.donationsCount}
        
        Recent Donations: ${JSON.stringify(contextData.recentDonations)}
        
        Active Campaigns: ${JSON.stringify(contextData.activeCampaigns)}
        [/CONTEXT]
        
        User Query: ${userMessage}
      `;

      const response = await axios.post("/api/donors/chatbot-api", {
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
                Donation Assistant
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
                placeholder="Ask about your donations..."
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
                <span>Hi, Chat with us</span>
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
