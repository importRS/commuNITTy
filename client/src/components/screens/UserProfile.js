import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const Profile  = ()=>{
    const [userProfile,setProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
       fetch(`/user/${userid}`,{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           //console.log(result)
            setProfile(result);
       })
    },[])

    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(resdata=>{
        
            dispatch({ type: "UPDATE", payload: { following: resdata.following, followers:resdata.followers}})
            localStorage.setItem("user", JSON.stringify(resdata))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers: [...prevState.user.followers,resdata._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
            .then(resdata=>{
            
                dispatch({ type: "UPDATE", payload: { following: resdata.following, followers:resdata.followers}})
                localStorage.setItem("user", JSON.stringify(resdata))
            
             setProfile((prevState)=>{
                 const newFollower = prevState.user.followers.filter(item => item != resdata._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
             
        })
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

                const newData = userProfile.posts.map((item) => {
                    if (item._id == result._id) {
                        return { ...item, likes: result.likes };
                    } else {
                        return item;
                    }
                });
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        posts: newData
                        }
                    });
            })
            .catch((err) => {
                console.log(err)
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
                const newData = userProfile.posts.map((item) => {
                    if (item._id == result._id) {
                        return { ...item, likes: result.likes };
                    } else {
                        return item;
                    }
                });
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        posts: newData
                    }
                });
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
                const newData = userProfile.posts.map((item) => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        posts: newData
                    }
                });
            })
            .catch((err) => {
                console.log(err);
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
       <>
       {userProfile ?
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
               display:"flex",
               justifyContent:"space-around",
               margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={userProfile.user.pic}
                   />
               </div>
               <div>
                   <h4>{userProfile.user.name}</h4>
                   <h5>{userProfile.user.email}</h5>
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6>{userProfile.posts.length} posts</h6>
                       <h6>{userProfile.user.followers.length} followers</h6>
                       <h6>{userProfile.user.following.length} following</h6>
                   </div>
                   {showfollow?
                   <button style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followUser()}
                    >
                        Follow
                    </button>
                    : 
                    <button
                    style={{
                        margin:"10px"
                    }}
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollowUser()}
                    >
                        UnFollow
                    </button>
                    }
                   
                  

               </div>
           </div>
            <div style={{ position: "absolute", left: "10%", right: "10%", opacity: "0.85" }}>
               {
                   userProfile.posts.map(item=>{
                       return(
                           <div className="col s12 l7">
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
       
       
       : <h2>loading...!</h2>}
       
       </>
   )
}


export default Profile