import { Link } from "react-router";

export default function ToolsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-start p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Coneheads Tools</h2>

      <div className="flex flex-wrap justify-center gap-6">
        <Link
          to="/tools/berry"
          className="w-64 p-4 bg-white rounded-xl shadow-md hover:shadow-xl hover:bg-slate-100 transition duration-200 border border-slate-200"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Berry Farming Assistant
          </h3>
          <p className="text-sm text-slate-600">
            Track your berry plots to optimize yields.
          </p>
        </Link>
      </div>
    </div>
  );
}
