"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  clearMessage,
  updateMessage,
} from "../app/Redux/features/Message";
import Image from "next/image";
import ScrollableFeed from "react-scrollable-feed";
import { IoPaperPlaneOutline } from "react-icons/io5";
import axios from "axios";

const CHAT_URL = `https://lms-chat.kindsand-953008a2.centralindia.azurecontainerapps.io`;

const NewChatBot = ({ userId, courseId }) => {
  const controllerRef = useRef(null);

  const messages = useSelector((store) => store.Message);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [chatId, setChatId] = useState("");
  const [firstChat, setFirstChat] = useState(true);

  const dispatch = useDispatch();

  const inputRef = useRef(null);

  const getChatId = async (userId, courseId) => {
    try {
      const res = await axios.get(
        `${CHAT_URL}/v1/get-chatId?course_id=${courseId}&user_id=${userId}`
      );

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleChat = async (msg, chatIdValue) => {
    const currId = Date.now();
    const controller = new AbortController();
    controllerRef.current = controller;

    if (chatIdValue !== "") {
      setLoading(true);

      try {
        const timeoutID = setTimeout(() => {
          if (controllerRef.current) {
            controllerRef.current.abort();
            controllerRef.current = null;
            dispatch(
              addMessage({
                type: "error",
                text: "Something went wrong! Please try again.",
              })
            );
          }
        }, 60000);

        const res = await fetch(
          `${CHAT_URL}/v1/chat?query=${encodeURIComponent(prompt || msg)}`,
          {
            headers: {
              "CHAT-ID": chatIdValue,
            },
            signal: controllerRef.current.signal,
          }
        );

        console.log(res);

        if (!res.ok) {
          dispatch(
            addMessage({
              id: currId,
              type: "bloc",
              text: "We are facing high demands at the monent!",
            })
          );
        }

        if (res.ok) {
          clearTimeout(timeoutID);
          setPrompt("");

          const reader = res.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let partialData = "";
          const linksArray = [];
          setLoading(false);
          dispatch(
            addMessage({ id: currId, type: "bloc", text: "Loading..." })
          );
          let done, value;
          while (!done) {
            ({ value, done } = await reader.read());
            value = decoder.decode(value);
            if (done) {
              console.log("Stream Completed");
              return;
            }

            partialData += value;

            dispatch(updateMessage({ id: currId, type: "bloc", text: value }));
          }
        }
      } catch (error) {
        console.log("error in Chat api: ", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClick = async () => {
    dispatch(addMessage({ type: "user", text: prompt }));

    if (inputRef.current) {
      inputRef.current.style.height = "40px";
    }

    if (firstChat) {
      const res = await getChatId(userId, courseId);
      if (res) {
        await setChatId(res.chatId);
        await setFirstChat(false);
        await handleChat(prompt, res.chatId);
      }
    } else {
      await handleChat(prompt, chatId);
    }
  };

  const newChat = async () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
    dispatch(clearMessage());

    const res = await getChatId(userId, courseId);
    if (res) {
      setChatId(res.chatId);
    }
  };

  const handleKey = (e) => {
    if (prompt.trim() !== "") {
      if (e.key === "Enter") {
        if (!e.shiftKey) {
          e.preventDefault();
          handleClick();
          if (inputRef.current) {
            inputRef.current.style.height = "40px";
          }
        }
      }
    }
  };

  const handleInputChange = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
      inputRef.current.style.maxHeight = "100px";
      inputRef.current.style.minHeight = "40px";
      inputRef.current.style.overflowY =
        inputRef.current.scrollHeight > 300 ? "scroll" : "hidden";
    }
  };

  return (
    <>
      <div
        className={`h-full w-full border-[1px] bg-white border-[#b3b3b3cc] rounded-lg flex-col relative`}
      >
        <div
          className={`border-slate-300 h-[76px] border-b-[1px] flex items-center justify-between `}
        >
          <div className="flex items-center gap-2 ml-4 py-2 ">
            <div>
              <div
                className={`text-2xl md:text-3xl font-poppins font-semibold text-black`}
              >
                Ask any Doubt
              </div>
            </div>
          </div>
          <div className=" flex gap-2 w-fit md:flex-row items-center justify-center md:justify-end">
            <button
              className={`text-[#515151] bg-transparent cursor-pointer w-14 text-sm font-bold border border-solid border-[#515151] px-2 py-2 rounded mx-3`}
              onClick={newChat}
            >
              NEW
            </button>
          </div>
        </div>
        <div
          className={`text-black !h-[65%] max-h-[100%] overflow-y-auto `}
        >
          <ScrollableFeed className="w-full !h-full flex flex-col items-start justify-between gap-4">
            <div className="w-full flex-1">
              <div className="flex items-start justify-start px-2 py-2 space-x-1 mr-[15%] mt-2 gap-2">
                <div className="flex flex-col items-start justify-start gap-1">
                  <div className={`font-inter font-bold text-sm `}>Bloc</div>
                  <div
                    className={`bg-[#F2F2F2] px-3 py-2 rounded-e-lg rounded-bl-lg text-sm leading-[18px] font-spacegrotesk font-normal `}
                  >
                    hi, I am bloc. How can I help up?
                  </div>
                </div>
              </div>
              {messages.map((msg, index) => (
                <div key={index} className="space-y-2 w-full">
                  {msg.type === "user" ? (
                    <div className="flex items-end justify-end ml-[25%] mr-[1%]">
                      <div className="flex flex-col px-2 py-2 w-fit justify-end space-x-1 ">
                        <span className="text-sm font-inter font-semibold">
                          You
                        </span>
                        <div
                          className={` text-white bg-primary px-[10px] py-[6px] rounded-s-lg rounded-br-lg text-sm leading-[18px] font-spacegrotesk font-normal `}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ) : msg.type === "bloc" ? (
                    <div className="flex items-start justify-start px-2 py-2 space-x-1 max-w-[85%] mt-2 gap-2">
                      <div className="flex flex-col items-start justify-start gap-1 w-full">
                        <div className="font-inter font-bold text-sm">Bloc</div>
                        <div
                          className={`bg-[#F2F2F2] px-3 py-2 rounded-e-lg rounded-bl-lg text-sm leading-[18px] font-spacegrotesk font-normal ${
                            msg.text === "Loading..."
                              ? "w-fit"
                              : "w-fit max-w-full"
                          } `}
                        >
                          {msg.text === "Loading..." ? (
                            <div className="w-8 h-3 items-center justify-center flex gap-1">
                              <div
                                className={`animate-pulse w-[6px] h-[6px] bg-slate-900 rounded-full`}
                              ></div>
                              <div
                                className={`w-[6px] h-[6px] bg-black animate-bounce rounded-full`}
                              ></div>
                              <div
                                className={`w-[6px] h-[6px] bg-slate-900 animate-ping rounded-full`}
                              ></div>
                            </div>
                          ) : (
                            <>
                              <div
                                className="botResponse"
                                dangerouslySetInnerHTML={{ __html: msg.text }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-start px-2 py-2 space-x-1 mr-[15%] mt-2 gap-2">
                      <div className="flex flex-col items-start justify-start gap-1">
                        <div className="font-inter font-bold text-sm">Bloc</div>
                        <div
                          className={`border-[#FF878780] border-solid border text-[#ff6c6cc5] bg-transparent px-3 py-2 rounded-e-lg rounded-bl-lg text-sm leading-[18px] font-spacegrotesk font-normal `}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="w-8 h-3 items-center justify-center flex gap-1">
                <div
                  className={`animate-pulse w-[6px] h-[6px] bg-slate-900 rounded-full`}
                ></div>
                <div
                  className={`w-[6px] h-[6px] bg-black animate-bounce rounded-full`}
                ></div>
                <div
                  className={`w-[6px] h-[6px] bg-slate-900 animate-ping rounded-full`}
                ></div>
              </div>
              )}
            </div>
          </ScrollableFeed>
        </div>
        <div className="h-[50px] mt-3 flex px-4 items-center justify-end gap-2">
          <div className="flex relative w-full flex-col-reverse items-end">
            <textarea
              ref={inputRef}
              rows={1}
              style={{
                resize: "none",
                height: "40px",
                position: "absolute",
                bottom: "-20px",
              }}
              onKeyDown={handleKey}
              onInput={handleInputChange}
              onChange={(e) => setPrompt(e.target.value)}
              className={`${
                !loading
                  ? `bg-transparent text-[#000000a2] focus:border-[#0784C6]`
                  : "bg-[#c5c5c596] focus:border-[#888] cursor-not-allowed"
              } w-full overflow-hidden border border-solid h-[40px] border-[#434343] rounded-lg px-2 py-1 pt-2 text-base leading-[20px] font-inter font-normal focus:outline-none focus:ring-0`}
              placeholder={""}
              disabled={loading}
              value={prompt}
            />
          </div>
          <button
            onClick={() => handleClick()}
            disabled={loading}
            className={`${
              !loading ? ` ` : ` cursor-not-allowed`
            } flex items-center justify-center w-[40px] h-[40px] border-[#434343] border-[1px] p-2 rounded text-2xl font-extrabold`}
          >
            <IoPaperPlaneOutline />
          </button>
        </div>
        <div className="flex w-fit gap-1 items-center mx-auto justify-center text-[#A6A6A6] hover:underline">
          {/* <Link href="https://www.askbloc.ai" passHref> */}
          <a href="https://www.askbloc.ai" target="_blank">
            <span className="font-inter">Powered by</span>{" "}
            <span className={`text-black font-poppins text-lg`}>Bloc</span>
          </a>
          {/* </Link> */}
        </div>
      </div>
    </>
  );
};

export default NewChatBot;
