"use client"

import { useEffect, useState } from "react"
import { FaArrowAltCircleRight, FaCog, FaQuestionCircle } from "react-icons/fa"
import { BsSun } from "react-icons/bs";
import { HiMoon } from "react-icons/hi";
import AnswerBox from "@/components/AnswerBox";

export default function Home() {
  const [input, setInput] = useState<string>('')
  const [words, setWords] = useState<string[]>([])
  // const [result, setResult] = useState<{ result: [string[], [string, number]][], removed_words: string[], error: string }>({ result: [], removed_words: [], error: "" })
  const [searchHistory, setSearchHistory] = useState<{ result: [string[], [string, number]][], removed_words: string[], error: string }[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const storedSearchHistory = localStorage.getItem('searchHistory')
    if (storedSearchHistory) {
      const parsedStringArrays = JSON.parse(storedSearchHistory) as { result: [string[], [string, number]][], removed_words: string[], error: string }[]
      setSearchHistory(parsedStringArrays)
    }
    const storedDarkMode = localStorage.getItem('darkMode')
    if (storedDarkMode) {
      const parsedDarkMode = JSON.parse(storedDarkMode) as number
      setDarkMode(parsedDarkMode === 1 ? true : false)
    }
  }, [])

  const updateWords = (): void => {
    const input_word = input.replace(/[^0-9a-z\s]/gi, '').trim().toLowerCase()
    if (input_word.length > 0 && !words.includes(input_word)) setWords((prevHistory) => [...prevHistory, input_word])
    setInput('')
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') updateWords()
  }

  const handleBubbleClick = (index: number): void => {
    setWords((prevHistory) => prevHistory.filter((_, i) => i !== index))
  }

  const handleGoClick = (): void => {
    setLoading(true)
    fetch("http://127.0.0.1:5000/api/route", {
      method: "POST",
      body: JSON.stringify(words),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    .then((response: Response) => response.json())
    .then((data: { result: [string[], [string, number]][], removed_words: string[], error: string }) => {
      // setResult(data)
      setSearchHistory((prevHistory) => [data, ...prevHistory])
      localStorage.setItem('searchHistory', JSON.stringify([data, ...searchHistory]))
      setLoading(false)
    })
    setWords([])
    setInput('')
  }

  const [darkMode, setDarkMode] = useState<boolean>(false)
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', JSON.stringify(1))
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', JSON.stringify(0))
    }
  }, [darkMode])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-100 dark:bg-slate-700 transition-colors">
      <div className="bg-white dark:bg-zinc-800 p-8 shadow-lg rounded-lg w-1/3 text-center transition-colors">
        <div className="flex justify-end mb-4">
          {/* <div className="cursor-pointer mr-2">
            <FaCog size={18} className="text-gray-600" />
          </div>
          <div className="cursor-pointer mr-2">
            <FaQuestionCircle size={18} className="text-gray-600" />
          </div> */}
          <div className="cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <BsSun size={18} className="text-gray-600" /> : <HiMoon size={18} className="text-gray-600" />}
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Insert words here..."
            className="delay-50 text-gray-700 w-full h-10 pl-4 pr-8 border border-gray-300 bg-gray-100 rounded-md transition-colors duration-300 hover:outline-none hover:ring hover:border-blue-300 focus:outline-none focus:ring focus:border-blue-300"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyUp={handleKeyPress}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={updateWords}>
            <FaArrowAltCircleRight className="text-gray-400" />
          </div>
        </div>
        <div className="flex flex-wrap justify-center">
          {words.map((term: string, index: number) => (
            <div 
              key={index} 
              className="relative bg-green-500 text-white rounded-xl px-3 py-1 ml-1 mr-1 mt-4 cursor-pointer select-none dark:bg-purple-500 transition-colors"
              onClick={() => handleBubbleClick(index)}
            >
              {/* 
                Little "x" icon that shows up when user is hovering over word.
                Can't figure out how to center it, so I'm commenting it out for now.
                Just going to put some instructions instead.
              */}
              {/* {hovered === index ? (
                <FaTimes className="absolute top-0 right-0 text-xl text-white" />
              ) : null} */}
              {term}
            </div>
          ))}
        </div>
        <button 
          className={`w-full bg-blue-400 transition-all ease-in-out ${(words.length > 1 && !loading) ? `bg-blue-500 hover:scale-105 cursor-pointer` : `cursor-default`} text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-300 glow-blue mt-4 select-none`}
          onClick={() => (words.length > 1 && !loading) && handleGoClick()}
          data-tooltip-id="go-button-tooltip" 
          data-tooltip-content="Please enter at least two words"
        >
          {loading ? <span>Loading...</span> : <span>Go!</span>}
        </button>
        {/* {words.length < 2 && <Tooltip id="go-button-tooltip" />} */}
      </div>
      <div className="w-1/3 ">
        <ul>
          {searchHistory.map((query: { result: [string[], [string, number]][], removed_words: string[], error: string }, query_idx: number) => (
            query['result'].map((clue_list: [string[], [string, number]], word_idx: number) => (
              <AnswerBox query={clue_list[0]} query_idx={word_idx} clue={clue_list[1][0]} accuracy={clue_list[1][1]} />
            ))
          ))}
        </ul>
      </div>
      <a className="flex justify-center mt-4 rounded-full cursor-pointer items-center drop-shadow-lg" href="https://codenames.game/" target="_blank">
        <img src="/codebreakers-logo.png" alt="CodeBreakers Logo" className="w-24 h-24 border-8 border-solid border-white dark:border-zinc-800 transition-colors rounded-full hover:scale-105 transition-all ease-in-out duration-200" />
      </a>
    </main>
  )
}
