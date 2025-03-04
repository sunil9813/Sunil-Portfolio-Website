import { useState } from "react";
import Button from "./Button";
import { BsYoutube } from "react-icons/bs";
import PropTypes from "prop-types";

const EmbedYoutube = ({ onSubmit }) => {
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = () => {
    if (!url.trim()) return hideForm();

    onSubmit(url);
    setUrl("");
    hideForm();
  };

  const hideForm = () => setVisible(false);
  const showForm = () => setVisible(true);
  return (
    <>
      <div
        onKeyDown={({ key }) => {
          if (key === "Escape") hideForm();
        }}
        className=" relative"
      >
        <Button onClick={visible ? hideForm : showForm}>
          <BsYoutube />
        </Button>

        {visible && (
          <div className="absolute top-full right-0 mt-4 z-50">
            <div className="flex space-x-2">
              <input
                autoFocus
                type="text"
                placeholder="https://www.youtube.com"
                className="bg-transparent text-textcolor rounded-md border-2 border-white/10 focus:border-white/30 transition p-2"
                value={url}
                onChange={({ target }) => setUrl(target.value)}
              />
              <button onClick={handleSubmit} className="bg-indigo-600 px-2 py-1 text-white rounded text-sm">
                Embed
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
EmbedYoutube.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export default EmbedYoutube;
