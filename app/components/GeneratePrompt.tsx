import React, { useState } from 'react';

const promptsList = [
  'What was the happiest moment in your life?',
  'What is something you would like to change about yourself?',
  'What motivates you?',
  'What was the biggest challenge you faced and how did you overcome it?',
  'What is your biggest fear?',
  'What is something you have always wanted to do but haven’t done yet?',
  'Who has had the biggest influence on your life and why?',
  'What is your definition of success?',
  'What is a habit that you would like to break?',
  'What is something you are grateful for?',
];

function GeneratePrompt() {
  const [prompt, setPrompt] = useState('');

  const generatePrompt = () => {
    const randomIndex = Math.floor(Math.random() * promptsList.length);
    const randomPrompt = promptsList[randomIndex];
    setPrompt(randomPrompt);
  };

  return (
    <div className='items-center flex flex-col space-y-4 '>
      {
        !prompt.length && (
            <button
        className='cursor-pointer font-medium text-center text-sm items-center w-fit py-2 
            px-4 bg-[#f5f5f5] rounded-full text-[#747474]'
        onClick={generatePrompt}
      >
        Generate a Prompt
      </button>
        )
      } 
      {prompt && (
        <div className=''>
          <p className='font-medium text-center text-sm pb-2'>{prompt}</p>
        </div>
      )}
    </div>
  );
}

export default GeneratePrompt;