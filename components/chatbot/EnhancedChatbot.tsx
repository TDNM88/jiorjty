"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X, ArrowRight, ArrowUp, ArrowDown, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Message = {
  id: number;
  text: string;
  isUser: boolean;
};

type QuickAction = {
  id: string;
  text: string;
  icon: React.ReactNode;
  action: () => void;
};

export function EnhancedChatbot() {
  const t = useTranslations('chatbot');
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: t('welcomeMessage'),
      isUser: false 
    },
  ]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle quick actions
  const handleQuickAction = (action: () => void) => {
    action();
  };

  // Common responses
  const botResponses = {
    deposit: t('responses.deposit'),
    withdraw: t('responses.withdraw'),
    processing: t('responses.processing'),
    contactSupport: t('responses.contactSupport'),
    thankYou: t('responses.thankYou')
  };

  // Handle deposit inquiry
  const handleDepositInquiry = () => {
    setMessages(prev => [...prev, { 
      id: prev.length + 1, 
      text: t('actions.deposit'),
      isUser: true 
    }]);
    
    setIsTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: prev.length + 2, 
          text: botResponses.deposit,
          isUser: false 
        },
        { 
          id: prev.length + 3, 
          text: botResponses.contactSupport,
          isUser: false 
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle withdrawal inquiry
  const handleWithdrawInquiry = () => {
    setMessages(prev => [...prev, { 
      id: prev.length + 1, 
      text: t('actions.withdraw'),
      isUser: true 
    }]);
    
    setIsTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: prev.length + 2, 
          text: botResponses.withdraw,
          isUser: false 
        },
        { 
          id: prev.length + 3, 
          text: botResponses.contactSupport,
          isUser: false 
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle transaction status
  const handleTransactionStatus = () => {
    setMessages(prev => [...prev, { 
      id: prev.length + 1, 
      text: t('actions.checkStatus'),
      isUser: true 
    }]);
    
    setIsTyping(true);
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          id: prev.length + 2, 
          text: botResponses.processing,
          isUser: false 
        },
        { 
          id: prev.length + 3, 
          text: botResponses.thankYou,
          isUser: false 
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, { id: prev.length + 1, text: message, isUser: true }]);
      setMessage('');
      
      // Simulate bot response
      setIsTyping(true);
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            id: prev.length + 2, 
            text: t('responses.default'),
            isUser: false 
          },
          { 
            id: prev.length + 3, 
            text: t('responses.contactSupport'),
            isUser: false 
          }
        ]);
        setIsTyping(false);
      }, 1000);
    }
  };

  // Quick action buttons
  const quickActions: QuickAction[] = [
    {
      id: 'deposit',
      text: t('actions.deposit'),
      icon: <ArrowDown className="h-4 w-4 mr-2" />,
      action: handleDepositInquiry
    },
    {
      id: 'withdraw',
      text: t('actions.withdraw'),
      icon: <ArrowUp className="h-4 w-4 mr-2" />,
      action: handleWithdrawInquiry
    },
    {
      id: 'status',
      text: t('actions.checkStatus'),
      icon: <Clock className="h-4 w-4 mr-2" />,
      action: handleTransactionStatus
    },
    {
      id: 'support',
      text: t('actions.contactSupport'),
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
      action: () => {}
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col h-[600px]">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{t('title')}</h3>
              <p className="text-xs opacity-80">{t('subtitle')}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.isUser 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-10"
                  onClick={() => handleQuickAction(action.action)}
                >
                  {action.icon}
                  <span className="truncate">{action.text}</span>
                </Button>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('placeholder')}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:border-slate-600"
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={isTyping}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transition-all hover:scale-105"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
