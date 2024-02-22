import { useState } from "react"

const Blog = ({ blog }) => {
    const [showDetails, setShowDetails] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const addLike = () => {
        console.log('add a like!')
    }

    const blogDetails = () => (
            <div>
                <div>
                <a href={blog.url}>{blog.url}</a>
                </div>
                <div>
                likes {blog.likes} <button onClick={addLike}>like</button>
                </div>
                <div>
                {blog.user ?
                    blog.user.name :
                    null
                }
                </div>
            </div>
    )

    const detailsButton = () => {
        if (showDetails) {
            return (
                <button onClick={() => setShowDetails(false)}>hide</button>
            )
        } else {
            return (
                <button onClick={() => setShowDetails(true)}>view</button>
            )
        }
    }

    return (
        <div style={blogStyle}>
            <div>
            {blog.title} | {blog.author} {detailsButton()}
            </div>
            {showDetails ?
                blogDetails() :
                null}
        </div>  
    )
}

export default Blog