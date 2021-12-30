import { Component, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";

import "../playimage.css";

export default class PlaylistSummaryItem extends Component {
    state = {
        play: false
    }
    audio = createRef()

    componentDidMount() {
        if (this.audio.current) {
            this.audio.current.addEventListener('ended', () => this.setState({ play: false }));
            this.audio.current.addEventListener('pause', () => this.setState({ play: false }));
        }
    }
    
    componentWillUnmount() {
        if (this.audio.current) {
            this.audio.current.removeEventListener('ended', () => this.setState({ play: false }));  
            this.audio.current.removeEventListener('pause', () => this.setState({ play: false }));  
        }
    }

    togglePlay = () => {
        this.setState({ play: !this.state.play }, () => {
            if (this.state.play) {
                [...document.getElementsByTagName("audio")].forEach(x => {x.pause(); x.currentTime = 0;})
            }
            this.state.play ? this.audio.current.play() : this.audio.current.pause();
            if (!this.state.play) this.audio.current.currentTime = 0;
        });
    }

    render() {
        let artistsName = this.props.track.artists.map(x => x.name).join(", ");

        return (
            <div className="py-1 flex items-center justify-between">
                {this.props.track.preview_url ? (
                    <audio className="hidden" hidden={true} ref={this.audio}>
                        <source src={this.props.track.preview_url} />
                    </audio>
                ) : null}
                <div className="flex gap-x-2 w-full overflow-hidden items-center">
                    <button
                        className="shrink-0"
                        disabled={!this.props.track.preview_url}
                        onClick={this.props.track.preview_url ? this.togglePlay : undefined}
                        title={this.props.track.preview_url ? "Play track" : "Track preview unavailable"}
                    >
                        <img
                            className="h-10 rounded lg:h-6 h-10 playimage"
                            src={this.props.track.album.images.slice(-1)[0].url}
                            alt={this.props.track.album.name}
                                data-playing={this.props.track.preview_url ? this.state.play : "close"}
                        />
                    </button>
                    <div className="flex gap-x-2 w-full overflow-hidden flex-col lg:flex-row">
                        <p className="truncate text-sm lg:text-base order-last lg:order-none">{artistsName}</p>
                        <p className="font-bold truncate text-sm lg:text-base">{this.props.track.name}</p>
                    </div>
                </div>
                <div className="flex gap-x-2 shrink-0">
                    <button
                        onClick={this.props.onMoveUp}
                        disabled={!this.props.canMoveUp}
                    >
                        <FontAwesomeIcon icon={faChevronUp} color={this.props.canMoveUp ? undefined : "transparent"} />
                    </button>
                    <button
                        onClick={this.props.onMoveDown}
                        disabled={!this.props.canMoveDown}
                    >
                        <FontAwesomeIcon icon={faChevronDown} color={this.props.canMoveDown ? undefined : "transparent"} />
                    </button>
                    <button onClick={this.props.onDelete}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            </div>
        )
    }
}