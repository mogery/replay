import { useRef } from "react";
import { Link } from "react-router-dom";

function AppRoot() {
    let d = new Date();
    d.setDate(d.getDate() - d.getDay());

    let nameRef = useRef();

    return (
        <div className="min-h-screen w-full h-max justify-center items-center bg-white flex">
            <div>
                <h1 className="text-5xl font-extrabold mb-4 text-center w-full">Let's get started</h1>
                <Link
                    to={() => ({
                    pathname: "/app/create",
                    search: "?" + new URLSearchParams(nameRef.current ? {
                            name: nameRef.current.value
                    } : {}).toString()
                    })}
                    className="block ml-auto mr-auto w-max py-1 px-2 rounded-xl border-2 border-black hover:bg-black hover:text-white font-bold ml-2"
                >Create a playlist</Link>
            </div>
        </div>
    )
}

export default AppRoot;