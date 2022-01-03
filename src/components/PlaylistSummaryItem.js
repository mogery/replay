import { Component, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faTimes, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

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
        let artistsLinks = this.props.track.artists.map((x,i,a) => <a target="_blank" rel="noreferrer" key={x.id} href={x.external_urls.spotify}>{x.name}{i === a.length - 1 ? "": ", "}</a>);
        let artistsName = this.props.track.artists.map(x => x.name).join(", ");

        return (
            <div className="py-1 flex items-center justify-between">
                {this.props.track.preview_url ? (
                    <audio className="hidden" hidden={true} ref={this.audio}>
                        <source src={this.props.track.preview_url} />
                    </audio>
                ) : null}
                <div className="flex gap-x-2 w-full overflow-hidden items-center">
                    <a target="_blank" rel="noreferrer" href={this.props.track.album.external_urls.spotify}>
                        <img
                            className="h-10 lg:h-6"
                            src={this.props.track.album.images.slice(-1)[0].url}
                            alt={this.props.track.album.name}
                        />
                    </a>
                    <div className="flex gap-x-2 w-full overflow-hidden flex-col lg:flex-row">
                        <p className="truncate text-sm lg:text-base order-last lg:order-none" title={artistsName}>{artistsLinks}</p>
                        <p className="font-bold truncate text-sm lg:text-base" title={this.props.track.name}><a target="_blank" rel="noreferrer" href={this.props.track.external_urls.spotify}>{this.props.track.name}</a></p>
                    </div>
                </div>
                <div className="flex gap-x-2 shrink-0">
                    <button
                        className={this.props.track.preview_url ? "" : "hidden"}
                        disabled={!this.props.track.preview_url}
                        onClick={this.props.track.preview_url ? this.togglePlay : undefined}
                    >
                        <FontAwesomeIcon className="p-px" icon={this.state.play ? faPause : faPlay} />
                    </button>
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