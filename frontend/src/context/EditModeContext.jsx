import { createContext, useContext, useState } from 'react';

const EditModeContext = createContext(null);

export function EditModeProvider({ children }) {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <EditModeContext.Provider value={{ isEditMode, setIsEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
} 