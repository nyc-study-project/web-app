export default function Pagination({ page, setPage }) {
  return (
    <div className="flex gap-3 mt-4">
      <button
        className="px-4 py-2 bg-gray-200 rounded"
        onClick={() => setPage(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
