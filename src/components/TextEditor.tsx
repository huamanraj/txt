'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'txt-content';

export default function TextEditor() {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: 'Write anything...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-zinc dark:prose-invert max-w-none focus:outline-none min-h-screen p-8 md:p-20 text-xl md:text-2xl leading-relaxed transition-all duration-300',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      localStorage.setItem(STORAGE_KEY, html);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setMounted(true);
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent && editor) {
      editor.commands.setContent(savedContent);
    }
    // Auto focus on mount
    if (editor && !editor.isFocused) {
        editor.commands.focus();
    }
  }, [editor]);

  const handleReset = () => {
    if (confirm('Clear everything?')) {
      editor?.commands.clearContent();
      localStorage.removeItem(STORAGE_KEY);
      editor?.commands.focus();
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-black text-black dark:text-white selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-300">
      {/* Reset Icon */}
      <button
        onClick={handleReset}
        className="fixed top-8 right-8 z-50 p-2 text-zinc-300 hover:text-zinc-900 dark:text-zinc-600 dark:hover:text-zinc-100 transition-all duration-200 cursor-pointer"
        aria-label="Reset content"
      >
        <RotateCcw size={18} strokeWidth={2.5} />
      </button>

      {/* Editor Area */}
      <div 
        className="w-full min-h-screen cursor-text"
        onClick={() => {
            if (editor && !editor.isFocused) {
                editor.chain().focus('end').run();
            }
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
