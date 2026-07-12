import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, getMarkRange } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TollBar from "./TollBar/TollBar";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import EditLink from "./link/EditLink";
import Youtube from "@tiptap/extension-youtube";
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
import { Indent } from "./extensions/Indent";
import "./style/index.scss";
import { LineHeight } from "./extensions/LineHeight";
import { MathFormula } from "./extensions/MathFormula";
import { Emoji } from "./extensions/Emoji";
import { Gif } from "./extensions/Gift";
import { Column, ColumnContainer } from "./extensions/Column";
import { CustomTable } from "./extensions/CustomTable";
import { TableActionPopup } from "./components/table/TableActionPopup";
import "prosemirror-tables/style/tables.css";
import CustomImage from "./extensions/CustomImageExtension";
import { GalleryBox, GalleryLayout } from "./extensions/Gallery";

const lowlight = createLowlight(all);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const Editor = ({ value, onChange, folderName, folder, subfolder, customId }) => {
  const editorContainerRef = useRef(null);
  const toolbarSlotRef = useRef(null);
  const toolbarRef = useRef(null);
  const [stickyStyle, setStickyStyle] = useState({});
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [isSticky, setIsSticky] = useState(false);

  const [selectionRange, setSelectionRange] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const dispatch = useDispatch();
  const { images, isLoadingUpload, isLoadingDelete } = useSelector((state) => state.image); // Updated selector

  useEffect(() => {
    let frameId = null;

    const updateStickyToolbar = () => {
      if (!editorContainerRef.current || !toolbarSlotRef.current || !toolbarRef.current) return;

      const editorRect = editorContainerRef.current.getBoundingClientRect();
      const slotRect = toolbarSlotRef.current.getBoundingClientRect();
      const toolbarHeightValue = toolbarRef.current.offsetHeight || 0;

      // chnage margin top value from here
      const topOffset = 0;

      const shouldStick = slotRect.top <= topOffset && editorRect.bottom > topOffset + toolbarHeightValue + 80;

      setIsSticky(shouldStick);
      setToolbarHeight(toolbarHeightValue);

      if (shouldStick) {
        setStickyStyle({
          position: "fixed",
          top: `${topOffset}px`,
          left: `${slotRect.left}px`,
          width: `${slotRect.width}px`,
          boxSizing: "border-box",
        });
      } else {
        setStickyStyle({});
      }
    };

    const handleScroll = () => {
      if (frameId) return;

      frameId = requestAnimationFrame(() => {
        frameId = null;
        updateStickyToolbar();
      });
    };

    updateStickyToolbar();

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", updateStickyToolbar);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);

      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updateStickyToolbar);
    };
  }, []);

  useEffect(() => {
    if (!customId) {
      return;
    }

    dispatch(getAllImages({ folder, subfolder, groupId: customId }));
  }, [dispatch, folder, subfolder, customId]);

  const editor = useEditor({
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    extensions: [
      StarterKit.configure({
        // Exclude the extensions that you'll add separately
        horizontalRule: false,
        codeBlock: false,
      }),
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
      CustomImage,
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
      GalleryBox.configure({
        onOpenGallery: (pos, callback) => {
          setSelectedCellPos(pos);
          setShowGallery(true);
          editor.setMeta("galleryCallback", callback);
        },
      }),
      GalleryLayout,
    ],

    editorProps: {
      handleClick(view, pos) {
        const { state } = view;
        const range = getMarkRange(state.doc.resolve(pos), state.schema.marks.link);
        if (range) setSelectionRange(range);
      },
      attributes: { class: "prose prose-sm focus:outline-none prose-invert max-w-full mx-auto h-full textColor" },
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
    editor
      ?.chain()
      .focus()
      .setImage({
        src: result.src,
        alt: result.altText || "",
        size: "medium",
        align: "left",
        display: "inline",
        objectFit: "cover",
        borderRadius: 10,
        flipX: false,
        flipY: false,
      })
      .run();

    setShowGallery(false);
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
      await dispatch(uploadImageToEditorDes(formData)).unwrap();
      dispatch(getAllImages({ folder, subfolder, groupId: customId }));
    } catch (error) {
      toast.error("Upload failed: " + error.message);
    }
  };

  // delete image from repository
  const handleImageDelete = async (imageId) => {
    try {
      await dispatch(deleteImage(imageId)).unwrap();
      dispatch(getAllImages({ folder, subfolder, groupId: customId }));
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <div ref={editorContainerRef} className="relative z-10 overflow-visible">
        <div
          ref={toolbarSlotRef}
          style={{
            minHeight: isSticky ? `${toolbarHeight}px` : "auto",
          }}
        >
          <div
            ref={toolbarRef}
            style={stickyStyle}
            className={`z-[9999] highlightbg backdrop-blur-md p-3 rounded-2xl transition-shadow duration-200 ${isSticky ? "shadow-lg rounded-none" : "relative"}`}
          >
            <TollBar editor={editor} onOpenImageClick={() => setShowGallery(true)} />
          </div>
        </div>

        {editor && <EditLink editor={editor} />}

        <EditorContent editor={editor} className="min-h-[300px]" />

        {editor && <TableActionPopup editor={editor} />}
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
