import React, { createContext, useEffect, useMemo, useState } from "react";
import { AudioData } from "../typings";
import { updateEntry } from "../util/audio/updateEntry";
import { toast } from "react-hot-toast";



interface AudioDataInterface { 
    complete: AudioData | null,
    isFavourite: boolean, 

    handleAddtoFavourites: () => Promise<void>
}

interface Props { 
    data: AudioData | null
}

export default function useAudioData(data: AudioData | null): AudioDataInterface { 

    const [isFavourite, setIsFavourite] = useState<boolean>(data?.favourite ?? false)
    const updateData = async (updatedData: AudioData) => {
        await updateEntry(updatedData)
    }
    const handleAddtoFavourites = async () => { 
        if (!data) return 
        const updatedFavourite = !isFavourite;
        setIsFavourite(updatedFavourite);

        const newData = { ...data, favourite: updatedFavourite }
        await updateData(newData)

        if (updatedFavourite) {
            toast.success('Added to Favourites.')
        } else {
            toast.success('Removed from Favourites.')
        }
    }

    const memoValue = useMemo<AudioDataInterface>(() => ({
        complete: data,
        isFavourite,
        handleAddtoFavourites
    }), [
        handleAddtoFavourites,
        data,
        isFavourite
    ])
    return memoValue
}