
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { ElevenLabsApiKey, ElevenLabsApiValue, OpenAIApiKey, OpenAIApiValue } from "../atoms/atoms";



export const OPENAI_KEY: string = "openai_api_key"
export const ELEVEN_LABS_KEY: string = "eleven_labs_api_key"
/*
  This enables storing and retrieving values in the browser's loval storage 
*/
export default function useLocalStorage(key: string, defaultValue?: string | null): [string | null, (value: any) => void] {
  // console.log("saving value in localstorage", key)
  
  const [storedValue, setStoredValue] = useState(defaultValue ?? null);
  const [elevenLabs, setelevenLabs] = useRecoilState(ElevenLabsApiKey);
  const [openAi, setopenAi] = useRecoilState(OpenAIApiKey);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {}
  }, [key]);

  const setValue = (value: any) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        let jsonValue = JSON.stringify(valueToStore)
        
        if (valueToStore === OPENAI_KEY) setopenAi(jsonValue)
        if (valueToStore === ELEVEN_LABS_KEY) setelevenLabs(jsonValue)

        window.localStorage.setItem(key, jsonValue);
      }
    } catch (error) {}
  };

  return [storedValue, setValue];
}

/*
  Deletes the values under these keys
*/
export function deleteLocalStorage(): boolean {
  const keysToDelete = [OPENAI_KEY, ELEVEN_LABS_KEY];

  try {
    keysToDelete.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log("Successfully deleted all keys");
    return true;
  } catch (error) {
    console.error("Failed to delete local storage keys:", error);
    return false;
  }
}