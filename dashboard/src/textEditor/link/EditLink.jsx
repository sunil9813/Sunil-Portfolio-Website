import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { BsBoxArrowUpRight, BsPencilSquare } from "react-icons/bs";
import { BiUnlink } from "react-icons/bi";
import { BubbleMenu } from "@tiptap/react";
import LinkForm from "./LinkForm";

const EditLink = ({ editor }) => {
  const [showEditForm, setshowEditForm] = useState(false);

  const handleOnLinkOpenClick = useCallback(() => {
    const { href } = editor.getAttributes("link");
    if (href) {
      window.open(href, "_blank");
    }
  }, [editor]);

  const handleLinkEditClick = () => {
    setshowEditForm(true);
  };

  const handleUnlinkClick = () => {
    editor.commands.unsetLink();
  };

  const handleSubmit = ({ url, openInNewTab }) => {
    editor
      .chain()
      .focus()
      .unsetLink()
      .setLink({ href: url, target: openInNewTab ? "_blank" : "" })
      .run();
    setshowEditForm(false);
  };

  const getInitialState = useCallback(() => {
    const { href, target } = editor.getAttributes("link");
    return { url: href, openInNewTab: target ? true : false };
  }, [editor]);

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => editor.isActive("link")}
      tippyOptions={{
        onHidden: () => {
          setshowEditForm(false);
        },
      }}
    >
      <LinkForm visible={showEditForm} onSubmit={handleSubmit} initialState={getInitialState()} />
      {!showEditForm && (
        <div className="rounded bg-primarybg text-white shadow-md p-3 flex items-center space-x-6 z-50">
          <button onClick={handleOnLinkOpenClick}>
            <BsBoxArrowUpRight />
          </button>

          <button onClick={handleLinkEditClick}>
            <BsPencilSquare />
          </button>

          <button onClick={handleUnlinkClick}>
            <BiUnlink />
          </button>
        </div>
      )}
    </BubbleMenu>
  );
};
EditLink.propTypes = {
  editor: PropTypes.object.isRequired,
};
export default EditLink;
