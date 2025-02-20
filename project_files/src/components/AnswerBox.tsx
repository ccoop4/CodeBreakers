import { FaArrowCircleRight } from "react-icons/fa";
import { Dialog } from '@headlessui/react'
import { useState } from "react";

interface AnswerBoxProps {
  query: string[]
  query_idx: number
  clue: string
  accuracy: number
}



export default function AnswerBox({query, query_idx, clue, accuracy}: AnswerBoxProps) {
  return (
    <div key={query_idx} className="mt-8 bg-white p-4 shadow-lg rounded-lg w-full relative font-bold flex flex-row justify-around dark:bg-zinc-800">
      <div className="flex flex-col justify-center text-green-500">
        {query.map((word: string, word_idx: number) => (
          <div className="mr-2 select-none">
            {word}
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center text-4xl text-emerald-500">
        <FaArrowCircleRight />
      </div>
      <div className="flex flex-col justify-center items-center text-teal-500">
        <div className="text-2xl mb-1">{clue}</div>
        <div>{accuracy * 100}%</div>
      </div>
    </div>
    // <div className="flex flex-col justify-center items-center">
    // <div key={query_idx} className="mt-8 bg-white p-4 shadow-lg rounded-lg w-full relative text-green-500 font-bold flex flex-row justify-around dark:bg-zinc-800 cursor-pointer" onClick={() => setDetailed(true)}>
    //   {query.map((word: string, word_idx: number) => (
    //     <div className="mr-2 select-none">
    //       {word}
    //     </div>
    //   ))}
    // </div>
    // </div>
  )
}