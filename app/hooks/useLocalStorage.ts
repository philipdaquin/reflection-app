
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { ElevenLabsApiKey, OpenAIApiKey } from "../atoms/atoms";



export const OPENAI_KEY: string = "openai_api_key"
export const ELEVEN_LABS_KEY: string = "eleven_labs_api_key"
/*
  This enables storing and retrieving values in the browser's loval storage 
*/
// Hook
export default function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // const [elevenLabs, setelevenLabs] = useRecoilState(ElevenLabsApiKey);
  // const [openAi, setopenAi] = useRecoilState(OpenAIApiKey);


  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      if (typeof window !== "undefined") {

        let store = JSON.stringify(valueToStore)

        // if (valueToStore === OPENAI_KEY) setopenAi(store)
        // if (valueToStore === ELEVEN_LABS_KEY) setelevenLabs(store)

        window.localStorage.setItem(key, store);
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}

