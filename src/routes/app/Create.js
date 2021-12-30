import React, { useEffect, useState } from "react";

import TrackContainer from "../../components/TrackContainer";
import PlaylistSummary from "../../components/PlaylistSummary";
import spotify from "../../spotify";
import { uniqify, shufflify } from "../../util";
import { useHistory } from "react-router";

const loadingTexts = [
    "Crunching numbers...",
    "Crunching your data...",
    "Spying on you...",
    "Stalking your Spotify..."
];

function AppCreate() {
    let history = useHistory();
    let [name, setName] = useState("");
    let [data, setData] = useState(null);
    let [addedTracks, setAddedTracks] = useState([]);

    useEffect(async () => {
        let allTimeArtists = (await spotify.getMyTopArtists({
            limit: 50,
            time_range: "long_term"
        })).items;

        let midTimeArtists = (await spotify.getMyTopArtists({
            limit: 50,
            time_range: "medium_term"
        })).items;

        let rnArtists = (await spotify.getMyTopArtists({
            limit: 50,
            time_range: "short_term"
        })).items;

        let allTimeTracks = (await spotify.getMyTopTracks({
            limit: 50,
            time_range: "long_term"
        })).items;

        let recentLovedSongs = (await spotify.getMyTopTracks({
            limit: 50,
            time_range: "short_term"
        })).items;

        let recentlyLikedButNotFanArtists = uniqify(recentLovedSongs
            .flatMap(x => x.artists)
            .filter(x => !allTimeArtists.concat(midTimeArtists).find(y => y.id === x.id)), "id");
        
        let rlbntfaTracks = shufflify((await Promise.all(recentlyLikedButNotFanArtists.map(async x => {
            return (await spotify.getArtistTopTracks(x.id, "US")).tracks.slice(0,4);
        }))).flat(1).filter(x => !recentLovedSongs.find(y => y.id === x.id)))

        let recommendations = (await spotify.getRecommendations({
            seed_tracks: recentLovedSongs.slice(0, 5).map(x => x.id),
            limit: 100
        })).tracks.concat(
            (await spotify.getRecommendations({
                seed_artists: rnArtists.slice(0, 5).map(x => x.id),
                limit: 100
            })).tracks
        ).concat(
            (await spotify.getRecommendations({
                seed_genres: Object.entries(rnArtists.flatMap(x => x.genres).reduce((a,x) => {
                    if (!a[x]) a[x] = 0;
                    a[x]++;
                    return a
                }, {})).sort((a,b) => a[1] - b[1]).slice(0, 5).map(x => x[0]),
                limit: 100
            })).tracks
        )

        recommendations = shufflify(uniqify(recommendations, "id"))

        let dObj = {
            allTimeArtists,
            midTimeArtists,
            allTimeTracks,
            rnArtists,
            recentLovedSongs,
            recentlyLikedButNotFanArtists,
            rlbntfaTracks,
            recommendations
        };

        console.log(dObj)
        setData(dObj)
    }, [])

    if (!data) {
        return (
            <div className="min-h-screen w-full h-max justify-center bg-white p-12">
                <h1 className="text-5xl font-extrabold md:w-1/4 lg:w-1/5 mb-4">
                    {loadingTexts[Math.floor(Math.random() * loadingTexts.length)]}
                </h1>
            </div>
        );
    }
    
    return (
        <div className="w-full">
            <div className="min-h-screen w-full h-max justify-center bg-white p-6 md:p-12">
                <h1 className="text-5xl font-extrabold md:w-1/4 mb-4">Pick some songs.</h1>
                <TrackContainer
                    name="Your recent tracks"
                    tracks={data.recentLovedSongs}

                    addedTracks={addedTracks}
                    onAddTrack={x => setAddedTracks(s => s.concat([x]))}
                    onRemoveTrack={x => setAddedTracks(s => s.filter(y => y.id !== x.id))}
                />
                <TrackContainer
                    name="More from your new finds"
                    tracks={data.rlbntfaTracks}

                    addedTracks={addedTracks}
                    onAddTrack={x => setAddedTracks(s => s.concat([x]))}
                    onRemoveTrack={x => setAddedTracks(s => s.filter(y => y.id !== x.id))}
                />
                <TrackContainer
                    name="All-time favourites"
                    tracks={data.allTimeTracks}

                    addedTracks={addedTracks}
                    onAddTrack={x => setAddedTracks(s => s.concat([x]))}
                    onRemoveTrack={x => setAddedTracks(s => s.filter(y => y.id !== x.id))}
                />
                <TrackContainer
                    name="Recommendations for you"
                    tracks={data.recommendations}

                    addedTracks={addedTracks}
                    onAddTrack={x => setAddedTracks(s => s.concat([x]))}
                    onRemoveTrack={x => setAddedTracks(s => s.filter(y => y.id !== x.id))}
                />
            </div>
            <PlaylistSummary
                name={name}
                onChangedName={setName}
                addedTracks={addedTracks}
                onChangeTracks={setAddedTracks}
                onCreate={async () => {
                    let self = await spotify.getMe();

                    let list = await spotify.createPlaylist(
                        self.id,
                        {
                            name: name || new Date().toLocaleDateString(),
                            public: false,
                            collaborative: false,
                            description: "Created with re:play on " + new Date().toLocaleDateString() + "."
                        }
                    );

                    let pendingTracks = [...addedTracks].map(x => x.uri);
                    while (pendingTracks.length > 0) {
                        await spotify.addTracksToPlaylist(list.id, pendingTracks.splice(0, 100));
                    }

                    history.push({
                        pathname: "/app/done",
                        search: "?" + new URLSearchParams({
                            id: list.id
                        }).toString()
                    })
                }}
            />
        </div>
    );
}

export default AppCreate;