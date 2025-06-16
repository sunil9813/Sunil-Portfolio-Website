import { TbAlertTriangleFilled } from "react-icons/tb";
import { useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-white to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center">
        <div className="flex items-center justify-center text-red-500 mb-4">
          <TbAlertTriangleFilled className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Unexpected Application Error</h1>
        <p className="text-gray-600 mb-4">Oops! Something went wrong while loading the page.</p>

        <div className="bg-gray-100 p-4 rounded text-sm text-left overflow-x-auto max-h-48">
          <pre className="text-red-500 whitespace-pre-wrap break-words">{error?.message || "Unknown Error"}</pre>
        </div>

        <button onClick={() => window.location.reload()} className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition duration-200">
          Reload Page
        </button>
      </div>
    </div>
  );
};
