import TrackContainerItem from "./TrackContainerItem";

function TrackContainer({ tracks, name, onAddTrack, onRemoveTrack, addedTracks }) {
    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold my-4">{name}</h2>
            <div className="grid grid-rows-3 grid-flow-col auto-cols-100% md:auto-cols-1/3 lg:auto-cols-1/4 overflow-scroll gap-2">
                {tracks.map(x => (
                    <TrackContainerItem
                        key={x.id}
                        track={x}

                        isAdded={!!addedTracks.find(y => y.id === x.id)}
                        onAddTrack={() => onAddTrack(x)}
                        onRemoveTrack={() => onRemoveTrack(x)}
                    />
                ))}
            </div>
        </div>
    )
}

export default TrackContainer;