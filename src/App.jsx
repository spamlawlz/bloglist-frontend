import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
        const user = await loginService.login({ username, password, })
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
    } catch (exception) {
        console.log('oops')
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
        <div>
            Username
            <input 
                type='text' 
                name='Username' 
                value={username} 
                onChange={({target})=> setUsername(target.value)}
            />
        </div>
        <div>
            Password
            <input 
                type='password' 
                name='Password' 
                value={password} 
                onChange={({target}) => setPassword(target.value)}
            />
        </div>
        <button type='submit'>login</button>
    </form>
  )

  return (
    <div>
        { user === null ?
            loginForm() :
            <div>
                <p>{user.name} logged in</p>
                <h2>blogs</h2>
                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog} />
                )}
            </div>}
    </div>
  )
}

export default App