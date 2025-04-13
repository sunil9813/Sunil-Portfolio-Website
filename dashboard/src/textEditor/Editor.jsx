import { useEffect, useState } from "react";
import { useEditor, EditorContent, getMarkRange } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TollBar from "./TollBar/TollBar";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import EditLink from "./link/EditLink";
import Youtube from "@tiptap/extension-youtube";
import TipTapImage from "@tiptap/extension-image";
import GallaryModel from "./GalleryModel/GallaryModel";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TextAlign from "@tiptap/extension-text-align";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { all, createLowlight } from "lowlight";
import { useDispatch, useSelector } from "react-redux";
import { deleteImage, getAllImages, uploadImageToEditorDes } from "@/redux/slices/imageSlice";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { ImageResize } from "tiptap-extension-resize-image";
import { Indent } from "./extensions/Indent";
import "./style/extensions.scss";
import "./style/table.scss";
import { LineHeight } from "./extensions/LineHeight";
import { MathFormula } from "./extensions/MathFormula";
import { Emoji } from "./extensions/Emoji";
import { Gif } from "./extensions/Gift";
import { Column, ColumnContainer } from "./extensions/Column";
import { CustomTable } from "./extensions/CustomTable";
import { TableActionPopup } from "./components/table/TableActionPopup";

const lowlight = createLowlight(all);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const Editor = ({ value, onChange, folderName, folder, subfolder, customId }) => {
  const [selectionRange, setSelectionRange] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const dispatch = useDispatch();
  const { images, isLoadingUpload, isLoadingDelete } = useSelector((state) => state.image); // Updated selector
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(getAllImages({ folder, subfolder }));
  }, [dispatch, folder, subfolder]);

  const editor = useEditor({
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    extensions: [
      StarterKit,
      Superscript,
      Subscript,
      Underline,
      TextStyle,
      Color,
      HorizontalRule,
      FontFamily.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ autolink: false, linkOnPaste: false, openOnClick: false, HTMLAttributes: { target: "" } }),
      Placeholder.configure({ placeholder: "Type something here..." }),
      Youtube.configure({ width: 840, height: 472.5, HTMLAttributes: { class: "mx-auto rounded-xl" } }),
      CodeBlockLowlight.configure({ lowlight }),
      Highlight.configure({ multicolor: true, HTMLAttributes: { class: "prose-black" } }),
      TipTapImage.configure({ HTMLAttributes: { class: "mx-auto" } }),
      ImageResize,
      Indent.configure({
        types: ["paragraph", "heading", "list_item"],
        max: 20,
        min: 0,
        step: 1,
        unit: "em",
      }),
      LineHeight,
      MathFormula,
      Emoji,
      Gif,
      ColumnContainer,
      Column,
      CustomTable,
      // ResizableImage,
    ],

    editorProps: {
      handleClick(view, pos) {
        const { state } = view;
        const range = getMarkRange(state.doc.resolve(pos), state.schema.marks.link);
        if (range) setSelectionRange(range);
      },
      attributes: { class: "prose prose-lg focus:outline-none prose-invert max-w-full mx-auto h-full text-white" },
    },
  });

  useEffect(() => {
    if (editor && selectionRange) editor.commands.setTextSelection(selectionRange);
  }, [editor, selectionRange]);

  // Sync editor content with value prop
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false); // Update content without triggering onUpdate
    }
  }, [editor, value]);

  const handleImageSelection = (result) => {
    editor?.chain().focus().setImage({ src: result.src, alt: result.altText }).run();
  };

  // upload image in description either single or multiple
  const handleImageUpload = async (images) => {
    if (!images || images.length === 0) {
      toast.error("No images selected");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append("image", images[i]);
    }
    formData.append("folder", folderName);
    formData.append("groupId", customId);

    try {
      await dispatch(uploadImageToEditorDes(formData, folderName)).unwrap(); // Assuming .unwrap() for Redux Toolkit async thunk
      dispatch(getAllImages({ folder, subfolder }));
    } catch (error) {
      toast.error("Upload failed: " + error.message);
    }
  };

  // delete image from repository
  const handleImageDelete = async (imageId) => {
    try {
      await dispatch(deleteImage(imageId)).unwrap(); // Assuming deleteImage takes imageId and folder info
      dispatch(getAllImages({ folder, subfolder })); // Refetch after deletion
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div className="p-3 bg-transparent relative">
        <div
          className={`transition-all duration-300 z-30 backdrop-blur-md ${
            isSticky ? "fixed top-[78px] right-0 w-[85%] bg-sidebarbg shadow-lg p-3 flex justify-center items-center flex-col" : "relative z-10"
          }`}
        >
          <TollBar editor={editor} onOpenImageClick={() => setShowGallery(true)} />
        </div>
        <div className="h-[1px] w-full bg-white/10 my-3"></div>
        {editor && <EditLink editor={editor} />}
        <EditorContent editor={editor} className="min-h-[300px]" />
        <TableActionPopup editor={editor} />
      </div>
      <GallaryModel
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onSelect={handleImageSelection}
        images={images}
        onFileSelect={handleImageUpload}
        uploading={isLoadingUpload}
        deleting={isLoadingDelete}
        onDelete={handleImageDelete}
      />
    </>
  );
};

Editor.propTypes = {
  value: PropTypes.string.isRequired,
  folder: PropTypes.string,
  customId: PropTypes.any,
  folderName: PropTypes.string,
  subfolder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default Editor;
