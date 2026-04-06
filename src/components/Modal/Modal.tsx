import { createPortal } from 'react-dom';
import css from './Modal.module.css';
import {useEffect } from 'react';

interface ModalProps{
  isOpen: boolean;
  children: React.ReactNode;
   onClose: () => void;
}

export default function Modal({ isOpen, onClose, children }:ModalProps){
  useEffect(() => {
	  const handleKeyDown = (e: KeyboardEvent) => {
	    if (e.key === "Escape") {
	      onClose();
	    }
	  };

     document.addEventListener("keydown", handleKeyDown);
     document.body.style.overflow = "hidden";
	 
	  return () => {
	    document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
	  };
	}, [isOpen, onClose]);

if (!isOpen) return null;

const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
};

    return createPortal(
        <div
  className={css.backdrop}
  role="dialog"
  aria-modal="true"
  onClick={handleBackdropClick}
>
  <div className={css.modal} onClick={(e) => e.stopPropagation()}>
{children}
  </div>
</div>,
document.body
)
}