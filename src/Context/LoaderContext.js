// LoaderContext.js
import { createContext, useState, useContext } from 'react';

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loaderText, setLoaderText] = useState(''); 

  const showLoader = (text = '') => {
    setLoaderText(text);
    setLoading(true);
  };
  
  const hideLoader = () => {
    setLoading(false);
    setLoaderText('');
  };

  return (
    <LoaderContext.Provider value={{ loading, loaderText, showLoader, hideLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};
