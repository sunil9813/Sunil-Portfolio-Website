import { useEffect, useState } from "react";
import { validateUrl } from "../utils/EditorUtils";
import PropTypes from "prop-types";

const defaultLink = { url: "", openInNewTab: false };

const LinkForm = ({ visible, initialState, onSubmit }) => {
  const [link, setLink] = useState(defaultLink);

  const handleSubmit = () => {
    onSubmit({ ...link, url: validateUrl(link.url) });
    resetForm();
  };

  const resetForm = () => {
    setLink({ ...defaultLink });
  };

  useEffect(() => {
    if (initialState) setLink({ ...initialState });
  }, [initialState]);

  if (!visible) return null;

  return (
    <div className="rounded p-2 bg-sidebarbg shadow-md w-56">
      <input
        autoFocus
        type="text"
        placeholder="https://www.example.com"
        className="bg-transparent text-textcolor rounded-md border-2 border-white/10 focus:border-white/30 transition p-2 w-full"
        value={link.url}
        onChange={({ target }) => setLink({ ...link, url: target.value })}
      />

      <div className="flex items-center space-x-2 mt-2">
        <input checked={link.openInNewTab} onChange={({ target }) => setLink({ ...link, openInNewTab: target.checked })} type="checkbox" id="open-in-new" />
        <label htmlFor="open-in-new">Open in new tab</label>
        <div className="flex-1 text-right">
          <button onClick={handleSubmit} className="bg-indigo-600 px-2 py-1 text-white rounded text-sm">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
LinkForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialState: PropTypes.shape({
    url: PropTypes.string,
    openInNewTab: PropTypes.bool,
  }),
};
export default LinkForm;
