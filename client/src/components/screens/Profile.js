import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile  = ()=>{
    const [data, setData] = useState([]);
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    useEffect(()=>{
       fetch('/mypost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           setData(result.mypost)
       })
    },[])
    useEffect(()=>{
       if(image){
        const imgdata = new FormData()
        imgdata.append("file",image)
        imgdata.append("upload_preset","preset_nitt")
        imgdata.append("cloud_name","communitty")
        fetch("https://api.cloudinary.com/v1_1/communitty/image/upload",{
            method:"post",
            body:imgdata
        })
        .then(res=>res.json())
            .then(imgdata=>{
    
       
           fetch('/updatepic',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:imgdata.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
               //window.location.reload()
           })
       
        })
        .catch(err=>{
            console.log(err)
        })
       }
    },[image])
    const updatePhoto = (file)=>{
        setImage(file)
    }

    const likePost = (id) => {
        fetch("/like", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                //   console.log(result)
                const newData = data.map((item) => {
                    if (item._id == result._id) {
                        return { ...item, likes: result.likes };
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const unlikePost = (id) => {
        fetch("/unlike", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                // if ()
                //     console.log()
                // else console.log("not equal")
                //   console.log(result)
                const newData = data.map((item) => {
                    if (item._id == result._id) {
                        return { ...item, likes: result.likes };
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const makeComment = (text, postId) => {
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
                postId,
                text,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                const newData = data.map((item) => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setData(newData);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                const newData = data.filter((item) => {
                    return item._id !== result._id;
                });
                setData(newData);
            });
    };

    const scrollStyle = {
        height: "23rem",
        overflow: "auto",
    };
    const divStyle = {
        height: "28rem",
        paddingTop: "10px",
    };
    const imgParStyle = {
        width: "45%",
        position: "relative",
    };
    const imgStyle = {
        maxWidth: "100%",
        maxHeight: "100%",
        margin: "0",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    };
    const deleteStyle = {
        float: "right",
        // marginRight: "2%",
        color: "#D22B2B",
        fontSize: "30px",
        padding: "1%",
        borderTopRightRadius: "0.8rem",
        borderBottomRightRadius: "0.8rem",
        backgroundColor: "white",
        // marginTop: "2%",
    };

   return (
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
              margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>

         
           <div style={{
               display:"flex",
               justifyContent:"space-around",
              
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={state?state.pic:"loading"}
                   />
                 
               </div>
               <div>
                   <h4>{state?state.name:"loading"}</h4>
                   <h5>{state?state.email:"loading"}</h5>
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6>{data.length} posts</h6>
                       <h6>{state?state.followers.length:"0"} followers</h6>
                       <h6>{state?state.following.length:"0"} following</h6>
                   </div>

               </div>
           </div>
        
            <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>Update pic</span>
                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            </div>      
           <div style={{ position:"absolute",left: "10%", right: "10%", opacity: "0.85" }}>
               {
                   data.map(item=>{
                       return(
                           <div className="col s12 l7">
                               <h3
                                   className="header"
                                   style={{
                                       // paddingLeft: "17%",
                                       margin: "0",
                                       // backgroundColor: "white !important",
                                   }}
                               >
                                <i
                                    className="material-icons"
                                    style={deleteStyle}
                                    onClick={() => deletePost(item._id)}
                                    title="Delete this Post"
                                >
                                    delete
                                </i>
                               </h3>
                               <div className="card horizontal" style={{ height: "80%" }}>
                                   <div className="card-image" style={imgParStyle}>
                                       <img src={item.photo} style={imgStyle} />
                                   </div>
                                   <div className="card-stacked">
                                       <div className="card-content" style={divStyle}>
                                           <h5
                                               style={{
                                                   fontFamily: "'Mate SC', serif",
                                                   marginBottom: "20px",
                                                   marginTop: "10px",
                                               }}
                                           >
                                               {item.title}
                                           </h5>
                                           <div style={scrollStyle}>
                                               <div
                                                   style={{
                                                       fontSize: "1.1rem",
                                                       fontFamily: "'Lora', serif",
                                                       padding: "5px",
                                                       whiteSpace: "pre-wrap",
                                                       backgroundColor: "#f9f9f9",
                                                   }}
                                               >
                                                   {item.body}
                                               </div>
                                               {item.comments.map((record) => {
                                                   return (
                                                       <h6
                                                           key={record._id}
                                                           style={{
                                                               fontSize: "1.1rem",
                                                           }}
                                                       >
                                                           <span
                                                               style={{
                                                                   fontWeight: "500",
                                                               }}
                                                           >
                                                               {record.postedBy.name}
                                                           </span>{" "}
                                                           {record.text}
                                                       </h6>
                                                   );
                                               })}
                                           </div>
                                       </div>
                                       <div className="card-action" style={{ float: "bottom" }}>
                                           <div style={{ position: "relative" }}>
                                               {item.likes.includes(state._id) ? (
                                                   <i
                                                       className="material-icons medium"
                                                       onClick={() => {
                                                           unlikePost(item._id);
                                                       }}
                                                       style={{
                                                           color: "blue",
                                                           fontSize: "30px",
                                                           marginTop: "1%",
                                                       }}
                                                       title="Unlike"
                                                   >
                                                       thumb_up
                                                   </i>
                                               ) : (
                                                   <i
                                                       className="material-icons medium"
                                                       onClick={() => {
                                                           likePost(item._id);
                                                       }}
                                                       style={{
                                                           color: "gray",
                                                           fontSize: "30px",
                                                           marginTop: "1%",
                                                       }}
                                                       title="Like"
                                                   >
                                                       thumb_up
                                                   </i>
                                               )}
                                               <h6
                                                   style={{
                                                       display: "inline-block",
                                                       position: "absolute",
                                                       left: "50px",
                                                   }}
                                               >
                                                   {item.likes.length} Likes
                    </h6>
                                               <h6
                                                   style={{
                                                       display: "inline-block",
                                                       position: "absolute",
                                                       right: "10px",
                                                   }}
                                               >
                                                   {item.comments.length} Comments
                    </h6>
                                           </div>

                                           <form
                                               onSubmit={(e) => {
                                                   e.preventDefault();
                                                   makeComment(e.target[0].value, item._id);
                                                   e.target[0].value = "";
                                               }}
                                           >
                                               <input
                                                   type="text"
                                                   placeholder="Add a Comment...."
                                                   style={{
                                                       display: "inline-block",
                                                       width: "85%",
                                                   }}
                                                   required
                                               />
                                               <button
                                                   className="btn-floating waves-effect waves-light"
                                                   type="submit"
                                                   name="action"
                                                   style={{
                                                       display: "inline-block",
                                                       marginLeft: "20px",
                                                   }}
                                               >
                                                   <i className="material-icons right">send</i>
                                               </button>
                                           </form>
                                       </div>
                                   </div>
                               </div>
                               <br></br>
                               <hr
                                   style={{
                                       backgroundImage:
                                           "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))",
                                       border: "none",
                                       height: "1px",
                                   }}
                               ></hr>
                               <br></br>
                           </div>
                       )
                   })
               }

           
           </div>
       </div>
   )
}


export default Profile