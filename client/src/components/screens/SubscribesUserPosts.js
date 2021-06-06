import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/getsubpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);

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

  const posterStyle = {
    fontSize: "1.5rem",
    fontFamily: "'Slabo 27px', 'serif'",
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
    padding: "1.47%",
    borderTopLeftRadius: "0.8rem",
    borderTopRightRadius: "0.8rem",
    backgroundColor: "white",
    // marginTop: "2%",
  };

  return (
    <div className="home" style={{ marginLeft: "10%", marginRight: "10%", opacity: "0.85" }}>
      {data.map((item) => {
        return (
          <div className="col s12 l7">
            <h3
              className="header"
              style={{
                // paddingLeft: "17%",
                margin: "0",
                // backgroundColor: "white !important",
              }}
            >
              <Link
                to={
                  item.postedBy._id != state._id
                    ? "/profile/" + item.postedBy._id
                    : "/profile"
                }
                style={posterStyle}
                className="postingUser"
              >
                {item.postedBy.name}
              </Link>
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
                        width: "90%",
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
        );
      })}
    </div>
  );
};

export default Home;
