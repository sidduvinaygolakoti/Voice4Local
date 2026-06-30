import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiService } from '../services/ai'
import { Send, Bot, User, Globe, Trash2, Loader2 } from 'lucide-react'

const STARTER_PROMPTS = [
  { emoji: '🛣️', text: 'My road has big potholes' },
  { emoji: '💧', text: 'No water supply for 3 days' },
  { emoji: '⚡', text: 'Street lights not working' },
  { emoji: '🗑️', text: 'Garbage not collected for a week' },
  { emoji: '🚧', text: 'Drainage overflow problem' },
  { emoji: '🏥', text: 'PHC doctor absent for days' },
]

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'Telugu' },
  { code: 'hi', label: 'Hindi' },
]

const INITIAL_MESSAGE = {
  id: 'welcome',
  role: 'ai',
  content: `Hello! I'm **LOCAL HELP AI** 🤖 — your digital civic assistant.

I can help you:
- 🔍 **Identify** which government department handles your problem
- 📝 **Write** a formal complaint in English, Telugu, or Hindi
- ⏱️ **Estimate** how long resolution might take
- 🛠️ **Suggest** if the issue can be self-resolved

Just describe your problem in any language — Telugu, Hindi, or English!`,
  timestamp: new Date(),
}

// System prompt for Gemini/OpenAI
const SYSTEM_PROMPT = `You are LOCAL HELP AI, a helpful civic assistant for Indian citizens, especially in Andhra Pradesh and Telangana. 

Your role is to:
1. Understand local problems described in Telugu, Hindi, or English
2. Identify the responsible government department (Municipality, Panchayat, Electricity Board, Water Board, MLA office, etc.)
3. Suggest practical solutions
4. Help write formal complaints in the user's preferred language
5. Estimate resolution timelines
6. Guide users on escalation if needed

Always be helpful, respectful, and empathetic. Use simple language. If the user writes in Telugu or Hindi, respond in that language too, with English for technical terms. Keep responses concise but informative.

Format your responses with clear sections when appropriate. Use emojis to make responses friendly.`

const TypingIndicator = () => (
  <div className="flex items-end gap-3">
    <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
      <Bot size={16} className="text-white" />
    </div>
    <div className="chat-bubble-ai flex items-center gap-1 py-4 px-5">
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary-400"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay }}
        />
      ))}
    </div>
  </div>
)

