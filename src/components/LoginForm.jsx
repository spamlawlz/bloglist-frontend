import { useState } from 'react'

const LoginForm = ({handleLogin}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const createUser = (event) => {
        event.preventDefault()
        handleLogin({
            username: username,
            password: password
        })

        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <h2>log in</h2>
            <form onSubmit={createUser}>
                <div>
                    Username
                    <input 
                        value={username} 
                        onChange={({target})=> setUsername(target.value)}
                    />
                </div>
                <div>
                    Password
                    <input 
                        type='password' 
                        value={password} 
                        onChange={({target}) => setPassword(target.value)}
                    />
                </div>
                <button type='submit'>login</button>
            </form>
        </div>
    )
}

export default LoginForm