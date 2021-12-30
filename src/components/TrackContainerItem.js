import { Component, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus } from "@fortawesome/free-solid-svg-icons";

import "../playimage.css";

class TrackContainerItem extends Component {
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
            <div className="flex w-full min-w-0">
                {this.props.track.preview_url ? (
                    <audio className="hidden" hidden={true} ref={this.audio}>
                        <source src={this.props.track.preview_url} />
                    </audio>
                ) : null}
                <div className="h-10 mr-2 shrink-0">
                    <button
                        disabled={!this.props.track.preview_url}
                        onClick={this.props.track.preview_url ? this.togglePlay : undefined}
                    >
                        <img
                            className="h-10 playimage"
                            src={this.props.track.album.images.slice(-1)[0].url}
                            alt={this.props.track.album.name}
                            data-playing={this.props.track.preview_url ? this.state.play : "close"}
                        />
                    </button>
                </div>
                <div className="w-full grow-0 overflow-hidden">
                    <p className="text-sm font-bold truncate break-all" title={this.props.track.name}>{this.props.track.name}</p>
                    <p className="text-sm truncate break-all" title={artistsName}>{artistsName}</p>
                </div>
                <div className="shrink-0 ml-2 flex justify-center items-center">
                    <button
                        className={"h-max cursor-pointer" + (this.props.isAdded ? "" : " p-px")}
                        onClick={this.props.isAdded ? this.props.onRemoveTrack : this.props.onAddTrack}
                    >
                        <FontAwesomeIcon icon={this.props.isAdded ? faCheck : faPlus} className={this.props.isAdded ? "" : "p-px"} />
                    </button>
                </div>
            </div>
        )
    }
}

export default TrackContainerItem;