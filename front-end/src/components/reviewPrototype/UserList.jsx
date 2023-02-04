import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

const UserList = ({ mt }) => {
  const [userList, setUserList] = useState([]);
  const [rating, setRating] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState("");
  const [maxPages, setMaxPages] = useState(0);
  const entriesPerPage = 12;
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const un = auth.user.displayName;
  const muid = auth.muid;
  const pages = [];

  useEffect(() => {
    getUsers();
  }, [auth]);

  const getUsers = () => {
    if (auth) {
      if (mt) {
        getClients();
      } else {
        getMTs();
      }
    }
  };

  useEffect(() => {
    if (userList[0]) {
      sorter("firstName");
    }
  }, [userList[0]]);

  useEffect(() => {
    const filteredData = filtered();
    setFilteredUsers(filteredData);
  }, [filter]);

  const filtered = () => {
    return userList.filter((item) => {
      return (
        item.firstName.toLowerCase().includes(filter.toLowerCase()) ||
        item.lastName.toLowerCase().includes(filter.toLowerCase()) ||
        item.username.toLowerCase().includes(filter.toLowerCase())
      );
    });
  };

  const getClients = async () => {
    const req = await fetch("/api/user/client");
    const users = await req.json();
    setUserList(users);
  };

  const getMTs = async () => {
    const req = await fetch("/api/user/mt");
    const users = await req.json();
    setUserList(users);
  };

  const submitRating = (e, u) => {
    e.preventDefault();
    const uid = u._id;
    rateUser(uid);
  };

  const rateUser = async (u) => {
    const uid1 = muid;
    const uid2 = u;
    const req = await fetch("/api/rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ratingUser: uid1,
        ratedUser: uid2,
        rating: rating,
      }),
    });
    const rate = await req.json();
    console.log("Updated average:", rate.message);
    getUsers();
  };

  const changePage = (i) => {
    const math = currentPage + i;
    if (math < 0 || math > maxPages) {
      return;
    } else {
      setCurrentPage(math);
    }
  };

  const sorter = async (f) => {
    const filteredData = filtered();
    setMaxPages(Math.ceil(filteredData.length / entriesPerPage) - 1);
    if (f === "avgRating") {
      const sort = filteredData.sort((a, b) => {
        return b[f] - a[f];
      });
      setFilteredUsers(sort);
    } else {
      const sort = filteredData.sort((a, b) => {
        let fa = a[f].toLowerCase(),
          fb = b[f].toLowerCase();
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      });
      setFilteredUsers(sort);
    }
  };

  const detailPage = (u) => {
    navigate(`/client/user?id=${u}`);
  };

  const mtDetailPage = (u) => {
    navigate(`/mt/user?id=${u}`);
  };

  const bookingPage = (u) => {
    navigate(`/client/booking/${u}`);
  };

  const schedulePage = (u) => {
    navigate(`/mt/schedule/${u}`);
  };

  for (let i = 0; i < filteredUsers.length; i += entriesPerPage) {
    pages.push(filteredUsers.slice(i, i + entriesPerPage));
  }

  if (mt) {
    if (!pages[0]) {
      return (
        <div>
          <div className="flex flex-col gap-5">
            <button
              onClick={() => schedulePage(un)}
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-1/3 h-24 mx-auto"
            >
              Set Schedule
            </button>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search"
              className="mx-auto mb-5 border border-black"
            />
          </div>
          <div className="mb-10">
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("avgRating")}
            >
              Sort by rating
            </button>
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("firstName")}
            >
              Sort by first name
            </button>
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("lastName")}
            >
              Sort by last name
            </button>
          </div>
          <span className="text-3xl">Not Found</span>
        </div>
      );
    } else {
      return (
        <div>
          <div className="flex flex-col gap-5">
            <button
              onClick={() => schedulePage(un)}
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-1/3 h-24 mx-auto"
            >
              Set Schedule
            </button>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search"
              className="mx-auto mb-5 border border-black"
            />
          </div>
          <div>
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("avgRating")}
            >
              Sort by rating
            </button>
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("firstName")}
            >
              Sort by first name
            </button>
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("lastName")}
            >
              Sort by last name
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-5">
            {pages[currentPage].map((u) => {
              return (
                <div
                  key={u.username}
                  className="bg-purple-200 flex flex-col rounded-lg"
                >
                  <span>
                    Name: {u.firstName} {u.lastName}
                  </span>
                  <span>{u.username}</span>
                  <span>Rating: {u.avgRating} </span>
                  <div className="button-holder">
                    <button
                      onClick={() => detailPage(u.username)}
                      className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-1/2"
                    >
                      Details
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => submitRating(e, u)}
                    className="container mx-auto"
                  >
                    <input
                      type="text"
                      placeholder="Enter rating number"
                      onInput={(e) => setRating(e.target.value)}
                      className="w-1/2"
                    />
                    <button
                      type="submit"
                      className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl"
                    >
                      Submit Rating
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
          <button
            className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-32 mt-5"
            onClick={() => changePage(-1)}
          >
            {" "}
            Previous page
          </button>
          <button
            className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-32"
            onClick={() => changePage(1)}
          >
            {" "}
            Next page
          </button>
        </div>
      );
    }
  } else {
    if (!pages[0]) {
      return (
        <div>
          <div className="flex flex-col gap-5">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search"
              className="mx-auto mb-5 border border-black"
            />
          </div>
          <div className="mb-10">
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("avgRating")}
            >
              Sort by rating
            </button>
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("firstName")}
            >
              Sort by first name
            </button>
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("lastName")}
            >
              Sort by last name
            </button>
          </div>
          <span className="text-3xl">Not Found</span>
        </div>
      );
    } else {
      return (
        <div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search"
            className="mx-auto mb-5 border border-black"
          />
          <div className="mb-10">
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("avgRating")}
            >
              Sort by rating
            </button>
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("firstName")}
            >
              Sort by first name
            </button>
            <button
              className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
              onClick={() => sorter("lastName")}
            >
              Sort by last name
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-5">
            {pages[currentPage].map((u) => {
              return (
                <div
                  key={u.username}
                  className="bg-purple-200 flex flex-col rounded-lg"
                >
                  <span>
                    Name: {u.firstName} {u.lastName}
                  </span>
                  <span>{u.username}</span>
                  <span>Rating: {u.avgRating} </span>
                  <div className="button-holder">
                    <button
                      onClick={() => mtDetailPage(u.username)}
                      className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => bookingPage(u.username)}
                      className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-24"
                    >
                      Book
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => submitRating(e, u)}
                    className="container mx-auto"
                  >
                    <input
                      type="text"
                      placeholder="Enter rating number"
                      onInput={(e) => setRating(e.target.value)}
                      className="w-1/2"
                    />
                    <button
                      type="submit"
                      className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl"
                    >
                      Submit Rating
                    </button>
                  </form>
                </div>
              );
            })}
          </div>
          <button
            className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-32 mt-5"
            onClick={() => changePage(-1)}
          >
            {" "}
            Previous page
          </button>
          <button
            className="bg-red-400 hover:bg-blue-400 p-1 m-1 rounded-2xl w-32"
            onClick={() => changePage(1)}
          >
            {" "}
            Next page
          </button>
        </div>
      );
    }
  }
};
export default UserList;