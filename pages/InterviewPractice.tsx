
import React, { useState } from 'react';
import { 
  Play, 
  Mic, 
  Video, 
  RotateCcw, 
  Send,
  Sparkles,
  Award,
  BookOpen
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

const QUESTIONS = [
  "Tell me about a challenging project you've worked on.",
  "What is your greatest technical strength?",
  "How do you handle conflict in a team setting?",
  "Where do you see yourself in 5 years?",
  "Explain a complex concept to a non-technical person."
];

const InterviewPractice: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const result = await geminiService.getInterviewFeedback(QUESTIONS[currentQuestionIndex], answer);
    setFeedback(result);
    setIsSubmitting(false);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % QUESTIONS.length);
    setAnswer('');
    setFeedback(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold mb-1 dark:text-white">Interview Simulator</h1>
          <p className="text-slate-500">Refine your answers with real-time AI feedback.</p>
        </div>
        <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl font-bold text-sm">
          Session #14
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interaction Panel */}
        <div className="space-y-6">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest mb-6">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
              Question {currentQuestionIndex + 1} of {QUESTIONS.length}
            </div>
            <h2 className="text-2xl font-bold mb-10 dark:text-white">"{QUESTIONS[currentQuestionIndex]}"</h2>
            
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Start typing your response here or use voice input..."
              className="flex-1 w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-200 resize-none"
            />

            <div className="flex items-center gap-4 mt-6">
              <button className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl hover:bg-slate-200 transition-colors">
                <Mic className="w-6 h-6" />
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!answer.trim() || isSubmitting}
                className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
                Submit Answer
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Panel */}
        <div className="space-y-6">
           {feedback ? (
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
               <div className="p-6 bg-indigo-600 rounded-3xl text-white shadow-xl shadow-indigo-500/20">
                 <div className="flex items-center justify-between mb-4">
                   <h4 className="font-bold flex items-center gap-2"><Award className="w-5 h-5" /> Performance Rating</h4>
                   <span className="text-3xl font-black">{feedback.rating}/10</span>
                 </div>
                 <p className="text-indigo-100 text-sm">{feedback.feedback}</p>
               </div>

               <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                 <h4 className="font-bold mb-4 flex items-center gap-2 dark:text-white">
                   <Sparkles className="w-5 h-5 text-indigo-500" /> Perfected Answer
                 </h4>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                   {feedback.betterAnswer}
                 </div>
                 <button 
                   onClick={handleNext}
                   className="mt-6 w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                 >
                   Try Next Question <RotateCcw className="w-4 h-4" />
                 </button>
               </div>
             </div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                  <BookOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="font-bold mb-2">Expert Feedback</h4>
                <p className="text-sm text-slate-500">Submit your answer to receive detailed feedback, rating, and an improved response from our AI coach.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPractice;
