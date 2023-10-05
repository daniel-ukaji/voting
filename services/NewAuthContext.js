import { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios"
import { useRouter } from 'next/router';

const NewAuthContext = createContext();

export function NewAuthProvider({ children }) {
  const [code, setCode] = useState(null);

  const router = useRouter();

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

      // Store the code in local storage
      localStorage.setItem('code', response.data.code);

      return true; // Authentication success
    } catch (error) {
      console.error('Authentication Error:', error);
      return false; // Authentication failed
    }
  };

  // Function to handle logout
  const logout = () => {
    // Clear the code from state and local storage
    setCode(null);
    localStorage.removeItem('code');
    // Redirect to the home page
    router.push('/signinmember');
  };

  // Check for code in local storage during initialization
  useEffect(() => {
    const storedCode = localStorage.getItem('code');
    if (storedCode) {
      setCode(storedCode);
    }
  }, []);

  return (
    <NewAuthContext.Provider value={{ code, authenticate, logout }}>
      {children}
    </NewAuthContext.Provider>
  );
}

export function useNewAuth() {
  return useContext(NewAuthContext);
}