const MessageBubble = ({ message }) => {
  const isAI = message.role === 'ai'
  const formatContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
      .replace(/^- (.+)/gm, '<li class="ml-4 list-disc">$1</li>')
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      layout
      className={`flex ${isAI ? 'items-end gap-3' : 'items-end gap-3 justify-end'}`}
    >
      {isAI && (
        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div className={isAI ? 'chat-bubble-ai max-w-lg' : 'chat-bubble-user max-w-lg'}>
        {isAI ? (
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
          />
        ) : (
          <p className="text-sm leading-relaxed">{message.content}</p>
        )}
        <p className={`text-xs mt-1.5 ${isAI ? 'text-gray-400' : 'text-blue-200'}`}>
          {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {!isAI && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
          <User size={16} className="text-white" />
        </div>
      )}
    </motion.div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [language, setLanguage] = useState('en')
  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const sendMessage = async (text = input) => {
    if (!text.trim()) return
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    try {
      const res = await aiService.analyze(text.trim(), language)
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: res.reply || 'I apologize, I could not process your request. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      // Fallback: smart local responses when AI backend is not configured
      const fallback = generateFallback(text.trim())
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: fallback,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
    } finally {
      setTyping(false)
      inputRef.current?.focus()
    }
  }

  const generateFallback = (text) => {
    const lower = text.toLowerCase()
    if (lower.includes('road') || lower.includes('pothole') || lower.includes('రోడ్') || lower.includes('सड़क')) {
      return `🛣️ **Road / Pothole Issue Identified!**

**Responsible Department:** Municipal Corporation / Panchayat Raj Engineering Department

**What to do:**
- If on a city road → Contact Municipal Corporation
- If on a village road → Contact Panchayat Secretary / PRED
- If on a national/state highway → Contact NHAI / PWD

**Expected Resolution:** 7-14 working days

Would you like me to help write a formal complaint in Telugu or English? 📝`
    }
    if (lower.includes('water') || lower.includes('నీళ్ళు') || lower.includes('पानी')) {
      return `💧 **Water Supply Issue Identified!**

**Responsible Department:** Water Supply Department / Municipality

**Immediate Steps:**
1. Check if your local overhead tank has supply
2. Contact your ward councillor
3. If tap water is contaminated, report to Health Department

**Emergency:** Call 1916 (HMWSSB helpline)

**Expected Resolution:** 3-5 days for supply issues

Ready to write your formal complaint? Just ask! 📝`
    }
    if (lower.includes('light') || lower.includes('electricity') || lower.includes('వెలుతురు') || lower.includes('बिजली')) {
      return `⚡ **Electricity / Street Light Issue!**

**Responsible Department:** DISCOMS / Municipality (for street lights)

**Quick checks:**
- Main road street lights → Municipality / GHMC
- Lane/colony lights → DISCOMS (TSSPDCL / APEPDCL)

**Helpline:** Call 1800-425-5400

**Expected Resolution:** 2-5 days

Want help writing a formal complaint to the Electricity Board? 🔌`
    }
    return `🤖 I understand you have a local problem. Let me help!

Based on your description, this appears to be a **civic issue**.

**General guidance:**
- For **infrastructure issues** → Contact Municipality / Panchayat
- For **electricity issues** → Contact DISCOMS
- For **water supply** → Contact Water Supply Board
- For **health issues** → Contact District Medical Officer

**Next steps:**
1. Raise a formal complaint using our **Raise Query** form
2. Your complaint will be assigned a unique ID
3. Track progress until resolved

Would you like to describe the problem in more detail? I can identify the exact department and write the complaint for you. 🙏`
  }

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE])
    setInput('')
  }

  const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex flex-col"
      style={{ height: 'calc(100vh - 80px)', background: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <div className="glass-card rounded-none border-x-0 border-t-0 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-blue">
                <Bot size={22} className="text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-trust-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
            </div>
            <div>
              <h1 className="font-poppins font-bold text-lg">LOCAL HELP AI</h1>
              <p className="text-xs text-trust-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-trust-500" /> Online · AI-powered civic assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-gray-400" />
              <select
                id="ai-language-select"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="text-sm bg-transparent border border-white/20 rounded-lg px-2 py-1 text-gray-600 dark:text-gray-300 focus:outline-none"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <button
              id="clear-chat-btn"
              onClick={clearChat}
              className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-red-500 transition-all"
              title="Clear chat"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-5">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
          {typing && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Starter Prompts */}
      {messages.length <= 1 && (
        <div className="px-4 md:px-8 pb-3">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-gray-400 mb-2">💬 Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {STARTER_PROMPTS.map(({ emoji, text }) => (
                <button
                  key={text}
                  id={`prompt-${text.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => sendMessage(text)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card text-sm hover:bg-primary/10 hover:border-primary/30 transition-all hover:-translate-y-0.5"
                >
                  {emoji} {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="glass-card rounded-none border-x-0 border-b-0 px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              id="ai-message-input"
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Describe your problem in Telugu, Hindi, or English..."
              className="input-field resize-none pr-4 py-3 text-sm min-h-[52px] max-h-32"
              rows={1}
              style={{ overflow: 'hidden' }}
            />
          </div>
          <button
            id="send-ai-message-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || typing}
            className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-blue hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shrink-0"
          >
            {typing ? (
              <Loader2 size={18} className="text-white animate-spin" />
            ) : (
              <Send size={18} className="text-white" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Press Enter to send · Shift+Enter for new line · Available in English, Telugu, Hindi
        </p>
      </div>
    </motion.div>
  )
}
