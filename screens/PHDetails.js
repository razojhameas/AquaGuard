// PHDetails.js
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import axios from "axios";
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";

const PHDetails = () => {
  const [pHData, setPHData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/data/pH");
        setPHData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <Text>pH Details</Text>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLine data={pHData} x="timestamp" y="pH" />
      </VictoryChart>
    </View>
  );
};

export default PHDetails;
