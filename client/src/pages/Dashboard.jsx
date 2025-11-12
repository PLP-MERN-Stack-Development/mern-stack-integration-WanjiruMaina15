import { useEffect, useState, useMemo } from "react";
import NewNoteDialog from "../components/NewNoteDialog";
import NoteCard from "../components/Note";
import api from "../services/api";
import { useUser } from "@clerk/clerk-react";
import {
  // Keeping Pagination imports in case you implement it later
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../components/pagination";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "../components/navigation-menu";



// Define the available views
const VIEWS = {
  PUBLISHED: "published",
  DRAFTS: "drafts",
};

export default function Dashboard({ frontendUserId }) {
  const [notes, setNotes] = useState([]); // This will hold ALL notes/posts
  const [status, setStatus] = useState("idle");
  const { user } = useUser();
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState(VIEWS.PUBLISHED); // New state for view switching

  // --- Data Fetching Effect ---
  useEffect(() => {
    (async () => {
      try {
        setStatus("loading");
        // Assuming api.list fetches ALL posts (published and drafts)
        const data = await api.get(frontendUserId);
        setNotes(data);
        setStatus("success");
      } catch (e) {
        setError(e.message);
        setStatus("error");
      }
    })();
  }, [frontendUserId]);

  // --- Memoized Filtering for Views (Published vs. Drafts) ---
  // Assuming each note/post has an 'isDraft' boolean property
  const filteredNotes = useMemo(() => {
    if (activeView === VIEWS.DRAFTS) {
      return notes.filter((n) => n.isDraft);
    }
    // Default to published (or posts where isDraft is false/undefined)
    return notes.filter((n) => !n.isDraft);
  }, [notes, activeView]);

  // --- CRUD Functions ---

  // Function to create a new blog post/draft
  async function createBlog(payload) {
    // Add logic here to determine if the new post is a draft (e.g., a field in the NewNoteDialog)
    const newPayload = {
      ...payload,
      userId: frontendUserId,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      // You might add isDraft: payload.isDraft or isDraft: true/false based on user action
    };

    const created = await api.create(newPayload);
    // Add the new item to the start of the list
    setNotes((prev) => [created, ...prev]);
  }

  // Function to update/save a blog post/draft
  async function saveNote(id, payload) {
    const updated = await api.update(id, payload);
    setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
  }

  // Function to delete a blog post/draft
  async function deleteNote(id) {
    await api.remove(id);
    setNotes((prev) => prev.filter((n) => n._id !== id));
  }

  // Get user's first name for the greeting
  const userFirstName = user?.firstName || "Blogger";

  // --- Rendered Component ---
  return (
    <div className="mx-auto max-w-5xl p-4 space-y-6">
      {/* User Greeting Section */}
      <h1 className="text-3xl font-extrabold text-gray-800">
        👋 Welcome Back, {userFirstName}!
      </h1>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {activeView === VIEWS.PUBLISHED ? "Published Posts" : "Drafts"}
        </h2>
        {/* New Post/Blog Button */}
        <NewNoteDialog onCreate={createBlog} />
      </div>

      {/* Navigation Menu for View Switching */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              onClick={() => setActiveView(VIEWS.PUBLISHED)}
              active={activeView === VIEWS.PUBLISHED}
            >
              Published Posts
              <span className="ml-2 font-mono text-sm text-gray-500">
                ({notes.filter((n) => !n.isDraft).length})
              </span>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              onClick={() => setActiveView(VIEWS.DRAFTS)}
              active={activeView === VIEWS.DRAFTS}
            >
              Drafts
              <span className="ml-2 font-mono text-sm text-gray-500">
                ({notes.filter((n) => n.isDraft).length})
              </span>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <hr className="my-4" />

      {/* Content Rendering based on Status */}
      {status === "loading" && <p>Loading your blog posts...</p>}
      {status === "error" && (
        <p className="text-pink-600">Error: Could not load data. {error}</p>
      )}

      {status === "success" && filteredNotes.length === 0 && (
        <p className="text-gray-600">
          {activeView === VIEWS.PUBLISHED
            ? "You don't have any published posts yet. Click 'New Post' to start writing!"
            : "You don't have any drafts. Get writing!"}
        </p>
      )}

      {/* Blog Post Grid */}
      {status === "success" && filteredNotes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((n) => (
            <NoteCard
              key={n._id}
              note={n}
              onSave={saveNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}