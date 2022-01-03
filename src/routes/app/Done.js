import { faCircleNotch, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import spotify from "../../spotify";

function AppDone() {
    let playlistId = new URLSearchParams(useLocation().search).get("id")
    let [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight
    ]);
    let [playlist, setPlaylist] = useState(undefined);
    let [opened, setOpened] = useState(false);

    useEffect(async() => {
        setPlaylist(await spotify.getPlaylist(playlistId));

        window.onresize = () => {
            setWindowSize([
                window.innerWidth,
                window.innerHeight
            ]);
        }
    }, [])

    if (!playlist) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <FontAwesomeIcon icon={faCircleNotch} className="fa-spin" />
            </div>
        )
    }

    return (
        <div className="w-full h-screen flex justify-center items-center text-center">
            <ReactConfetti
                width={windowSize[0]}
                height={windowSize[1]}
                recycle={false}
            />
            <div>
                {playlist.images.length > 0 
                    ? (
                        <img
                            alt="Playlist Cover"
                            src={playlist.images[0].url}
                            className="w-[50vw] md:w-[40vw] lg:w-[20vw] mb-4 mx-auto"
                        />
                    )
                    : null
                }
                <h2 className="font-extrabold text-5xl">All done!</h2>
                <p>Your playlist, <span className="font-bold">{playlist.name}</span>, is live.</p>
                <div className="flex justify-center items-center gap-x-4 mt-4">
                    <a
                        className="inline-block py-2 px-4 font-semibold text-base rounded-lg shadow-md bg-white text-black hover:bg-black hover:text-white group"
                        href={"spotify://playlist/" + playlist.id}
                        onClick={() => {
                            setOpened(true);
                        }}
                    >
                        Open
                    </a>
                    {
                        opened
                            ? (
                                <a
                                    className="inline-block py-2 px-4 font-semibold text-base rounded-lg shadow-md bg-white text-black hover:bg-black hover:text-white group"
                                    href={playlist.external_urls.spotify}
                                >
                                    Open on Web
                                </a>
                            )
                            : null
                    }
                    <Link
                        to="/app"
                        className="inline-block py-2 px-4 font-semibold text-base rounded-lg shadow-md bg-white text-black hover:bg-black hover:text-white group"
                    >
                        <FontAwesomeIcon
                            icon={faLongArrowAltLeft}
                            className="mr-1"
                        />
                        Back
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AppDone;