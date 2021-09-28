import { h, Fragment } from "preact"
import { useState, useEffect } from "preact/hooks"
import { useHistory } from "react-router-dom"
import { useSWRConfig } from "swr"

import GitHubLoginButton from "./GitHubLoginButton"
import * as api from "../api"

import styles from "./LoginPage.module.css"

// Handles GitHub OAuth callback
export default function LoginPage() {
    const { searchParams } = new URL(document.location.href)
    const code = searchParams.get("code")
    const next = searchParams.get("next")

    const history = useHistory()
    const [error, setError] = useState(null)
    const { mutate } = useSWRConfig()

    useEffect(() => {
        if (code) {
            setError(null)
            api.post("/user", { code }).then((user: api.User) => {
                if (next) {
                    mutate("/user", user)
                    history.replace(next)
                } else {
                    window.close()
                }
            }).catch(error => {
                console.error(error)
                setError(error)
            })
        }
    }, [code, history, mutate, next])

    return <>
        <main class={styles.container}>
            {error ? <div class={styles.card}>
                <p class={styles.error}>
                    Sign-in error.<br />
                    {error.message}
                </p>
                <p>
                    Try again:
                </p>
                <GitHubLoginButton />
            </div> : code ? <>
                Signing in...
            </> : <div class={styles.card}>
                <p>
                    Sign in to decomp.me
                </p>
                <GitHubLoginButton />
            </div>}
        </main>
    </>
}
