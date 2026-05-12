'use client'

import { useState, useRef, useEffect } from 'react'
import http from '@/utils/http'
import { ChatMessage } from './chat-message'

interface UseChatBoxProps {
  lessonId: string
  authToken: string
}

interface UseChatBoxReturn {
  messages: ChatMessage[]
  input: string
  isLoading: boolean
  isOpen: boolean
  setInput: (v: string) => void
  setIsOpen: (v: boolean) => void
  handleSubmit: () => Promise<void>
  messagesEndRef: React.RefObject<HTMLDivElement | null>
}

export const useChatBox = ({ lessonId, authToken }: UseChatBoxProps): UseChatBoxReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSubmit = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    const question = trimmedInput
    setInput('')

    // Append user message
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
      sources: [],
      isLoading: false,
      isError: false
    }

    // Append placeholder assistant message
    const assistantId = crypto.randomUUID()
    const placeholderAssistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      sources: [],
      isLoading: true,
      isError: false
    }

    setMessages((prev) => [...prev, userMessage, placeholderAssistantMessage])
    setIsLoading(true)

    try {
      const response = await http.post<{ answer: string; sources: { content: string; score: number }[] }>(
        `/lesson/${lessonId}/ask`,
        { question },
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      )

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: response.data.answer,
                sources: response.data.sources,
                isLoading: false
              }
            : msg
        )
      )
    } catch (error) {
      console.error('Chat error:', error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: 'Có lỗi xảy ra, vui lòng thử lại.',
                sources: [],
                isLoading: false,
                isError: true
              }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    input,
    isLoading,
    isOpen,
    setInput,
    setIsOpen,
    handleSubmit,
    messagesEndRef
  }
}
