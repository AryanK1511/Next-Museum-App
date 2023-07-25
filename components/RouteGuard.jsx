import React from "react";
import { useState, useEffect } from 'react';
import { useAtom } from "jotai";
import { favouritesAtom, searchHistoryAtom } from "@/store";
import { useRouter } from "next/router";
import { getFavourites, getHistory } from "@/lib/userData";
import { isAuthenticated } from "@/lib/authenticate";

const PUBLIC_PATHS = ['/register', '/login', '/', '/_error'];

export default function RouteGuard(props) {
    // References to atoms
    const [ favouritesList, setFavouritesList ] = useAtom(favouritesAtom);
    const [ searchHistory, setSearchHistory ] = useAtom(searchHistoryAtom);
    // Authorization State
    const [authorized, setAuthorized] = useState(false);
    // Router instance
    const router = useRouter();

    // Function to update the atoms in our store before redirecting the user
    async function updateAtoms() {
        setFavouritesList(await getFavourites()); 
        setSearchHistory(await getHistory());
    }    

    // Run auth check on initial load
    useEffect(() => {
        updateAtoms();
        authCheck(router.pathname);
        // on route change complete - run auth check
        router.events.on('routeChangeComplete', authCheck);
        // unsubscribe from events in useEffect return function
        return () => {
        router.events.off('routeChangeComplete', authCheck);
        };
    }, []);

    // Redirect to login page if accessing a private page and not logged in
    function authCheck(url) {
        const path = url.split('?')[0];
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
          setAuthorized(false);
          router.push('/login');
        } else {
          setAuthorized(true);
        }
      }

    return <>{props.children}</>
}