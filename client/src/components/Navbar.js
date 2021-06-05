import React,{useContext,useRef,useEffect,useState} from 'react'
import {Link ,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = ()=>{
    const  searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [userDetails,setUserDetails] = useState([])
     const {state,dispatch} = useContext(UserContext)
     const history = useHistory()
     useEffect(()=>{
         M.Modal.init(searchModal.current)
     },[])
     const renderList = ()=>{
       if(state){
           return [
            <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"white"}}>search</i></li>,
            <li key="2"><Link to="/profile">Profile</Link></li>,
            <li key="3"><Link to="/create">Create Post</Link></li>,
            <li key="4" ><Link to="/myfollowingpost" >Following Posts</Link></li>,
            <li  key="5">
             <button className="btn #c62828 red darken-3"
            onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push('/signin')
            }}
            >
                Logout
            </button>
            </li>
         
            
           ]
       }else{
         return [
          <li  key="6"><Link to="/signin">Login</Link></li>,
          <li  key="7"><Link to="/signup">Sign up</Link></li>
         
         ]
       }
     }


     const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
          setUserDetails(results.user)
        })
     }
     const navStyle = {
            paddingBottom:"2%",
            paddingRight:"2%",
            paddingLeft:"2%",
            zIndex:"100", 
            overflow: "hidden",
            position: "fixed", 
            top:"0",
            width: "100%",
       background: "linear-gradient(#185a9d,#43cea2)",
      //  backgroundColor:"#67C8FF"
     };
     const logoStyle = {
       zIndex: "200",
       width: "150px",
       borderBottomRightRadius:"20px",
       borderBottomLeftRadius:"20px",
       position: "fixed",
       top: "0",
       left:"0.8%",
     };
    return (
      <div>
        <div style={logoStyle}>
        <Link to={state ? "/" : "/signin"}>
            <img src="https://res.cloudinary.com/communitty/image/upload/v1622657034/commuNITTyImages/FinalLogo_kiyxca.jpg" style={logoStyle}/>
        </Link>
        </div>
        <nav style={navStyle}>
          <div className="nav-wrapper" style={{ fontFamily:"'Roboto', sans-serif",}}>
            <ul id="nav-mobile" className="right">
              {renderList()}
            </ul>
          </div>
          <div
            id="modal1"
            className="modal"
            ref={searchModal}
            style={{ color: "black" }}
          >
            <div className="modal-content">
              <input
                type="text"
                placeholder="Search Users by Email...."
                value={search}
                onChange={(e) => fetchUsers(e.target.value)}
              />
              <ul className="collection" style={{ color: "black !important" }}>
                {state?(userDetails.map((item) => {
                  return (
                    <Link
                      to={
                        item._id !== state._id
                          ? "/profile/" + item._id
                          : "/profile"
                      }
                      onClick={()=>
                      {
                        window.location.href = (item._id !== state._id
                          ? "/profile/" + item._id
                          : "/profile");
                      }
                      }
                      className="searchedUser"
                    >
                      <li className="collection-item" style={{ color: "black !important" }}>{item.email}</li>
                    </Link>
                  );
                })):<p></p>}
              </ul>
            </div>
            <div className="modal-footer">
              <button
                className="modal-close waves-effect waves-green btn-flat"
                onClick={() => setSearch("")}
              >
                close
              </button>
            </div>
          </div>
        </nav>
      </div>
    );
}


export default NavBar