"use client"

import { AgentResponse, ToolCall, Artifact } from "@/components/agents-ui/agent-response"

export default function AgentResponseWithTools() {
  const message = `I've successfully created the React component you requested. The component includes state management, event handlers, and proper TypeScript types.

The component is now ready to use in your application. You can import it and customize the styling as needed.`

  const thinking = `The user wants a React component for a todo list. I need to:
1. Create a functional component with TypeScript
2. Add state management for todos
3. Include add/remove functionality
4. Make it properly typed
5. Use modern React patterns with hooks`

  const toolCalls: ToolCall[] = [
    {
      id: "1",
      name: "create_file",
      input: {
        path: "components/TodoList.tsx",
        content: "React component code..."
      },
      output: {
        success: true,
        message: "File created successfully"
      },
      status: "completed",
      duration: 145
    },
    {
      id: "2",
      name: "read_file",
      input: {
        path: "package.json"
      },
      output: {
        content: "{ dependencies: {...} }"
      },
      status: "completed",
      duration: 23
    }
  ]

  const artifacts: Artifact[] = [
    {
      id: "1",
      type: "code",
      name: "TodoList.tsx",
      language: "typescript",
      size: "2.3 KB",
      content: `import React, { useState } from 'react'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, {
        id: Date.now().toString(),
        text: input,
        completed: false
      }])
      setInput('')
    }
  }

  return (
    <div className="todo-list">
      <h2>My Todos</h2>
      <div className="add-todo">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}`
    }
  ]

  return (
    <AgentResponse
      message={message}
      thinking={thinking}
      toolCalls={toolCalls}
      artifacts={artifacts}
      onRegenerate={() => console.log("Regenerate clicked")}
      onCopy={() => console.log("Copy clicked")}
    />
  )
}
