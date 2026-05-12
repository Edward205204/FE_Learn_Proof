# FE Integration Plan — AI Features (Next.js)

## Tổng quan scope

| Feature           | Route                                            | Người dùng | Lesson type                               |
| ----------------- | ------------------------------------------------ | ---------- | ----------------------------------------- |
| RAG Chat Box      | `/app/(learner)/courses/[id]/lessons/[lessonId]` | Learner    | TEXT, VIDEO (không phải QUIZ)             |
| AI Quiz Gen       | CMS — trang quản lý quiz của lesson              | Creator/CM | TEXT, VIDEO only — KHÔNG hỗ trợ QUIZ type |
| Review Quiz Draft | CMS — trang quản lý quiz của lesson              | Creator/CM | TEXT, VIDEO only                          |

---

## Các API endpoint FE sẽ gọi

```
# RAG
POST /lesson/:lessonId/ask
Body: { question: string }
Response: { answer: string, sources: string[] }

# Quiz Gen
POST /quiz/lessons/:lessonId/generate-ai
Response: { jobId: string }

GET  /quiz/lessons/:lessonId/drafts
Response: QuizDraft[]

GET  /quiz/drafts/:draftId
Response: QuizDraft (chi tiết)

PATCH /quiz/drafts/:draftId/publish
PATCH /quiz/drafts/:draftId/reject
Body: { reviewNote?: string }
```

---

## PHASE FE-1 — RAG Chat Box (Learner)

### Mô tả UX

- Floating panel hoặc sidebar bên phải trang lesson
- Learner gõ câu hỏi → nhận trả lời + sources
- Không lưu lịch sử chat giữa các session (stateless — đủ cho demo)
- Chỉ hiển thị khi `lesson.type !== 'QUIZ'`

### Files cần tạo/sửa

```
app/(learner)/courses/[id]/lessons/[lessonId]/
  page.tsx                          ← SỬA: mount <AiChatBox lessonId={lessonId} />
  _components/
    AiChatBox/
      index.tsx                     ← container component
      ChatMessage.tsx               ← 1 bubble message
      SourceBadge.tsx               ← badge hiển thị source
      useChatBox.ts                 ← hook: state + gọi API
```

### `useChatBox.ts` — logic

```typescript
interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  isLoading?: boolean
}

// State:
const [messages, setMessages] = useState<Message[]>([])
const [input, setInput] = useState('')
const [isLoading, setIsLoading] = useState(false)

// Submit handler:
async function handleSubmit() {
  if (!input.trim() || isLoading) return

  // 1. Append user message
  // 2. Append loading placeholder { role: 'assistant', isLoading: true }
  // 3. POST /lesson/:lessonId/ask { question: input }
  // 4. Replace loading placeholder với response
  // 5. On error: replace với error message cứng
  //    "Có lỗi xảy ra, vui lòng thử lại."
}
```

### `AiChatBox/index.tsx` — UI requirements

- Toggle mở/đóng (button floating hoặc tab)
- Input + Send button (disable khi isLoading)
- Message list (scroll to bottom khi có message mới)
- Mỗi assistant message hiển thị `SourceBadge` nếu `sources.length > 0`
- Empty state: "Hãy đặt câu hỏi về nội dung bài học này."
- Loading state: skeleton hoặc typing indicator (3 dots)

---

## PHASE FE-2 — AI Quiz Gen + Review Draft (CMS)

### Mô tả UX

**Trang quản lý quiz của lesson (CMS):**

```
┌─────────────────────────────────────────────────────┐
│  Quiz Management                                     │
│                                                      │
│  [Generate by AI]  ← button, disabled nếu QUIZ type │
│                                                      │
│  ┌── Draft AI ──────────────────────────────────┐   │
│  │  Status: DRAFT_AI   Generated: 2 mins ago    │   │
│  │  [Preview]  [Publish]  [Reject]              │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ── Current Published Quiz ─────────────────────    │
│  (danh sách câu hỏi hiện tại)                       │
└─────────────────────────────────────────────────────┘
```

### Files cần tạo/sửa

