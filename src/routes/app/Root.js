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
                    className="block mx-auto w-max py-2 px-4 font-semibold text-base rounded-lg shadow-md bg-white text-black hover:bg-black hover:text-white group"
                >Create a playlist</Link>
            </div>
        </div>
    )
}

export default AppRoot;