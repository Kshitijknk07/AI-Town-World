import React from "react";

interface TutorialModalProps {
  open: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-lg w-full rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          aria-label="Close tutorial"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">
          🧑‍💻 AI Town World: Quick Start Guide
        </h2>
        <ol className="list-decimal pl-5 space-y-2 mb-4">
          <li>
            <b>Start the Backend</b>:
            <pre className="bg-gray-100 rounded p-2 mt-1 text-sm">
              cd backend pnpm dev
            </pre>
            <span className="text-xs text-gray-500">
              Wait for "AI Town Server started" in the logs.
            </span>
          </li>
          <li>
            <b>Start the Frontend</b>:
            <pre className="bg-gray-100 rounded p-2 mt-1 text-sm">
              cd frontend pnpm install pnpm dev
            </pre>
            <span className="text-xs text-gray-500">
              Open{" "}
              <a
                href="http://localhost:5173"
                className="underline text-blue-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                http://localhost:5173
              </a>{" "}
              in your browser.
            </span>
          </li>
          <li>
            <b>Using the App</b>:
            <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
              <li>
                <b>Town Map:</b> See all agents and buildings. Click an agent to
                view details.
              </li>
              <li>
                <b>Sidebar:</b> List of all agents. Select one to view or chat.
              </li>
              <li>
                <b>Event Log:</b> Shows all recent events in the simulation.
              </li>
              <li>
                <b>Chat Window:</b> Send messages to agents and see their
                replies.
              </li>
              <li>
                <b>Memory Viewer:</b> See what agents remember.
              </li>
              <li>
                <b>Dev Tools:</b> For advanced users to debug and monitor the
                simulation.
              </li>
              <li>
                <b>Time Controls:</b> Pause, play, or speed up the simulation.
              </li>
            </ul>
          </li>
          <li>
            <b>Common Actions</b>:
            <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
              <li>
                <b>Add an agent:</b> Use the Dev Tools or API.
              </li>
              <li>
                <b>Send a chat:</b> Select an agent, type a message, and send.
              </li>
              <li>
                <b>View agent info:</b> Click on an agent in the map or sidebar.
              </li>
              <li>
                <b>Pause/resume:</b> Use the time controls at the bottom.
              </li>
            </ul>
          </li>
          <li>
            <b>Troubleshooting</b>:
            <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
              <li>
                If you see "connection refused" or "not found" errors, make sure
                both backend and frontend are running.
              </li>
              <li>
                If the AI doesn’t respond, check that Ollama or your LLM is
                running.
              </li>
            </ul>
          </li>
          <li>
            <b>More Help</b>:
            <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
              <li>Read the README for full documentation.</li>
              <li>Ask for help if you get stuck!</li>
            </ul>
          </li>
        </ol>
        <h3 className="text-lg font-semibold mb-2">❓ FAQ</h3>
        <ul className="list-disc pl-5 text-sm space-y-1 mb-2">
          <li>
            <b>Q:</b> Why is the map empty?
            <br />
            <b>A:</b> No agents are loaded yet. Add agents via Dev Tools or API.
          </li>
          <li>
            <b>Q:</b> Why do I see connection errors?
            <br />
            <b>A:</b> Make sure both backend and frontend are running and the
            ports match.
          </li>
          <li>
            <b>Q:</b> How do I reset the simulation?
            <br />
            <b>A:</b> Use the Dev Tools or restart the backend.
          </li>
        </ul>
        <div className="text-xs text-gray-400 mt-4">
          AI Town World &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
