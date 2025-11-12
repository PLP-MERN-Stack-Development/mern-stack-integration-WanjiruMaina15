import { Button } from "./button";
import { Card, CardContent, CardHeader } from "./card";
import { useState } from "react";
import { Input } from "./input";
import { Textarea } from "./textarea";

export default function NoteCard({ note, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: note.title, content: note.content });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex items-center justify-between">
        {!editing ? (
          <>
            <h3 className="text-lg font-semibold">{note.title}</h3>
            <div className="flex gap-2">
              <Button className="bg-slate-700 hover:bg-slate-800" onClick={()=>{setDraft({ title: note.title, content: note.content }); setEditing(true);}}>Edit</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={()=>onDelete(note._id)}>Delete</Button>
            </div>
          </>
        ) : (
          <h3 className="text-lg font-semibold">Edit Note</h3>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {!editing ? (
          <p className="text-slate-700 whitespace-pre-wrap">{note.content || <em>No content</em>}</p>
        ) : (
          <form onSubmit={(e)=>{e.preventDefault(); onSave(note._id, draft); setEditing(false);}} className="space-y-2">
            <Input value={draft.title} onChange={(e)=>setDraft({...draft, title:e.target.value})} />
            <Textarea rows={5} value={draft.content} onChange={(e)=>setDraft({...draft, content:e.target.value})}/>
            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
              <Button type="button" className="bg-slate-600 hover:bg-slate-700" onClick={()=>setEditing(false)}>Cancel</Button>
            </div>
          </form>
        )}
        <p className="text-xs text-slate-500">Updated {new Date(note.updatedAt).toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}