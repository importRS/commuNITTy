import React, { useState, useEffect } from 'react'
import M from 'materialize-css'
import { useHistory } from 'react-router-dom'
const CretePost = () => {
  const history = useHistory()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState(undefined)
  useEffect(() => {
    if (url) {
      uploadFields()
    }
  }, [url])

  const uploadPic = () => {
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "preset_nitt")
    data.append("cloud_name", "communitty")
    fetch("https://api.cloudinary.com/v1_1/communitty/image/upload", {
      method: "post",
      body: data
    })
      .then(res => res.json())
      .then(data => {
        setUrl(data.url)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const uploadFields = ()=> {
    fetch("/createpost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        title,
        body,
        pic: url
      })
    }).then(res => res.json())
      .then(data => {

        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" })
        }
        else {
          M.toast({ html: "Created post Successfully", classes: "#43a047 green darken-1" })
          history.push('/')
        }
      }).catch(err => {
        console.log(err)
      })
  }

  const postData = () => {
    if (image) {
      uploadPic()
    } else {
      uploadFields()
    }
  }

  return (
    <div className="card input-filed"
      style={{
        margin: "0px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center"
      }}
    >
      <input
        type="text"
        placeholder="  Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="  Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{height:"200px",width:"460px"}}
      />
      <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
          <span>Upload Image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
        onClick={() => postData()}

      >
        Create Post
            </button>

    </div>
  )
}


export default CretePost
