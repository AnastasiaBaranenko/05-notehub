import {useEffect, useState} from 'react';
import css from './App.module.css';
import{useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import { useDebouncedCallback } from 'use-debounce';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination'
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import NoteList from '../NoteList/NoteList';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import toast, { Toaster } from 'react-hot-toast';

export default function App(){

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

 useEffect(() => {
    if(isSuccess && data?.notes.length === 0 && search !== ''){
toast.error('No notes found for your request.', {
      id: 'no-notes-found',});
 }},[isSuccess, data, search]);

    return(
        <div className={css.app}>
          <Toaster position="top-right" reverseOrder={false} />
	<header className={css.toolbar}> 
		<SearchBox onChange={handleSearch} />
        {isLoading && search !== '' && <Loader />}
       {isError && <ErrorMessage/>}
		  {data && data?.totalPages > 1 && (<Pagination     
    totalPages={data.totalPages} 
      currentPage={page}
    onPageChange={setPage}/> 
    )}
		<button className={css.button} onClick={() => setIsModalOpen(true)} >
      Create note +</button>
  </header>

  {isSuccess && data?.notes.length > 0 && (
  <NoteList 
    notes={data.notes} 
  />
)}
{isModalOpen && 
      <Modal isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)}>
        <NoteForm onClose={() => setIsModalOpen(false)}    
        />
        </Modal>
}
        </div>
    );
}