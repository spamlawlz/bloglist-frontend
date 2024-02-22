import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFormRef = useRef()
  const loginFormRef = useRef()

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

  const handleLogin = async (userObject) => {
    loginFormRef.current.toggleVisibility()
    try {
        const user = await loginService.login(userObject)

        window.localStorage.setItem(
            'loggedBlogListUser', JSON.stringify(user)
        )
        blogService.setToken(user.token)
        setUser(user)
    } catch (exception) {
        setMessage(`wrong username or password`)
        setTimeout(() => { setMessage(null)}, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogListUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
        const blog = await blogService.create(blogObject)
        blog.user = user
        setBlogs(blogs.concat(blog))
        setMessage(`new blog ${blog.title} by ${blog.author} added`)
        setTimeout(() => { setMessage(null)}, 5000)
    } catch (exception) {
        console.log('createBlog exception')
    }

  }

  const notification = (message) => (
    message === null ?
        null :
        (
            <div className='error'>
                {message}
            </div>
        )
  )

  const loggedInContent = () => (
    <div>
        <div>
            {user.name} logged in
            <form onSubmit={handleLogout}>
                <button type='submit'>logout</button>
            </form>
        </div>
        <Togglable buttonLabel='create' ref={blogFormRef}>
            <BlogForm createBlog={addBlog}/>
        </Togglable> 
        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
        )}
    </div>
  )

  const loggedOutContent = () => (
    <Togglable buttonLabel='login' ref={loginFormRef}>
        <LoginForm handleLogin={handleLogin}/>
    </Togglable> 
  )

  return (
    <div>
        <h1>blogs</h1>
        {notification(message)}
        {user ?
            loggedInContent() :
            loggedOutContent()
        }
    </div>
  )
}

export default App