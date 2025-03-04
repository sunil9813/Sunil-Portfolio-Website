import PropTypes from "prop-types";

const Table = ({ editor }) => {
  return (
    <>
      <div className="mt-2">
        <div className="button-group flex gap-2 flex-wrap">
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
            Insert table
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().addColumnBefore().run()}>
            Add column before
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            Add column after
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().deleteColumn().run()}>
            Delete column
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().addRowBefore().run()}>
            Add row before
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().addRowAfter().run()}>
            Add row after
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().deleteRow().run()}>
            Delete row
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().deleteTable().run()}>
            Delete table
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().mergeCells().run()}>
            Merge cells
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().splitCell().run()}>
            Split cell
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
            Toggle header column
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
            Toggle header row
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().toggleHeaderCell().run()}>
            Toggle header cell
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().mergeOrSplit().run()}>
            Merge or split
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().setCellAttribute("colspan", 2).run()}>
            Set cell attribute
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().fixTables().run()}>
            Fix tables
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().goToNextCell().run()}>
            Go to next cell
          </button>
          <button className="px-4 py-1 text-xs bg-black/20" onClick={() => editor.chain().focus().goToPreviousCell().run()}>
            Go to previous cell
          </button>
        </div>
      </div>
    </>
  );
};
Table.propTypes = {
  editor: PropTypes.object,
};

export default Table;
