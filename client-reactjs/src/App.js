import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const GasValueCell = styled.td`
  background-color: ${(props) => (props.gas > 650 ? "#ff6666" : "transparent")};
  color: ${(props) => (props.gas > 650 ? "white" : "black")};
  padding: 8px; border-radius: 10px;`;



  useEffect(() => {
    // axios.get("http://192.168.1.9:8800/sensor").then((response) => {
    axios.get("http://192.168.1.229:8800/sensor").then((response) => {
      // axios.get("http://192.168.1.12:8800/sensor").then((response) => {
      const data = response.data;
      setItems(data);
    });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="posts_wrapper">
      <div className="container">
        <button className="btn btn-primary mb-4">New Post</button>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nhiệt độ</th>
              <th>Độ ẩm</th>
              <th>Khí gas</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.temperature}</td>
                <td>{item.humid}</td>
                <td>
                  <GasValueCell gas={item.gas}>{item.gas}</GasValueCell>
                </td>
                <td>
                  <button className="btn btn-primary">Update</button>
                </td>
                <td>
                  <button className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>


        </table>
        <div className="pagination d-flex justify-content-center align-items-center">
          <button
            className="btn btn-primary"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="mx-3">Page {currentPage}</span>
          <button
            className="btn btn-primary"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastItem >= items.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
