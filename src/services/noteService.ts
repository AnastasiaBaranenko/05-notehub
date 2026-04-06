import type { NoteValues } from '../components/NoteForm/NoteForm';
import type {Note} from '../types/note';
import axios from "axios";

export interface Notes{
notes: Note[];
totalPages: number;
}

const key = import.meta.env.VITE_NOTEHUB_TOKEN;
const url = import.meta.env.VITE_BASE_URL;

export async function fetchNotes(search: string, page: number): Promise<Notes>{

const response = await axios.get<Notes>(`${url}/notes`, {
    params: {
        search: search,
        page: page,
},
headers: {
Authorization: `Bearer ${key}`,
  },
});
   return response.data;
}

      export async function createNote(newNote:NoteValues):Promise<Note>{
        const results = await axios.post<Note>(`${url}/notes`, newNote, {
      headers: {
Authorization: `Bearer ${key}`,
  }});
  return results.data;
      }
      
     export async function deleteNote(id:string):Promise<Note>{
      const response = await axios.delete<Note>(`${url}/notes/${id}`, {
        headers: {
Authorization: `Bearer ${key}`,
  },
   });
   return response.data;
     }
      