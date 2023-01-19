import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
function App() {
  let [data1, setData1] = useState([]);
  let [firstPage, setFirstPage] = useState(null);
  let [finalPage, setFinalPage] = useState(null);
  let initialPage = 0;
  let lastPage = 0;
  let allData = [];
  const numberOfPages = async () => {
    try {
      let countPages = await axios({
        method: "GET",
        url: `https://app.geckoterminal.com/api/p1/eth/pools?include=dex,dex.network,dex.network.network_metric,tokens&page=1}&include_network_metrics=true`,
        // headers: {
        //   "Content-Type": "application/json"
        // }
      }).then(function (response) {
        return response.data.links.last.meta.series;
      });
      initialPage = countPages[0];
      lastPage = countPages[4];
    } catch (error) {
      console.log("errors", error);
    }
    setFirstPage(initialPage);
    setFinalPage(lastPage);
    endP();
  };
  const endP = async () => {
    try {
      console.log("inside final", finalPage);
      for (let page = firstPage; page <= 3; page++) {
        let newArr = await axios({
          method: "GET",
          url: `https://app.geckoterminal.com/api/p1/eth/pools?include=dex,dex.network,dex.network.network_metric,tokens&page=${page}&include_network_metrics=true`,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(function (response) {
          console.log("res", response.data.data);
          return response.data.data;
        });
        allData.push(...newArr);
      }
      setData1(allData);
    } catch (error) {
      console.log("err", error);
    }
  };
  useEffect(() => {
    numberOfPages();
  }, []);
  return (
    <div>
      <table style={{ width: "50%" }}>
        <thead>
          <th>Number</th>
          <th>Address</th>
          <th>Name</th>
          <th>relation id</th>
        </thead>
        <tbody>
          {data1.map(({ attributes, relationships }, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{attributes.address}</td>
                <td>{attributes.name}</td>
                <td>
                  {relationships.tokens.data.map(({ id }) => {
                    return `, ${id}`;
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default App;
