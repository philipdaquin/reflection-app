import React from 'react'

interface Props {
    text: string
}

function AudioTranscripts({text}: Props) {
    const sentences = text.split('.').filter(sentence => sentence.trim() !== '');

  return (
    <div className="flex flex-col justify-center items-center">
         {sentences.map((sentence, index) => (
        <div key={index} className="w-full text-sm text-center mb-4">
          {sentence.trim() + '.'}
        </div>
      ))}
    </div>
  )
}

export default AudioTranscripts