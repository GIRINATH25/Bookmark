import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import style from "../ViewBook.module.css";

const ViewBookmark = () => {
  const navi = useNavigate();
  const { result } = useLocation().state || {};
  const [useData, setUseData] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = React.useState([]);
  const [editBookmarkId, setEditBookmarkId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await axios.get("/bookmark/" + result.id);

      if (data.data.success === "success") {
        setUseData(data.data.message);
      } else {
        navi("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const del = async (id) => {
    try {
      const res = await axios.delete("/bookmark/" + id);
      toast(res.data.message);
      setTimeout(()=>{
        window.location.reload();
      },3000);
    } catch (err) {
      console.log(err);
      toast.error("error");
    }
  };

  const postBookmark = async () => {
    try {
      const userid = result.id;
      const res = await axios.post("/bookmark", {
        userid,
        title,
        url,
        description,
        tags,
      });
      toast.info(res.data.message);
      setTimeout(()=>{
        window.location.reload();
      },3000)
    } catch (err) {
      console.log(err);
      toast.error("error");
    }
  };

  const handleEditClick = (id) => {
    setEditBookmarkId(id);
    const selectedBookmark = useData.find((bookmark) => bookmark._id === id);
    if (selectedBookmark) {
      setTitle(selectedBookmark.title);
      setUrl(selectedBookmark.url);
      setDescription(selectedBookmark.description);
      setTags([...selectedBookmark.tags]);
    }
  };

  const handleUpdateBookmark = async () => {
    try {
      const res = await axios.put("/bookmark/" + editBookmarkId, {
        title,
        url,
        description,
        tags,
      });
      toast.info(res.data.message);
      setTimeout(()=>{
        window.location.reload();
      },3000)
    } catch (err) {
      console.log(err); 
      toast.error("error");
    }
  };

  const cancelEdit = () => {
    setEditBookmarkId(null);
    setTitle("");
    setUrl("");
    setDescription("");
    setTags([]);
  };

  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = (e) => {
    if (e.target.value !== "" && tags.length < 2) {
      console.log(tags.length);
      setTags([...tags, e.target.value]);
      e.target.value = "";
    }
  };

  return (
    <div className={style.con}>
      <div className={style.inputDetails}>
        {editBookmarkId ? (
          <div className={style.inputDelDiv}>
            <div><input
            className={style.inputText}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            </div>
            <div>
            <input
            className={style.inputText}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Url"
            />
            </div>
            <div>
            <input
            className={style.inputText}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            </div>
            <div className={style.tagsBox}>
              <ul>
                {tags.map((tag, index) => (
                  <li key={index}>
                    <span className={style.tagName}>{tag} </span>
                    <span className={style.close} onClick={() => removeTags(index)}>
                      <FontAwesomeIcon icon={faXmark} />
                    </span>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                onKeyUp={(event) =>
                  event.key === "Enter" ? addTags(event) : null
                }
                placeholder="Press enter to add tags"
              />
            </div>
            <div className={style.buttonGrid}>
            <button onClick={handleUpdateBookmark}>Update</button>
            <button onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className={style.inputDelDiv}>
            <div><input
              className={style.inputText}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            </div>
            <div>
            <input
            className={style.inputText}
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Url"
            />
            </div>
            <div>
            <input
            className={style.inputText}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            </div>
            <div className={style.tagsBox}>
              <ul>
                {tags.map((tag, index) => (
                  <li key={index}>
                    <span className={style.tagName}>{tag} </span>
                    <span className={style.close} onClick={() => removeTags(index)}>
                    <FontAwesomeIcon icon={faXmark} />
                    </span>
                  </li>
                ))}
              </ul>
              <input
                type="text"
                onKeyUp={(event) =>
                  event.key === "Enter" ? addTags(event) : null
                }
                placeholder="Press enter to add tags(2)"
              />
            </div>
            <div className={style.buttonGrid}>
            <button onClick={postBookmark}>Add</button>
            </div>
          </div>
        )}
      </div>
      <input
      className={style.inputText}
        type="text"
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th >
              Title
            </th>
            <th >
              Url
            </th>
            <th >
              Description
            </th>
            <th >
              Tags
            </th>
            <th >
            </th>
          </tr>
        </thead>
        {useData.length > 0 &&
          useData
            .filter((u) => {
              return search.toLowerCase() === ""
                ? u
                : u.title.toLowerCase().includes(search.toLowerCase());
            })
            .map((u) => {
              return (
                <tbody key={u._id}>
                  <tr>
                    <td data-label="Title">{u.title}</td>
                    <td data-label="Url">{u.url}</td>
                    <td data-label="Description">{u.description}</td>
                    <td data-label="Tags">{u.tags.join("🏷️")}</td>
                    <td data-label="">
                      <button
                        className={style.edit}
                        onClick={() => handleEditClick(u._id)}
                      >
                        Edit
                      </button>
                      <button
                        className={style.delete}
                        onClick={() => del(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              );
            })}
      </table>
    </div>
  );
};

export default ViewBookmark;
