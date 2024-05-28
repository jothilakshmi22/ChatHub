import { createContext, useState } from "react";
import runChat from "../config/Api";
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [previousPrompt, SetPreviousPrompt] = useState([]);
  const [showResult, SetShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, SetResultData] = useState("");

  const delayResult = (index, nextword) => {
    setTimeout(() => {
      SetResultData((prev) => prev + nextword);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    SetShowResult(false);
  };
  const onSent = async (prompt) => {
    SetResultData(""); //previous data will remove
    setLoading(true);
    SetShowResult(true);
    let response;
    if (prompt !== undefined) {
      // click on recent sesion
      setRecentPrompt(prompt);
      response = await runChat(prompt);
    } else {
      SetPreviousPrompt((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }

    const responseArray = response.split("**");
    let newResponse = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }
    const newResponse2 = newResponse.split("*").join("</br>"); //* replace by br tag
    // SetResultData(response);
    // SetResultData(newResponse2);
    //Typing effect logic
    let newResponseArray = newResponse2.split(" ");
    for (let i = 0; i < newResponseArray.length; i++) {
      const nextword = newResponseArray[i];
      delayResult(i, nextword + " ");
    }
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    previousPrompt,
    SetPreviousPrompt,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };
  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};
export default ContextProvider;
