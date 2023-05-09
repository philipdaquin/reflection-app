import React from 'react'
import { AudioData } from '../../typings'

interface Props { 
    entry: AudioData | null
}

function PreviewEntryContent({entry}: Props) {
  return (
    <div>PreviewEntryContent</div>
  )
}

export default PreviewEntryContent