import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";

import {
  Box,
  Paper,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import TitleIcon from "@mui/icons-material/Title";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CodeIcon from "@mui/icons-material/Code";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ClearIcon from "@mui/icons-material/Backspace";

const RichTextEditor = ({ label, value = "", onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: true,
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
      }),
      Heading.configure({ levels: [1, 2] }),
      Underline,
      BulletList,
      OrderedList,
      Blockquote,
      CodeBlock,
    ],

    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  const iconBtn = (label, icon, action, isActive = false) => (
    <Tooltip title={label}>
      <IconButton
        onClick={action}
        color={isActive ? "primary" : "default"}
        size="small"
      >
        {icon}
      </IconButton>
    </Tooltip>
  );

  return (
    <Box>
      <Typography variant="body1" color="primary.main" sx={{ mb: 1 }}>
        {label}
      </Typography>

      <Stack direction="row" spacing={0.5} flexWrap="wrap" mb={1}>
        {iconBtn(
          "Bold",
          <FormatBoldIcon />,
          () => editor.chain().focus().toggleBold().run(),
          editor.isActive("bold")
        )}
        {iconBtn(
          "Italic",
          <FormatItalicIcon />,
          () => editor.chain().focus().toggleItalic().run(),
          editor.isActive("italic")
        )}
        {iconBtn(
          "Underline",
          <FormatUnderlinedIcon />,
          () => editor.chain().focus().toggleUnderline().run(),
          editor.isActive("underline")
        )}
        {iconBtn(
          "H1",
          <TitleIcon fontSize="small" />,
          () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
          editor.isActive("heading", { level: 1 })
        )}
        {iconBtn(
          "H2",
          <TitleIcon fontSize="small" />,
          () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
          editor.isActive("heading", { level: 2 })
        )}
        {iconBtn(
          "Bullet List",
          <FormatListBulletedIcon />,
          () => editor.chain().focus().toggleBulletList().run(),
          editor.isActive("bulletList")
        )}
        {iconBtn(
          "Numbered List",
          <FormatListNumberedIcon />,
          () => editor.chain().focus().toggleOrderedList().run(),
          editor.isActive("orderedList")
        )}
        {iconBtn(
          "Quote",
          <FormatQuoteIcon />,
          () => editor.chain().focus().toggleBlockquote().run(),
          editor.isActive("blockquote")
        )}
        {iconBtn(
          "Code Block",
          <CodeIcon />,
          () => editor.chain().focus().toggleCodeBlock().run(),
          editor.isActive("codeBlock")
        )}
        {iconBtn("Clear", <ClearIcon />, () =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        )}
        {iconBtn("Undo", <UndoIcon />, () =>
          editor.chain().focus().undo().run()
        )}
        {iconBtn("Redo", <RedoIcon />, () =>
          editor.chain().focus().redo().run()
        )}
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          minHeight: 60,
          "& .ProseMirror": {
            outline: "none",
            minHeight: "60px",
            lineHeight: 1.6,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Paper>
    </Box>
  );
};

export default RichTextEditor;
