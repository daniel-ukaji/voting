import { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios"

const NewAuthContext = createContext();

export function NewAuthProvider({ children }) {
  const [code, setCode] = useState(null);

  // Function to handle authentication
  const authenticate = async (empno, otpValue) => {
    try {
      const apiUrl = 'https://virtual.chevroncemcs.com/voting/voter';
      const requestBody = {
        empno: empno,
        code: otpValue,
      };

      const response = await axios.post(apiUrl, requestBody);

      // Handle the API response here
      setCode(response.data.code);
      console.log(code)
      console.log(response.data)

      // Store the code in local storage
      localStorage.setItem('code', response.data.code);
      console.log(code)

      return true; // Authentication success
    } catch (error) {
      console.error('Authentication Error:', error);
      return false; // Authentication failed
    }
  };

  // Check for code in local storage during initialization
  useEffect(() => {
    const storedCode = localStorage.getItem('code');
    if (storedCode) {
      setCode(storedCode);
    }
  }, []);

  return (
    <NewAuthContext.Provider value={{ code, authenticate }}>
      {children}
    </NewAuthContext.Provider>
  );
}

export function useNewAuth() {
  return useContext(NewAuthContext);
}
