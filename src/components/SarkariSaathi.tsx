import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import Markdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "Latest SSC Jobs?",
  "Bihar Constable Result?",
  "UPSC Age Limit?",
  "Any new Govt Yojana?"
];

export default function SarkariSaathi() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! 🌟 I am **Sarkari Saathi**, your high-speed, low-latency AI Assistant, powered by **Gemini AI**.\n\nAsk me any questions about important exam dates, age calculators, qualification rules, and links!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || input;
    const finalQuery = rawText.trim();
    if (!finalQuery || isLoading) return;

    if (!textToSend) {
      setInput("");
    }
    setErrorMessage("");
    setIsLoading(true);

    const updatedMessages: Message[] = [...messages, { role: "user", content: finalQuery }];
    setMessages(updatedMessages);

    // Initial item for streaming response
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: updatedMessages,
          currentUrl: window.location.pathname
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No readable stream body returned from the server.");
      }

      const decoder = new TextDecoder();
      let partialLine = "";
      let fullModelResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = (partialLine + chunk).split("\n");
        partialLine = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.substring(6).trim();
            if (dataStr === "[DONE]") continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullModelResponse += parsed.text;
                // Append text chunk to the last assistant message
                setMessages((prev) => {
                  const copy = [...prev];
                  if (copy.length > 0) {
                    copy[copy.length - 1] = {
                      role: "assistant",
                      content: fullModelResponse
                    };
                  }
                  return copy;
                });
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e: any) {
              console.error("SSE JSON Line Error:", e);
              if (e.message && e.message.includes("GEMINI_API_KEY")) {
                throw e;
              }
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Streaming error:", err);
      setErrorMessage(
        err.message?.includes("GEMINI_API_KEY")
          ? "Gemini API key is missing or invalid. Please configure GEMINI_API_KEY in the Settings > Secrets section."
          : "Could not establish high-speed connection. Please try again."
      );
      // Clean up the empty streaming message if failed
      setMessages((prev) => {
        const copy = [...prev];
        if (copy.length > 0 && copy[copy.length - 1].content === "") {
          copy.pop();
        }
        return copy;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! Ask me anything about recruitment notices, Sarkari results, and study syllabus. 😊"
      }
    ]);
    setErrorMessage("");
  };

  return (
    <>
      {/* Absolute Floating Trigger button with dynamic wave notification indicator */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-[88px] md:bottom-8 right-4 md:right-8 z-50 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3.5 md:p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.3)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-pointer group border border-white/20 select-none"
        aria-label="Ask Sarkari Saathi"
        id="sarkari-saathi-trigger"
      >
        <div className="relative flex items-center justify-center">
          <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-300 group-hover:animate-pulse transition-transform duration-300 group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-indigo-600 animate-pulse"></span>
        </div>
        <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm tracking-wide">
          Ask AI
        </span>
      </button>

      {/* Main Chat Panel Container */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[410px] h-[520px] max-h-[calc(100vh-140px)] bg-white dark:bg-zinc-950 border-3 sm:border-4 border-black dark:border-zinc-100 p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] z-50 flex flex-col font-sans overflow-hidden"
          id="sarkari-saathi-chatbox"
        >
          {/* Header Bar */}
          <div className="bg-[#1e1b4b] text-white p-3 border-b-3 border-black flex items-center justify-between font-mono shrink-0 select-none">
            <div className="flex items-center gap-2">
              <div className="bg-[#FFD600] text-black font-black p-1 text-xs border border-white shrink-0">
                SARKARI
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="font-sans font-black text-xs uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  Saathi Assistant <Sparkles className="w-3 h-3 text-yellow-300 inline animate-bounce" />
                </span>
                <span className="text-[7.5px] uppercase font-bold text-slate-300 tracking-widest mt-0.5">
                  Gemini AI • low latency
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                title="Reset conversation"
                className="p-1 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-[#FAF9F5] dark:bg-zinc-900 scroll-smooth">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${
                  m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                }`}
              >
                <span className="text-[9px] uppercase font-bold text-neutral-400 font-mono mb-1 select-none">
                  {m.role === "user" ? "You" : "Saathi (AI)"}
                </span>
                <div
                  className={`border-2 border-black p-3 text-xs leading-relaxed transition-all shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
                    m.role === "user"
                      ? "bg-red-50 text-neutral-900 border-black dark:bg-red-950/20 dark:text-zinc-100"
                      : "bg-white text-neutral-800 border-black dark:bg-zinc-950 dark:text-zinc-200"
                  }`}
                >
                  {m.content ? (
                    <div className="markdown-body text-xs prose prose-sm max-w-none dark:prose-invert">
                      <Markdown
                        components={{
                          img: ({ node, ...props }) => {
                            if (!props.alt) {
                              console.warn(`[SEO/A11y Warning] Markdown image missing 'alt' text: ${props.src}`);
                            }
                            return (
                              <img 
                                {...props} 
                                alt={props.alt || "Sarkari post illustration"} 
                                className="max-w-full h-auto rounded inline-block"
                                loading="lazy"
                              />
                            );
                          }
                        }}
                      >{m.content}</Markdown>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 py-1">
                      <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Error notifications */}
            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300 border-2 border-red-900 p-3 text-xs font-medium space-y-1 rounded-none flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <div className="flex-grow">
                  <p className="font-extrabold text-[10px] uppercase tracking-wide">Connection Error</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-amber-50 dark:bg-zinc-900 border-t-2 border-b-2 border-black shrink-0 flex flex-col gap-1 select-none">
              <span className="text-[8.5px] font-black uppercase text-amber-800 dark:text-amber-500 font-mono tracking-wider">
                💡 Try asking
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="bg-white hover:bg-black hover:text-white dark:bg-zinc-950 border border-black dark:border-zinc-800 px-2 py-1 text-[10px] font-bold text-left hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition-all cursor-pointer rounded-none"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-zinc-950 border-t-3 border-black shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about exam results, eligibility..."
                className="flex-grow bg-slate-50 dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100 placeholder-neutral-500 border-2 border-black dark:border-zinc-800 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-black rounded-none font-bold"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 dark:bg-red-700 hover:bg-black text-white px-3.5 border-2 border-black hover:border-black hover:text-[#FFD600] shadow-[2px_2px_0px_rgba(0,0,0,0.9)] hover:shadow-none active:translate-y-0.5 transition-all text-xs font-black cursor-pointer rounded-none flex items-center justify-center shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
