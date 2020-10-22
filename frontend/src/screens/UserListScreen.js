import React, { useEffect } from "react";

import { LinkContainer } from "react-router-bootstrap";

import { Table, Button } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";

import Message from "../components/Message";
import Loader from "../components/Loader";

import { listUsers } from "../actions/userActions";

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  // Get current user login info
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    // Dispatch the fetch for all users only if user is admins
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo]);

  const deleteHandler = (id) => {
    console.log("Delete");
  };

  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                {/* Icon to display whether user is admin */}
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: "red" }}></i>
                  )}
                </td>
                <td>
                  {/* Edit user */}
                  <LinkContainer to={`/user/${user._id}/edit`}>
                    <Button className="btn-sm mx-1">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  {/* Delete user */}
                  <Button
                    variant="danger"
                    className="btn-sm mx-1"
                    onClick={() => deleteHandler(user._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
