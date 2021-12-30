import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic, faChevronUp, faChevronDown, faCircleNotch } from "@fortawesome/free-solid-svg-icons";

import PlaylistSummaryItem from "./PlaylistSummaryItem";
import { seconds2pretty } from "../util";

function PlaylistSummary({ name, onChangedName, addedTracks, onChangeTracks, onCreate }) {
    let [expanded, setExpanded] = useState(false);
    let [isCreating, setCreating] = useState(false);

    let seconds = Math.floor(addedTracks
        .map(x => x.duration_ms / 1000)
        .reduce((a,x) => a+x, 0));

    return (
        <div className="sticky bottom-5 mx-5 bg-white drop-shadow-md p-5 rounded-xl divide-y divide-gray-200">
            <div className={"w-full grid grid-cols-2 grid-rows-2 md:grid-cols-3 md:grid-rows-1" + (expanded ? " pb-5" : "")}>
                <div className="flex justify-start items-center w-full overflow-hidden col-span-2 md:col-span-1">
                    <input
                        className="font-extrabold md:text-lg outline-none w-full border-b-2 border-b-black border-dotted"
                        value={name}
                        placeholder="Pick a name..."
                        onChange={e => {
                            onChangedName(e.target.value);
                        }}
                    />
                </div>
                <div className="flex justify-start md:justify-center items-center gap-x-2 md:gap-x-4 whitespace-nowrap">
                    <span>
                        {addedTracks.length}&nbsp;
                        <FontAwesomeIcon icon={faMusic} className="inline md:hidden" />
                        <span className="hidden md:inline">track{addedTracks.length === 1 ? "" : "s"}</span>
                    </span>
                    <span>{seconds2pretty(seconds)}</span>
                    <button
                        onClick={() => setExpanded(!expanded)}
                    >
                        <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown}></FontAwesomeIcon>
                    </button>
                </div>
                <div className="flex justify-end items-center">
                    <button
                        className="inline-block py-2 px-4 font-semibold text-base rounded-lg shadow-md bg-white text-black hover:text-white group hover:bg-black"
                        onClick={() => {
                            setCreating(true);

                            onCreate()
                                .finally(() => setCreating(false));
                        }}
                    >
                        {
                            isCreating
                                ? <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
                                : "Create"
                        }
                    </button>
                </div>
            </div>
            <div className={(expanded ? "" : "hidden ") + "pt-5"}>
                <div className="max-h-28 overflow-x-hidden overflow-y-scroll w-full">
                    {addedTracks.map((x, i) => (
                        <PlaylistSummaryItem
                            key={x.id}
                            track={x}
                            
                            canMoveUp={i !== 0}
                            canMoveDown={i !== addedTracks.length - 1}

                            onMoveUp={() => {
                                onChangeTracks(addedTracks.map((y, ii, a) => ii === i - 1 ? x : ii === i ? a[i-1] : y));
                            }}
                            onMoveDown={() => {
                                onChangeTracks(addedTracks.map((y, ii, a) => ii === i + 1 ? x : ii === i ? a[i+1] : y));
                            }}
                            onDelete={() => {
                                onChangeTracks(addedTracks.filter(y => y.id !== x.id));
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PlaylistSummary;