```
app/(cms)/lessons/[lessonId]/quiz/
  page.tsx                          ← SỬA: thêm AI section
  _components/
    AiQuizSection/
      index.tsx                     ← container: điều phối generate + draft
      GenerateButton.tsx            ← button + polling logic
      DraftPreviewModal.tsx         ← modal xem trước draft
      QuizDraftCard.tsx             ← card hiển thị 1 draft
      useAiQuiz.ts                  ← hook: state + API calls
```

### `useAiQuiz.ts` — logic

```typescript
// State:
const [draft, setDraft] = useState<QuizDraft | null>(null)
const [isGenerating, setIsGenerating] = useState(false)
const [isPolling, setIsPolling] = useState(false)

// Fetch draft hiện tại khi mount:
// GET /quiz/lessons/:lessonId/drafts → lấy draft đầu tiên có status DRAFT_AI (nếu có)

// Generate:
async function handleGenerate() {
  // POST /quiz/lessons/:lessonId/generate-ai
  // → nhận jobId
  // → bắt đầu polling GET /quiz/lessons/:lessonId/drafts mỗi 3s
  // → dừng polling khi thấy draft status = DRAFT_AI (hoặc timeout 60s)
}

// Publish:
async function handlePublish(draftId: string) {
  // PATCH /quiz/drafts/:draftId/publish
  // → reload trang hoặc refetch quiz list
}

// Reject:
async function handleReject(draftId: string, reviewNote: string) {
  // PATCH /quiz/drafts/:draftId/reject { reviewNote }
  // → clear draft state
}
```

### Điều kiện disable "Generate by AI"

```typescript
const canGenerateAi = lesson.type !== 'QUIZ' && !isGenerating && draft?.status !== 'DRAFT_AI'
// Nếu đã có DRAFT_AI chưa review → disable (BE cũng reject 409)
```

### `DraftPreviewModal.tsx` — UI requirements

- Hiển thị từng câu hỏi + 4 options, highlight correct answer
- Cuối modal: [Publish] [Reject] buttons
- Reject flow: show textarea nhập `reviewNote` trước khi confirm

---

## Polling strategy (Quiz Gen)

Quiz gen là async job (BullMQ) nên FE phải poll:

```typescript
// Sau khi POST generate-ai thành công:
let attempts = 0
const MAX_ATTEMPTS = 20 // 20 × 3s = 60s timeout

const poll = setInterval(async () => {
  attempts++
  if (attempts >= MAX_ATTEMPTS) {
    clearInterval(poll)
    setIsGenerating(false)
    toast.error('Sinh câu hỏi quá lâu, vui lòng thử lại.')
    return
  }

  const drafts = await fetchDrafts(lessonId)
  const aiDraft = drafts.find((d) => d.status === 'DRAFT_AI')
  if (aiDraft) {
    clearInterval(poll)
    setDraft(aiDraft)
    setIsGenerating(false)
  }
}, 3000)
```

Không dùng WebSocket hay SSE — polling đủ cho demo, đơn giản hơn nhiều.

---

## Lưu ý quan trọng cho agent

1. **Không tạo route/page mới** — chỉ extend page đã có
2. **Lesson type guard** — kiểm tra `lesson.type !== 'QUIZ'` trước khi render AI components, không phải chỉ disable button
3. **Error handling** — mọi API call phải có try/catch + toast error, đừng để silent fail
4. **Loading states** — phân biệt rõ: `isGenerating` (đang chờ job) vs `isSubmitting` (đang gọi publish/reject)
5. **Optimistic UI** — KHÔNG dùng optimistic update cho publish/reject vì có side effect (replace quiz cũ)
6. **Auth header** — đảm bảo mọi fetch đều đính kèm Bearer token từ session

---

## Type definitions (dùng chung)

```typescript
// types/ai.ts

export interface AiChatMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: string[]
  isLoading?: boolean
  isError?: boolean
}

export interface RagAskResponse {
  answer: string
  sources: string[]
}

export interface QuizDraft {
  id: string
  lessonId: string
  aiJobId: string
  status: 'DRAFT_AI' | 'PUBLISHED' | 'REJECTED'
  validatedOutput: {
    questions: QuizDraftQuestion[]
  } | null
  rawOutput: unknown
  reviewerId: string | null
  reviewNote: string | null
  promptVersion: string | null
  createdAt: string
  updatedAt: string
}

export interface QuizDraftQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface GenerateAiResponse {
  jobId: string
}
```
