
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { VIP_CATEGORIES, BOARD_CATEGORIES } from '../constants';
import { supabase, isDemoMode } from '../lib/supabase';
import { UserContext } from '../App';
import { GoogleGenAI, Chat } from "@google/genai";

interface Message {
  id: number;
  sender: 'bot' | 'user';
  text: string;
}

const CommunityWrite: React.FC = () => {
  const { user, profile, refreshProfile } = useContext(UserContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'bot', text: "환영합니다, 모험가님! 🦾 AI 데이터 수집 센터에 오신 것을 환영합니다." },
    { id: 2, sender: 'bot', text: "기록하고 싶은 주제를 선택해 주세요. 선택하신 주제에 맞춰 제가 직접 실시간 심층 인터뷰를 진행하여 고품질 리포트를 작성해 드립니다." }
  ]);
  
  const [step, setStep] = useState<'SELECT' | 'CHATTING' | 'GENERATING' | 'DONE'>('SELECT');
  const [selectedCat, setSelectedCat] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isGold = profile?.role === 'GOLD' || profile?.role === 'ADMIN';

  useEffect(() => {
    if (!user && !isDemoMode) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (step === 'CHATTING') inputRef.current?.focus();
  }, [messages, step, isBotTyping]);

  const handleCategorySelect = async (name: string, isVip: boolean) => {
    if (isVip && !isGold) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "⚠️ 고수의 방 카테고리는 GOLD 등급 이상만 작성이 가능합니다. 일반 게시판에서 활동하여 등급을 높여보세요!" }]);
      return;
    }

    // 배포 환경에서 API_KEY 존재 여부 체크
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === 'undefined' || apiKey === '') {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'bot', 
        text: "🚨 [배포 환경 설정 오류]\nNetlify 환경 변수에 'API_KEY'가 등록되지 않았습니다. Netlify Site Settings에서 API_KEY를 등록하고 다시 배포해 주세요." 
      }]);
      return;
    }

    setSelectedCat(name);
    setStep('CHATTING');
    setIsBotTyping(true);

    try {
      // 가이드라인에 따라 호출 직전 인스턴스 생성
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `
            당신은 AI 부업 검증 플랫폼 'Ai BuUp'의 수석 분석 에이전트입니다.
            현재 사용자는 '${name}' 카테고리에 대한 정보를 공유하려고 합니다.
            
            당신의 목표:
            1. 사용자의 부업 경험담에서 '진짜 데이터'를 추출하기 위해 날카로운 질문을 던지세요.
            2. 한 번에 '하나의 질문'만 하세요. 질문은 매우 구체적이어야 합니다.
            3. 수익성, 투입 시간, 리스크 등을 파고드세요.
            4. 충분한 정보가 모였다면 메시지 끝에 반드시 "[REPORT_READY]" 태그를 붙이세요.
            5. 말투는 냉철하고 지적인 AI 감사관 톤(한국어)을 유지하세요.
          `,
        },
      });

      setChatSession(chat);
      
      const response = await chat.sendMessage({ message: `안녕하세요. [${name}] 카테고리에 대한 인터뷰를 시작하겠습니다. 해당 주제에 대해 본인이 경험하거나 알고 있는 내용을 간단히 설명해 주세요.` });
      const botText = response.text || "AI의 응답을 수신하지 못했습니다.";
      
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'user', text: name },
        { id: Date.now() + 1, sender: 'bot', text: botText }
      ]);
    } catch (err) {
      console.error("AI Init Error:", err);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "❌ AI 서버 연결에 실패했습니다. Netlify 환경 변수(API_KEY)가 올바른지 확인해 주세요." }]);
      setStep('SELECT');
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleSend = async () => {
    if (!userInput.trim() || isBotTyping || !chatSession) return;

    const currentInput = userInput;
    setUserInput('');
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: currentInput }]);
    setIsBotTyping(true);

    try {
      const response = await chatSession.sendMessage({ message: currentInput });
      const botText = response.text || "";

      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: botText }]);

      if (botText.includes("[REPORT_READY]")) {
        setTimeout(() => generateFinalReport(), 1000);
      }
    } catch (err) {
      console.error("AI Chat Error:", err);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "메시지 전송 중 오류가 발생했습니다." }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const generateFinalReport = async () => {
    setStep('GENERATING');
    setIsBotTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const history = messages.map(m => `${m.sender === 'bot' ? '에이전트' : '사용자'}: ${m.text}`).join('\n');
      
      const prompt = `
        다음 대화 데이터를 바탕으로 '${selectedCat}' 카테고리에 등록될 최종 '인텔리전스 리포트'를 마크다운으로 작성하세요.
        
        대화 데이터:
        ${history}
        
        최상단에 "TITLE: [제목]" 형식으로 제목을 포함할 것.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      const aiText = response.text || "";
      const titleMatch = aiText.match(/TITLE:\s*(.*)/i);
      const generatedTitle = titleMatch ? titleMatch[1].trim() : `[${selectedCat}] 분석 리포트`;
      const cleanedContent = aiText.replace(/TITLE:.*\n?/i, '').trim();

      const newPost: any = {
        title: generatedTitle,
        author: profile?.nickname || user?.email?.split('@')[0] || '익명',
        category: selectedCat,
        content: cleanedContent,
        result: 'AI 정밀 분석 완료',
        user_id: user?.id,
        created_at: new Date().toISOString(),
        likes: 0
      };

      if (!isDemoMode && user) {
        const { error } = await supabase.from('posts').insert([newPost]);
        if (error) throw error;
        refreshProfile();
      } else {
        const demoPost = { ...newPost, id: `post-${Date.now()}` };
        const existing = JSON.parse(localStorage.getItem('demo_posts') || '[]');
        localStorage.setItem('demo_posts', JSON.stringify([demoPost, ...existing]));
      }

      setStep('DONE');
      setTimeout(() => navigate(`/community?cat=${selectedCat}`), 2000);

    } catch (err) {
      console.error("Report Generation Error:", err);
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: "리포트 생성 중 오류가 발생했습니다." }]);
      setStep('CHATTING');
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col pt-24 md:pt-32 pb-10">
      <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col px-4 md:px-0 mb-4 overflow-hidden rounded-[2.5rem] md:rounded-[4rem] border border-white/5 bg-[#0a0a0a] shadow-2xl relative">
        <div className="bg-[#111] p-6 border-b border-white/5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Link to="/community" className="text-gray-600 hover:text-white transition-colors">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </Link>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-500 text-xs font-black">AI</span>
              </div>
              <div>
                <h2 className="text-white font-black text-sm uppercase tracking-tight">AI 감사관 (Live)</h2>
                <div className="flex items-center gap-1.5">
                  <span className={`size-1 rounded-full ${step === 'GENERATING' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                  <p className={`text-[8px] font-black uppercase tracking-widest ${step === 'GENERATING' ? 'text-amber-500' : 'text-emerald-500/50'}`}>
                    {step === 'GENERATING' ? 'Analyzing Data...' : 'Interview Active'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar min-h-[500px]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'} animate-slideUp`}>
              <div className={`max-w-[85%] ${msg.sender === 'user' ? 'bg-emerald-500 text-black font-bold' : 'bg-[#151515] text-gray-300 border border-white/5'} px-6 py-4 rounded-[1.8rem] ${msg.sender === 'bot' ? 'rounded-tl-none' : 'rounded-tr-none'} shadow-xl text-sm leading-relaxed whitespace-pre-line`}>
                {msg.text.replace("[REPORT_READY]", "")}
              </div>
            </div>
          ))}

          {step === 'SELECT' && (
            <div className="space-y-8 mt-4 animate-slideUp">
              <div>
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-4 ml-2">고수의 방 (GOLD 권한)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VIP_CATEGORIES.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.name, true)}
                      className={`relative overflow-hidden bg-[#111] border border-yellow-500/10 p-4 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all text-left shadow-lg ${
                        isGold ? 'hover:bg-yellow-500 hover:text-black text-yellow-500/80 hover:border-yellow-500' : 'opacity-40 grayscale cursor-not-allowed text-gray-600'
                      }`}
                    >
                      {!isGold && <span className="absolute top-2 right-2 opacity-50">🔒</span>}
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-4 ml-2">일반 게시판 (모든 권한)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BOARD_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.name, false)}
                      className="bg-[#111] hover:bg-emerald-500 hover:text-black border border-white/5 p-4 rounded-2xl text-[10px] font-black uppercase tracking-tight text-gray-500 transition-all text-left shadow-lg"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(isBotTyping || step === 'GENERATING') && (
            <div className="flex justify-start">
              <div className="bg-[#151515] px-6 py-4 rounded-[1.8rem] rounded-tl-none flex gap-1 items-center border border-white/5">
                <div className="size-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="size-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="size-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                {step === 'GENERATING' && <span className="text-[10px] font-black text-emerald-500 ml-2 uppercase tracking-widest">AI 인텔리전스 분석 중...</span>}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {step === 'CHATTING' && (
          <div className="p-6 bg-[#111] border-t border-white/5">
            <div className="flex gap-3">
              <input 
                ref={inputRef}
                type="text" 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isBotTyping}
                placeholder={isBotTyping ? "분석 중..." : "AI 감사관에게 답변을 전송하세요..."}
                className="flex-1 bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm text-white outline-none focus:border-emerald-500/50 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!userInput.trim() || isBotTyping}
                className="size-14 rounded-2xl bg-emerald-500 text-black flex items-center justify-center hover:scale-105 transition-all shadow-lg disabled:opacity-30"
              >
                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityWrite;
