import {useEffect, useState} from 'react';
import css from './App.module.css';
import{useQuery, keepPreviousData } from '@tanstack/react-query';
import {useQueryClient} from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import {createNote, deleteNote} from '../../services/noteService';
import { useDebouncedCallback } from 'use-debounce';
import type {Note} from '../../types/note';
import SearcBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination'
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import type { NoteValues } from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import toast, { Toaster } from 'react-hot-toast';

export default function App(){
const queryClient = useQueryClient();
 const [search, setSearch] = useState('');
 const [page, setPage] = useState(1);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const debouncedSearch = useDebouncedCallback(
    (value) => {
      setSearch(value);
    }, 500);

const handleSearch = (newValue:string) => {
    setPage(1);
    debouncedSearch(newValue);
};

const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['memos',search, page],
    queryFn: () => fetchNotes(search, page),
    enabled: true,
    placeholderData: keepPreviousData,
  });
  
 	const mutation =  useMutation<Note, Error, NoteValues>({
  mutationFn: (noteData) => createNote(noteData),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['memos'] });
    setIsModalOpen(false);
  },
  onError: (error) => {
    console.log(error);
  }
})

 useEffect(() => {
    if(isSuccess && data?.notes.length === 0 && search !== ''){
toast.error('No notes found for your request.', {
      id: 'no-notes-found',});

 }},[isSuccess, data, search]);

const deleteMutation = useMutation({
  mutationFn: (id: number) => deleteNote(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['memos'] });
  }});

    return(
        <div className={css.app}>
          <Toaster position="top-right" reverseOrder={false} />
	<header className={css.toolbar}> 
		<SearcBox onChange={handleSearch} />
        {isLoading && !data && <Loader />}
       {isError && <ErrorMessage/>}
		  {data && data.totalPages > 1 && (<Pagination     
    totalPages={data.totalPages} 
      currentPage={page}
    onPageChange={setPage}/> 
    )}
		<button className={css.button} onClick={() => setIsModalOpen(true)} >
      Create note +</button>
  </header>

  {isSuccess && data && (
  <NoteList 
    notes={data.notes} 
    onDelete={(id) => deleteMutation.mutate(id)}
  />
)}
      <Modal isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)}>
        <NoteForm onClose={() => setIsModalOpen(false)}    
        handleSave={(values) => {
            mutation.mutate(values)}
            }            
        />
        </Modal>
        </div>
    );
}