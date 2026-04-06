import type { NoteValues } from '../components/NoteForm/NoteForm';
import type {Note} from '../types/note';
import axios from "axios";

export interface Notes{
notes: Note[];
per_page: number;
totalPages: number;
}

const key = import.meta.env.VITE_NOTEHUB_TOKEN;

export async function fetchNotes(search: string, page: number): Promise<Notes>{
// try{
const response = await axios.get<Notes>('https://notehub-public.goit.study/api/notes', {
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
        const results = await axios.post<Note>('https://notehub-public.goit.study/api/notes', newNote, {
      headers: {
Authorization: `Bearer ${key}`,
  }});
  return results.data;
      }
      
     export async function deleteNote(id:number){
      await axios.delete(`https://notehub-public.goit.study/api/notes/${id}`, {
        headers: {
Authorization: `Bearer ${key}`,
  },
   });
     }
      