import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogListUser')
    if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
        const user = await loginService.login({ username, password, })

        window.localStorage.setItem(
            'loggedBlogListUser', JSON.stringify(user)
        )
        blogService.setToken(user.token)

        setUser(user)
        setUsername('')
        setPassword('')
    } catch (exception) {
        console.log('handleLogin exception')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()
    try {
        const blog = await blogService.create({title: title, author: author, url: url})
        setBlogs(blogs.concat(blog))
    } catch (exception) {
        console.log('handleCreateBlog exception')
    }

    setTitle('')
    setAuthor('')
    setURL('')
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

  const blogForm = () => (
    <form onSubmit={handleCreateBlog}>
        <div>
            title:
            <input 
                type='text' 
                name='Title' 
                value={title} 
                onChange={({target})=> setTitle(target.value)}
            />
        </div>
        <div>
            author:
            <input 
                type='text' 
                name='Author' 
                value={author} 
                onChange={({target})=> setAuthor(target.value)}
            />
        </div>
        <div>
            url:
            <input 
                type='text' 
                name='URL' 
                value={url} 
                onChange={({target})=> setURL(target.value)}
            />
        </div>
        <button type='submit'>create</button>
    </form>
  )

  const content = () => (
    <div>
        <h2>blogs</h2>
        {user.name} logged in
            <form onSubmit={handleLogout}>
                <button type='submit'>logout</button>
            </form>
        <h2>create new</h2>
        {blogForm()}
        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
        )}
    </div>
  )

  return (
    <div>
        { user === null ?
            loginForm() :
            content()
        }
    </div>
  )
}

export default App