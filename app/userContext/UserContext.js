'use client';
import { createContext, useContext, useState } from 'react';

// Create a context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
